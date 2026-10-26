"""Copy and inspect generated originals. Does not resize, retouch or re-encode images."""
import csv
import hashlib
import html
import json
from pathlib import Path
import shutil
import sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'docs/assets/manifest-v1.json'

def refresh(data):
    entries = data['assets']
    assert len(entries) == 97 and len({a['id'] for a in entries}) == 97
    MANIFEST.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    catalog = ROOT / 'public/assets/catalog.json'
    catalog.parent.mkdir(parents=True, exist_ok=True)
    catalog_temp = catalog.with_suffix('.tmp')
    catalog_temp.write_text(json.dumps([{'id':a['id'], 'name':a['name'], 'category':a['category'],
                                  'src':'/'+a['runtime'], 'width':a.get('width'), 'height':a.get('height')}
                                 for a in entries if a.get('width')], ensure_ascii=False, indent=2), encoding='utf-8')
    catalog_temp.replace(catalog)
    with (ROOT / 'docs/assets/asset-list-v1.csv').open('w', encoding='utf-8-sig', newline='') as f:
        fields = ['id', 'category', 'name', 'ratio', 'transparent', 'reference', 'status', 'width', 'height', 'output', 'runtime']
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows(entries)
    sections = []
    for category in ['BG', 'CH', 'PR', 'UI', 'EX']:
        cards = []
        for a in entries:
            if a['category'] != category:
                continue
            img = f'<img loading="lazy" src="/{a["runtime"]}" alt="{html.escape(a["name"])}">' if a.get('width') else '<div class="pending">待製作</div>'
            cards.append(f'<article>{img}<strong>{a["id"]} · {html.escape(a["name"])}</strong><small>{a["status"]} · {a.get("width", "?")} × {a.get("height", "?")}</small></article>')
        sections.append(f'<h2>{category}</h2><section>{"".join(cards)}</section>')
    done = sum(bool(a.get('width')) for a in entries)
    page = f'''<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>紫禁語文弈 · 97 張素材畫廊</title><style>
body{{margin:30px;background:#f1e8d6;color:#223d37;font-family:system-ui}}section{{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}}article{{background:#fff9ee;padding:12px;border:1px solid #c2a364}}img,.pending{{width:100%;height:220px;object-fit:contain;background:repeating-conic-gradient(#d8ded5 0% 25%,#edf0e9 0% 50%) 0/20px 20px}}strong,small{{display:block;margin-top:10px}}small{{color:#657568}}h2{{margin-top:36px}}.pending{{display:grid;place-items:center}}
</style><h1>紫禁語文弈 · 素材製作畫廊</h1><p>已儲存 {done} / 97 張；人物表情及素材一致性另經逐批目視檢查。此頁非遊戲介面。</p>{''.join(sections)}</html>'''
    gallery = ROOT / 'public/assets/gallery.html'
    gallery.parent.mkdir(parents=True, exist_ok=True)
    gallery.write_text(page, encoding='utf-8')
    return done

def record(data, asset_id, source):
    a = next(a for a in data['assets'] if a['id'] == asset_id)
    source = Path(source)
    with Image.open(source) as image:
        image.load()
        width, height = image.size
        mode = image.mode
        alpha = image.getchannel('A').getextrema() if 'A' in image.getbands() else None
    if a['transparent'] and (alpha is None or alpha[0] == 255):
        raise ValueError(f'{asset_id}: no actual transparency')
    destination = ROOT / a['output']
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists() and destination.read_bytes() != source.read_bytes():
        raise FileExistsError(f'Preserve existing version: {destination}')
    if source.resolve() != destination.resolve():
        shutil.copy2(source, destination)
    runtime = ROOT / a['runtime']
    runtime.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(destination, runtime)
    a.update(source=str(source), width=width, height=height, mode=mode, alphaRange=alpha,
             sha256=hashlib.sha256(destination.read_bytes()).hexdigest(),
             status='approved-anchor' if a['status'] == 'approved-anchor' else 'generated-inspected')

data = json.loads(MANIFEST.read_text(encoding='utf-8'))
if sys.argv[1:] and sys.argv[1] == 'anchors':
    for a in data['assets']:
        if a['status'] == 'approved-anchor':
            record(data, a['id'], a['source'])
elif sys.argv[1:] and sys.argv[1] == 'record':
    record(data, sys.argv[2], sys.argv[3])
elif sys.argv[1:] and sys.argv[1] == 'audit':
    for a in data['assets']:
        if a.get('width'):
            assert (ROOT / a['output']).is_file() and (ROOT / a['runtime']).is_file(), a['id']
            assert hashlib.sha256((ROOT / a['output']).read_bytes()).hexdigest() == a['sha256'], a['id']
count = refresh(data)
print(json.dumps({'saved': count, 'total': 97, 'remaining': 97-count}, ensure_ascii=False))
