from pathlib import Path
from PIL import Image
import json

root=Path(__file__).resolve().parents[1]
records=json.loads((root/'public/assets/optimized/catalog.json').read_text(encoding='utf-8'))
assert len(records)==97 and len({a['id'] for a in records})==97
count=alpha=0
for item in records:
    for tier,key in [('desktop','src'),('mobile','mobileSrc')]:
        with Image.open(root/item[key].lstrip('/')) as image:
            image.load()
            expected=(item['width'],item['height']) if tier=='desktop' else (item['mobileWidth'],item['mobileHeight'])
            assert image.size==expected,(item['id'],tier)
            if item['category'] in ('CH','PR','UI'):
                assert image.mode=='RGBA' and image.getchannel('A').getextrema()[0]<255,(item['id'],tier)
                alpha+=1
            count+=1
print(f'{count} WebP images decoded; dimensions match; {alpha} alpha channels verified.')
