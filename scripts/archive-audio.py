"""Rebuild sourced audio metadata, cue index and audition page from verified local downloads."""
from pathlib import Path
import hashlib
import html
import json
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/assets/audio'
DOC = ROOT / 'docs/audio'
LICENSE = 'CC0-1.0'
LICENSE_URL = 'https://creativecommons.org/publicdomain/zero/1.0/'
PACKS = {
    'interface': ('kenney_interface-sounds.zip', 'https://kenney.nl/assets/interface-sounds', 'https://kenney.nl/media/pages/assets/interface-sounds/fa43c1dd4d-1677589452/kenney_interface-sounds.zip'),
    'rpg': ('kenney_rpg-audio.zip', 'https://kenney.nl/assets/rpg-audio', 'https://kenney.nl/media/pages/assets/rpg-audio/8e99002d76-1677590336/kenney_rpg-audio.zip'),
    'ui': ('kenney_ui-audio.zip', 'https://kenney.nl/assets/ui-audio', 'https://kenney.nl/media/pages/assets/ui-audio/490d233f68-1677590494/kenney_ui-audio.zip'),
    'jingles': ('kenney_music-jingles.zip', 'https://kenney.nl/assets/music-jingles', 'https://kenney.nl/media/pages/assets/music-jingles/f37e530b9e-1677590399/kenney_music-jingles.zip'),
}
# One physical file may serve multiple explicit cues; no duplicate aliases are saved as new recordings.
SELECTED = [
    ('ui-click', 'interface', 'Audio/click_001.ogg', '輕點按鈕', 0.25),
    ('ui-click-alt', 'interface', 'Audio/click_002.ogg', '備選點按', 0.25),
    ('ui-back', 'interface', 'Audio/back_001.ogg', '返回／重試', 0.25),
    ('ui-close', 'interface', 'Audio/close_001.ogg', '面板收起', 0.25),
    ('ui-open', 'interface', 'Audio/open_001.ogg', '面板展開', 0.25),
    ('choice-select', 'interface', 'Audio/select_001.ogg', '提交選項', 0.25),
    ('answer-correct', 'interface', 'Audio/confirmation_001.ogg', '答對／訂正成功', 0.30),
    ('answer-wrong', 'interface', 'Audio/error_001.ogg', '答錯／訂正失敗', 0.22),
    ('hint-question', 'interface', 'Audio/question_001.ogg', '提示出現', 0.28),
    ('timer-tick', 'interface', 'Audio/tick_001.ogg', '倒數警示', 0.18),
    ('timer-end', 'interface', 'Audio/bong_001.ogg', '燃香時間耗盡', 0.25),
    ('jade-chime', 'interface', 'Audio/glass_001.ogg', '玉器／護身／道具獲得', 0.25),
    ('clue-pluck', 'interface', 'Audio/pluck_001.ogg', '線索發現', 0.25),
    ('setting-switch', 'interface', 'Audio/switch_001.ogg', '設定切換', 0.20),
    ('scroll-soft', 'interface', 'Audio/scroll_001.ogg', '卷軸與清單操作', 0.18),
    ('ui-hover', 'ui', 'Audio/rollover1.ogg', '可選滑入提示', 0.10),
    ('book-open', 'rpg', 'Audio/bookOpen.ogg', '書冊展開／概念提示', 0.30),
    ('paper-flip', 'rpg', 'Audio/bookFlip1.ogg', '翻頁／使用菊花殘箋', 0.28),
    ('book-close', 'rpg', 'Audio/bookClose.ogg', '書冊合起', 0.28),
    ('book-place', 'rpg', 'Audio/bookPlace1.ogg', '取得書卷線索', 0.28),
    ('mechanism-click', 'rpg', 'Audio/metalClick.ogg', '機關操作／金屬點擊', 0.25),
    ('mechanism-latch', 'rpg', 'Audio/metalLatch.ogg', '鎖扣開合', 0.28),
    ('door-open', 'rpg', 'Audio/doorOpen_1.ogg', '宮門開啟／進入場景', 0.28),
    ('door-close', 'rpg', 'Audio/doorClose_1.ogg', '宮門關閉／離開場景', 0.22),
    ('token-collect', 'rpg', 'Audio/handleCoins.ogg', '碎片與信物拾取', 0.28),
    ('cloth-soft', 'rpg', 'Audio/cloth1.ogg', '人物對話出現', 0.18),
    ('needle-metal', 'rpg', 'Audio/drawKnife1.ogg', '銀針出鞘的金屬短聲', 0.20),
    ('wood-creak', 'rpg', 'Audio/creak1.ogg', '木製機關／門扉', 0.23),
    ('footstep-stone', 'rpg', 'Audio/footstep00.ogg', '場景行進單步', 0.20),
    ('chapter-jingle', 'jingles', 'Audio/Pizzicato jingles/jingles_PIZZI00.ogg', '章節完成短提示', 0.28),
    ('victory-jingle', 'jingles', 'Audio/Pizzicato jingles/jingles_PIZZI04.ogg', '終局通關短提示', 0.30),
    ('boss-impact', 'jingles', 'Audio/Steel jingles/jingles_STEEL00.ogg', '論辯命中／心防降低', 0.24),
    ('puzzle-jingle', 'jingles', 'Audio/Steel jingles/jingles_STEEL07.ogg', '解謎完成／鳳印集成', 0.26),
]
EXTERNAL = [
    ('ambience-birds', 'ambience-birds.ogg', '庭園鳥鳴', 'isaiah658', 'https://opengameart.org/content/ambient-bird-sounds', 'https://opengameart.org/sites/default/files/birds-isaiah658_0.ogg', 0.10, True),
    ('ambience-wind', 'ambience-wind.wav', '庭院／冬季風聲', 'Luke.RUSTLTD', 'https://opengameart.org/content/wind1', 'https://opengameart.org/sites/default/files/wind1.wav', 0.08, True),
    ('transition-wind', 'transition-wind.wav', '場景淡入淡出短風聲', 'remaxim', 'https://opengameart.org/content/short-wind-sound', 'https://opengameart.org/sites/default/files/short%20wind%20sound.wav', 0.16, False),
    ('ambience-fire', 'ambience-fire.wav', '有明火場景的低音量火焰聲', 'PagDev', 'https://opengameart.org/content/fireplace-sound-loop', 'https://opengameart.org/sites/default/files/fire.wav', 0.06, True),
]
OUT.mkdir(parents=True, exist_ok=True)
(DOC / 'licenses').mkdir(parents=True, exist_ok=True)
assets = []
for key, (zipname, page, download) in PACKS.items():
    with zipfile.ZipFile(DOC / 'source-packs' / zipname) as z:
        license_text = z.read('License.txt').decode('utf-8-sig')
        assert 'CC0' in license_text or 'Creative Commons Zero' in license_text
        (DOC / 'licenses' / ('kenney-' + key + '-License.txt')).write_text(license_text, encoding='utf-8')
        for asset_id, pack, member, purpose, volume in SELECTED:
            if pack != key:
                continue
            dest = OUT / (asset_id + '.ogg')
            dest.write_bytes(z.read(member))
            assets.append(dict(id=asset_id, path=dest.relative_to(ROOT).as_posix(), src='/' + dest.relative_to(ROOT).as_posix(),
                sourceUrl=page, downloadUrl=download, sourceMember=member, author='Kenney', license=LICENSE,
                licenseUrl=LICENSE_URL, attribution='Sound effects by Kenney (kenney.nl), CC0. Credit optional.',
                attributionRequired=False, format='ogg', purpose=purpose, volume=volume, loop=False,
                processing='Unmodified original file extracted from official ZIP.'))
