"""Append verified CC0 gong/bell and arrangement recipes; preserve the base library and user BGM."""
from pathlib import Path
import hashlib
import html
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DOC = ROOT / 'docs/audio'
manifest_path = DOC / 'manifest.json'
m = json.loads(manifest_path.read_text(encoding='utf8'))
old_assets = {a['id']: a['sha256'] for a in m['assets']}
old_cues = dict(m['cues'])
bgm = ROOT / 'public/assets/audio/The_Silent_Coup.mp3'
bgm_hash = hashlib.sha256(bgm.read_bytes()).hexdigest() if bgm.exists() else None
additions = [
    ('palace-gong', 'Gong, sweet', 'Joseph SARDIN', 'https://bigsoundbank.com/gong-sweet-s1482.html', 'https://bigsoundbank.com/UPLOAD/ogg/1482.ogg?v=d', '宮廷儀式感鑼聲／過場／慶賀尾聲', 0.20),
    ('palace-bell', 'Small Bell #1', 'GlaneurDeSons', 'https://bigsoundbank.com/clochette-1-s0292.html', 'https://bigsoundbank.com/UPLOAD/ogg/0292.ogg?v=d', '小鈴清音／線索揭示／慶賀尾聲', 0.16),
]
for asset_id, title, author, source, download, purpose, volume in additions:
    path = ROOT / 'public/assets/audio' / (asset_id + '.ogg')
    raw = path.read_bytes()
    assert raw[:4] == b'OggS'
    probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_name,sample_rate,channels', '-of', 'json', str(path)], text=True))
    stream = probe['streams'][0]
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'null', '-'], check=True, stdout=subprocess.DEVNULL)
    asset = dict(id=asset_id, path=path.relative_to(ROOT).as_posix(), src='/' + path.relative_to(ROOT).as_posix(),
        sourceTitle=title, sourceUrl=source, downloadUrl=download, sourceMember=download.split('/')[-1],
        author=author, license='CC0-1.0', licenseUrl='https://creativecommons.org/publicdomain/zero/1.0/',
        licenseEvidenceUrl='https://bigsoundbank.com/licenses.html', attribution='Sound by ' + author + ' via BigSoundBank.com, CC0. Credit optional.',
        attributionRequired=False, format='ogg', purpose=purpose, volume=volume, loop=False,
        processing='Original publisher OGG download, renamed only. No pitch/length editing baked in.',
        bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest(), durationSeconds=round(float(probe['format']['duration']), 4),
        codec=stream['codec_name'], sampleRate=int(stream['sample_rate']), channels=stream['channels'], extension='chinese-style-v1')
    found = next((i for i,a in enumerate(m['assets']) if a['id'] == asset_id), None)
    if found is None:
        m['assets'].append(asset)
    else:
        assert m['assets'][found]['sha256'] == asset['sha256']
        m['assets'][found] = asset

new_cues = {
    'chineseTransition': dict(assetId='palace-gong', volume=0.12, playbackRate=1, loop=False, suggestedMaxSeconds=1.8),
    'chineseVictory': dict(assetId='palace-gong', volume=0.24, playbackRate=1, loop=False, suggestedMaxSeconds=4.0),
    'chineseReveal': dict(assetId='palace-bell', volume=0.14, playbackRate=1, loop=False, suggestedMaxSeconds=1.5),
    'chineseMechanism': dict(assetId='mechanism-click', volume=0.20, playbackRate=0.85, loop=False),
}
m['cues'].update(new_cues)
# Arrangement instructions only. The main-agent-owned player schedules these notes at runtime.
sequences = {
    'chineseVictory': {
        'description': '新編五聲音階上行慶賀配方；不是下載的中國古樂成品，也不宣稱為古箏實錄。',
        'durationMs': 2700,
        'steps': [dict(assetId='jade-chime', atMs=i*170, semitones=pitch, volume=0.22+i*0.015)
                  for i,pitch in enumerate([0,2,4,7,9,12,14,16])] +
                 [dict(assetId='palace-gong', atMs=1200, semitones=0, volume=0.22, maxDurationMs=1500),
                  dict(assetId='palace-bell', atMs=1450, semitones=0, volume=0.13, maxDurationMs=1200)]
    },
    'chineseTransition': {
        'description': '短促五聲清音加輕鑼，供情境淡入淡出使用。', 'durationMs': 1200,
        'steps': [dict(assetId='jade-chime', atMs=0, semitones=0, volume=0.16),
                  dict(assetId='jade-chime', atMs=180, semitones=7, volume=0.18),
                  dict(assetId='palace-gong', atMs=300, semitones=0, volume=0.10, maxDurationMs=900)]
    },
    'chineseReveal': {
        'description': '線索揭示的雙清音，不使用通用電子成功jingle。', 'durationMs': 1100,
        'steps': [dict(assetId='jade-chime', atMs=0, semitones=0, volume=0.18),
                  dict(assetId='jade-chime', atMs=200, semitones=7, volume=0.20)]
    }
}
m['sequences'] = sequences
m['totalFiles'] = len(m['assets'])
m['totalBytes'] = sum(a['bytes'] for a in m['assets'])
m['chineseStyleNote'] = 'Two CC0 gong/bell recordings supplement the base library. Pentatonic victory is a runtime arrangement recipe, not a sourced finished ancient-Chinese piece. User-supplied BGM is outside this CC0 manifest.'
assert all(next(a for a in m['assets'] if a['id']==key)['sha256']==value for key,value in old_assets.items())
assert all(m['cues'][key]==value for key,value in old_cues.items() if key not in new_cues)
assert bgm_hash == (hashlib.sha256(bgm.read_bytes()).hexdigest() if bgm.exists() else None)
manifest_path.write_text(json.dumps(m, ensure_ascii=False, indent=2), encoding='utf8')
runtime_assets = {a['id']: {k: a[k] for k in ['src', 'volume', 'loop', 'durationSeconds']} for a in m['assets']}
(ROOT / 'src/data/audio.js').write_text('// CC0 sourced assets and arrangement data. User-supplied BGM is not part of this license manifest.\nexport const audioAssets = ' + json.dumps(runtime_assets, ensure_ascii=False, indent=2) + ';\nexport const audioCues = ' + json.dumps(m['cues'], ensure_ascii=False, indent=2) + ';\nexport const chineseAudioSequences = ' + json.dumps(sequences, ensure_ascii=False, indent=2) + ';\n', encoding='utf8')
page = ROOT / 'public/assets/audio/audition.html'
s = page.read_text(encoding='utf8')
if 'palace-gong' not in s:
    cards = ''.join('<article><strong>' + html.escape(a[0] + ' · ' + a[5]) + '</strong><audio controls preload="none" src="/public/assets/audio/' + a[0] + '.ogg"></audio><small>BigSoundBank · CC0 · 原始實錄</small><a href="' + a[3] + '" target="_blank" rel="noopener">原始來源 ↗</a></article>' for a in additions)
    s = s.replace('</section>', cards + '</section>')
s = s.replace('已下載 37 個音檔', '已下載 39 個音檔')
page.write_text(s, encoding='utf8')
print(json.dumps({'files':m['totalFiles'], 'cues':len(m['cues']), 'sequences':len(sequences), 'bytes':m['totalBytes'], 'oldAssetsPreserved':True,'bgmUnchanged':True}, ensure_ascii=False))
