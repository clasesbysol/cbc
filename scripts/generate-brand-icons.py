"""Export PWA/browser icons from the verified original. Requires Pillow."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SKY = '#75bef5'

def generate():
    with Image.open(ROOT / 'cbc-logo.png') as source:
        source.load()  # Fail on truncated/corrupt source data.
        logo = source.convert('RGBA')
    assert logo.size == (256, 256)
    for size in (192, 512):
        logo.resize((size, size), Image.Resampling.LANCZOS).save(ROOT / f'cbc-icon-{size}.png')
        # Entire source square fits in the central safe circle (radius 40%).
        # 54% side => diagonal radius 38.2%, with room for resampling.
        side = round(size * .54)
        icon = Image.new('RGBA', (size, size), SKY)
        icon.alpha_composite(logo.resize((side, side), Image.Resampling.LANCZOS), ((size-side)//2, (size-side)//2))
        icon.convert('RGB').save(ROOT / f'cbc-icon-maskable-{size}.png')
    logo.resize((32, 32), Image.Resampling.LANCZOS).save(ROOT / 'cbc-favicon-32.png')
    apple = Image.new('RGBA', (180, 180), SKY)
    apple.alpha_composite(logo.resize((144, 144), Image.Resampling.LANCZOS), (18, 18))
    apple.convert('RGB').save(ROOT / 'cbc-apple-touch-icon.png')

if __name__ == '__main__':
    generate()