for asset_id, filename, purpose, author, page, download, volume, loop in EXTERNAL:
    dest = OUT / filename
    assert dest.is_file() and dest.stat().st_size > 0, str(dest)
    assets.append(dict(id=asset_id, path=dest.relative_to(ROOT).as_posix(), src='/' + dest.relative_to(ROOT).as_posix(),
        sourceUrl=page, downloadUrl=download, sourceMember=filename, author=author, license=LICENSE,
        licenseUrl=LICENSE_URL, attribution='Sound effect by ' + author + ', OpenGameArt.org, CC0. Credit optional.',
        attributionRequired=False, format=dest.suffix[1:], purpose=purpose, volume=volume, loop=loop,
        processing='Unmodified original download; project filename changed only.'))

for a in assets:
    path = ROOT / a['path']
    raw = path.read_bytes()
    assert raw[:4] == (b'OggS' if a['format'] == 'ogg' else b'RIFF'), a['id']
    meta = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_name,sample_rate,channels', '-of', 'json', str(path)], text=True))
    stream = meta['streams'][0]
    a.update(bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest(), durationSeconds=round(float(meta['format']['duration']), 4),
             codec=stream['codec_name'], sampleRate=int(stream['sample_rate']), channels=stream['channels'])
    assert a['durationSeconds'] > 0
    subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'null', '-'], check=True, stdout=subprocess.DEVNULL)

