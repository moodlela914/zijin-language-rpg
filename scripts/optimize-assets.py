"""Create lightweight runtime WebP variants without altering original artwork."""
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import json

root=Path(__file__).resolve().parents[1]
assets=root/'public/assets'
catalog=json.loads((assets/'catalog.json').read_text(encoding='utf-8-sig'))
out=assets/'optimized'
for tier in ('desktop','mobile'):
    (out/tier).mkdir(parents=True,exist_ok=True)

def convert(record):
    source=root/record['src'].lstrip('/')
    sizes=(1280,768) if record['category'] in ('BG','EX') else (800,448)
    if record['category']=='UI': sizes=(1200,768)
    item=dict(record)
    item['originalWidth']=record['width']
    item['originalHeight']=record['height']
    for tier,limit in zip(('desktop','mobile'),sizes):
        target=out/tier/(record['id']+'.webp')
        with Image.open(source) as original:
            image=original.convert('RGBA' if 'A' in original.getbands() else 'RGB')
            image.thumbnail((limit,limit),getattr(Image,'Resampling',Image).LANCZOS)
            image.save(target,'WEBP',quality=82 if tier=='desktop' else 78,method=4)
            item['width' if tier=='desktop' else 'mobileWidth']=image.width
            item['height' if tier=='desktop' else 'mobileHeight']=image.height
        item['src' if tier=='desktop' else 'mobileSrc']='/public/assets/optimized/'+tier+'/'+target.name
    item['originalSrc']=record['src']
    return item

with ThreadPoolExecutor(max_workers=4) as pool:
    records=list(pool.map(convert,catalog))
(out/'catalog.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
report={'count':len(records),'originalBytes':sum((root/r['src'].lstrip('/')).stat().st_size for r in catalog)}
for tier in ('desktop','mobile'):
    report[tier+'Bytes']=sum(p.stat().st_size for p in (out/tier).glob('*.webp'))
    report[tier+'ReductionPercent']=round(100*(1-report[tier+'Bytes']/report['originalBytes']),1)
(root/'docs/assets/runtime-size-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))
