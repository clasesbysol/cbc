"""Validate PNG integrity, declared dimensions and maskable safe areas (Pillow)."""
import json
import struct
import zlib
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

def check_png(path):
    data = path.read_bytes()
    assert data[:8] == b'\x89PNG\r\n\x1a\n', path
    offset = 8
    compressed = b''
    while offset < len(data):
        size = struct.unpack('>I', data[offset:offset+4])[0]
        block = data[offset+4:offset+8+size]
        crc = struct.unpack('>I', data[offset+8+size:offset+12+size])[0]
        assert zlib.crc32(block) == crc, f'{path}: corrupt {block[:4]}'
        if block[:4] == b'IDAT':
            compressed += block[4:]
        offset += size + 12
    zlib.decompress(compressed)  # Also validates the compressed stream checksum.
    with Image.open(path) as image:
        image.load()
        return image.copy()

manifest = json.loads((ROOT / 'manifest.webmanifest').read_text())
for icon in manifest['icons']:
    path = ROOT / icon['src'].split('?')[0]
    image = check_png(path)
    assert icon['sizes'] == f'{image.width}x{image.height}'
    if icon['purpose'] == 'maskable':
        assert image.mode == 'RGB'
        radius = image.width * .4
        for y in range(image.height):
            for x in range(image.width):
                if (x-image.width/2)**2 + (y-image.height/2)**2 > radius**2:
                    assert image.getpixel((x,y)) == (117,190,245), (path,x,y)
assert check_png(ROOT / 'cbc-logo.png').size == (256,256)
assert check_png(ROOT / 'cbc-favicon-32.png').size == (32,32)
assert check_png(ROOT / 'cbc-apple-touch-icon.png').size == (180,180)
print('All 7 PNGs pass CRC, decompression, dimensions and maskable safe-area checks.')