cue_ids = {
    'uiHover': 'ui-hover', 'uiClick': 'ui-click', 'uiBack': 'ui-back', 'uiOpen': 'ui-open', 'uiClose': 'ui-close',
    'settingToggle': 'setting-switch', 'scroll': 'scroll-soft', 'pause': 'ui-close', 'resume': 'ui-open',
    'dialogue': 'cloth-soft', 'choice': 'choice-select', 'correct': 'answer-correct', 'wrong': 'answer-wrong',
    'timeout': 'timer-end', 'countdown': 'timer-tick', 'hint': 'hint-question', 'hintJinxi': 'hint-question',
    'hintJing': 'clue-pluck', 'hintDuan': 'book-open', 'itemNeedle': 'needle-metal', 'itemPaper': 'paper-flip',
    'itemShield': 'jade-chime', 'itemGain': 'jade-chime', 'shard': 'token-collect', 'chapterComplete': 'chapter-jingle',
    'bossHit': 'boss-impact', 'victory': 'victory-jingle', 'retry': 'ui-back', 'reviewCorrect': 'answer-correct',
    'reviewWrong': 'answer-wrong', 'hotspot': 'clue-pluck', 'clue': 'book-place', 'puzzleOperate': 'mechanism-click',
    'puzzleSolved': 'puzzle-jingle', 'transition': 'transition-wind', 'questReveal': 'chapter-jingle',
    'sceneEnter': 'door-open', 'sceneExit': 'door-close', 'unlock': 'mechanism-latch', 'lock': 'mechanism-latch',
    'bookOpen': 'book-open', 'bookFlip': 'paper-flip', 'bookClose': 'book-close', 'woodMechanism': 'wood-creak',
    'step': 'footstep-stone', 'sealComplete': 'puzzle-jingle', 'ambienceGarden': 'ambience-birds',
    'ambienceCourtyard': 'ambience-wind', 'ambienceFire': 'ambience-fire', 'inventoryOpen': 'ui-open', 'inventoryClose': 'ui-close',
}
by_id = {a['id']: a for a in assets}
cues = {event: dict(assetId=asset_id, volume=by_id[asset_id]['volume'], playbackRate=1, loop=by_id[asset_id]['loop']) for event, asset_id in cue_ids.items()}
assert len(by_id) == len(assets)
manifest = dict(version=1, checkedOn='2026-10-26', status='downloaded-and-decoded-not-integrated',
    licensePolicy='All included audio assets are explicitly CC0-1.0; no attribution required, optional credits retained.',
    totalFiles=len(assets), totalBytes=sum(a['bytes'] for a in assets), assets=assets, cues=cues,
    notes=['Cue mappings reuse original files intentionally; mappings are not unique recordings.',
           'Volume values are recommended starting gains, not baked normalization.',
           'No full background music or spoken dialogue voice-over is included.',
           'Environmental loop claims are from source author; listen and fade at boundaries before release.',
           'Audio files were structurally checked with ffprobe and fully decoded using ffmpeg; artistic in-game audition remains necessary.'])
(DOC / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
runtime_assets = {a['id']: {k: a[k] for k in ['src', 'volume', 'loop', 'durationSeconds']} for a in assets}
(ROOT / 'src/data/audio.js').write_text('// Sourced CC0 assets. See docs/audio/manifest.json for licenses and provenance.\nexport const audioAssets = ' + json.dumps(runtime_assets, ensure_ascii=False, indent=2) + ';\nexport const audioCues = ' + json.dumps(cues, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
cards = ''.join('<article><strong>' + html.escape(a['id'] + ' · ' + a['purpose']) + '</strong><audio controls preload="none" src="' + a['src'] + '"></audio><small>' + str(a['durationSeconds']) + ' 秒 · ' + a['author'] + ' · CC0</small><a href="' + a['sourceUrl'] + '" target="_blank" rel="noopener">原始來源 ↗</a></article>' for a in assets)
(OUT / 'audition.html').write_text('<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>紫禁語文弈音效試聽</title><style>body{background:#f1e8d6;color:#223d37;font-family:system-ui;margin:30px}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px}article{padding:18px;border:1px solid #c2a364;background:#fff9ef}strong,small,a{display:block;margin-bottom:12px}audio{max-width:100%;margin-bottom:12px}</style><h1>紫禁語文弈 · CC0 音效試聽</h1><p>已下載 ' + str(len(assets)) + ' 個音檔；點選播放不會上傳任何資料。此頁為試聽工具，音效是否在遊戲內啟用由主程式決定。</p><section>' + cards + '</section></html>', encoding='utf-8')
print(json.dumps({'files': len(assets), 'cues': len(cues), 'bytes': manifest['totalBytes'], 'allDecoded': True}, ensure_ascii=False))
