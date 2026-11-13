"""Deterministic, local typography; no external images, fonts or API keys."""
import json
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFont, ImageOps
from PIL.PngImagePlugin import PngInfo

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'scripts/fonts'
BG, PANEL, GOLD, TEXT, MUTED = '#1a1714', '#221e1a', '#c8935a', '#e8e0d5', '#c4b49d'
DISCLOSURE = json.loads((ROOT / 'src/content/news-disclosure.json').read_text())


def font(size, bold=False):
    return ImageFont.truetype(str(FONTS / ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')), size)


def wrap(draw, text, face, width, split_long_words=True):
    lines, line = [], ''
    for word in text.split():
        # Split very long individual tokens as well as ordinary words.
        while split_long_words and draw.textlength(word, font=face) > width:
            if line:
                lines.append(line)
                line = ''
            cut = 1
            while cut < len(word) and draw.textlength(word[:cut + 1], font=face) <= width:
                cut += 1
            lines.append(word[:cut])
            word = word[cut:]
        candidate = f'{line} {word}'.strip()
        if line and draw.textlength(candidate, font=face) > width:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines


def draw_block(draw, text, xy, width, height, size, minimum, bold=False, truncate=False, max_lines=None, color=None):
    for candidate in range(size, minimum - 1, -1):
        face = font(candidate, bold)
        lines = wrap(draw, text, face, width, split_long_words=max_lines is None)
        leading = round(candidate * 1.32)
        if len(lines) * leading <= height and (max_lines is None or (
                len(lines) <= max_lines and all(draw.textlength(line, font=face) <= width for line in lines))):
            break
    else:
        if not truncate:
            raise ValueError(f'Titel passt nicht vollständig ins Bild: {text}')
        lines = lines[:int(height / leading)]
        last = lines[-1]
        while draw.textlength(last + '…', font=face) > width:
            last = last[:-1]
        lines[-1] = last.rstrip() + '…'
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=face, fill=color or (TEXT if bold else MUTED), anchor='lt')
        y += leading


ICON_SHAPES = {
    'schloss': (
        ((12, 32), (13, 19), (23, 7), (39, 3), (55, 10), (62, 23), (61, 36),
         (50, 34), (50, 23), (43, 16), (31, 16), (24, 23), (24, 35)),
        ((8, 32), (54, 29), (66, 40), (60, 67), (21, 72), (7, 58)),
    ),
    'cloud': (
        ((5, 47), (15, 32), (25, 31), (31, 17), (44, 12), (57, 20), (62, 34),
         (72, 42), (69, 56), (58, 63), (16, 63)),
    ),
    'schild': (((38, 4), (65, 16), (62, 42), (53, 57), (37, 71), (17, 54), (9, 37), (9, 15)),),
    'zahnrad': (
        ((29, 5), (44, 5), (46, 14), (54, 19), (63, 16), (71, 29), (64, 36),
         (64, 44), (71, 50), (63, 63), (54, 60), (46, 64), (44, 72), (29, 72),
         (27, 64), (19, 60), (11, 63), (3, 50), (10, 44), (10, 36), (3, 29),
         (11, 16), (19, 19), (27, 14)),
    ),
    'dokument': (((14, 4), (48, 4), (64, 21), (61, 71), (14, 69)),),
    'kalender': (((7, 16), (18, 12), (22, 4), (30, 4), (31, 12), (48, 12),
                  (49, 4), (57, 4), (59, 12), (68, 17), (66, 68), (7, 68)),),
    'warnung': (((37, 4), (72, 66), (3, 66)),),
}
ICON_MARKS = {
    'schloss': (((37, 39), (44, 44), (42, 50), (46, 61), (28, 61), (33, 50), (30, 44)),),
    'schild': (((20, 36), (26, 32), (34, 42), (51, 23), (57, 29), (34, 55)),),
    'zahnrad': (((27, 31), (37, 25), (47, 31), (47, 45), (37, 51), (27, 45)),),
    'dokument': (((46, 8), (59, 21), (46, 21)), ((23, 34), (52, 34), (52, 38), (23, 38)),
                 ((23, 47), (48, 47), (48, 51), (23, 51))),
    'kalender': (((12, 24), (63, 24), (63, 30), (12, 30)), ((21, 39), (32, 39), (32, 48), (21, 48)),
                 ((42, 39), (53, 39), (53, 48), (42, 48))),
    'warnung': (((32, 25), (42, 25), (40, 47), (34, 47)), ((33, 52), (41, 52), (41, 59), (33, 59))),
}


def draw_icon(image, name, x, y, size):
    scale = size / 75
    def points(shape):
        return [(round(px * scale), round(py * scale)) for px, py in shape]

    mask = Image.new('L', (size, size))
    stencil = ImageDraw.Draw(mask)
    for shape in ICON_SHAPES[name]:
        stencil.polygon(points(shape), fill=255)
    paint = Image.new('RGB', (size, size), '#b97442')
    facets = ImageDraw.Draw(paint)
    for shape, color in [
        (((0, 0), (47, 0), (26, 34)), '#d6a15d'),
        (((47, 0), (75, 0), (75, 30), (26, 34)), '#2c5252'),
        (((0, 0), (26, 34), (0, 62)), '#623b2b'),
        (((26, 34), (75, 30), (48, 55)), '#e0ac60'),
        (((75, 30), (75, 75), (48, 55)), '#604438'),
        (((0, 62), (26, 34), (48, 55), (18, 75), (0, 75)), '#3b6561'),
        (((48, 55), (75, 75), (18, 75)), '#9a552d'),
    ]:
        polygon = points(shape)
        facets.polygon(polygon, fill=color)
        facets.line([*polygon, polygon[0]], fill='#171411', width=max(2, size // 95), joint='curve')

    texture = painted_background(size, size, False).convert('L')
    grain = texture.point(lambda value: 170 + value // 3).convert('RGB')
    paint = ImageChops.multiply(paint, grain)
    draw = ImageDraw.Draw(image)
    for shape in ICON_SHAPES[name]:
        outline = [(x + px, y + py) for px, py in points(shape)]
        draw.line([*outline, outline[0]], fill='#100e0c', width=max(5, size // 38), joint='curve')
    image.paste(paint, (x, y), mask)
    for shape in ICON_MARKS.get(name, ()):
        draw.polygon([(x + px, y + py) for px, py in points(shape)], fill='#171411')


@lru_cache(maxsize=2)
def painted_background(width, height, story):
    with Image.open(ROOT / 'scripts/assets/news-cubist.jpg') as painting:
        return ImageOps.fit(painting, (width, height), centering=(0.72 if story else 0.5, 0.5)).convert('RGB')


def render_preview(article, story):
    width, height = (1080, 1920) if story else (1200, 630)
    image = painted_background(width, height, story).copy()
    veil = Image.new('RGBA', image.size)
    shade = ImageDraw.Draw(veil)
    for x in range(width):
        fade = max(0, min(1, (x / width - 0.50) / 0.35))
        shade.line((x, 0, x, height), fill=(13, 11, 10, round(185 * (1 - fade) + (115 * fade if story else 0))))
    image.paste(veil, mask=veil.getchannel('A'))
    draw = ImageDraw.Draw(image)
    preview = article['og']
    margin = 76 if story else 62
    top = 276 if story else 70
    text_width = width - 2 * margin if story else 745
    draw.rectangle((0, 0, 13, height), fill='#bd8049')
    draw_icon(image, preview['og_icon'], 535 if story else 830, 905 if story else 114, 465 if story else 340)

    badge_font = font(30 if story else 24, True)
    badge_width = round(draw.textlength(preview['og_kategorie'], font=badge_font)) + 38
    draw.rounded_rectangle((margin, top, margin + badge_width, top + 47), radius=23, fill='#d8a064')
    draw.text((margin + 19, top + 23), preview['og_kategorie'], font=badge_font, fill='#211712', anchor='lm')
    date = '.'.join(reversed(article['date'].split('-')))
    draw.text((margin + badge_width + 16, top + 23), date, font=font(26 if story else 23, True),
              fill='#f1bd7b', anchor='lm')
    draw_block(draw, preview['og_titel'], (margin, top + (102 if story else 91)), text_width,
               340 if story else 230, 78 if story else 63, 29, bold=True, max_lines=3)

    facts = preview['og_fakten']
    if facts:
        gap = 18
        cards_width = 650 if story else text_width
        card_width = (cards_width - gap) // 2 if len(facts) == 2 else min(385, cards_width)
        for index, fact in enumerate(facts):
            x = margin + index * (card_width + gap)
            y = 790 if story else 421
            draw.rounded_rectangle((x, y, x + card_width, y + 100), radius=12, fill='#211a16',
                                   outline='#d39a5f', width=2)
            draw_block(draw, fact['datum'], (x + 17, y + 13), card_width - 34, 43, 29, 23, bold=True, color='#f1bd7b')
            draw_block(draw, fact['label'], (x + 17, y + 53), card_width - 34, 42, 25, 20, bold=True)

    footer = 1600 if story else 566
    draw.rectangle((margin - 8, footer - 14, width - margin + 8, footer + 46), fill='#1b1613')
    draw.line((margin, footer - 10, width - margin, footer - 10), fill='#d8a064', width=2)
    notice = f'{DISCLOSURE["label"]} · {DISCLOSURE["imageLabel"]}'
    draw.text((margin, footer), 'dangulea.at', font=font(29, True), fill='#f1bd7b', anchor='lt')
    draw.text((width - margin, footer + 4), notice, font=font(22 if story else 20), fill=TEXT, anchor='rt')
    return image


def render(article, story=False):
    if 'og' in article:
        return render_preview(article, story)
    width, height = (1080, 1920) if story else (1200, 630)
    image = Image.new('RGB', (width, height), BG)
    draw = ImageDraw.Draw(image)
    margin = 80 if story else 64
    draw.rectangle((0, 0, 18, height), fill=GOLD)
    draw.rectangle((margin, height - 200 if story else 510, width - margin, height - margin), fill=PANEL)
    draw.text((margin, 250 if story else 48), 'CLAUDIU DANGULEA', font=font(32 if story else 24, True), fill=TEXT)
    date = f'{article["date"][8:10]}.{article["date"][5:7]}.{article["date"][:4]} · {article["number"]:02}'
    kicker = f'{DISCLOSURE["label"]} · {date}' if story else f'{DISCLOSURE["label"]} · {DISCLOSURE["imageLabel"]} · {date}'
    draw.text((margin, 315 if story else 92), kicker, font=font(27 if story else 18), fill=GOLD)
    if story:
        draw.text((margin, 365), DISCLOSURE['imageLabel'], font=font(24), fill=GOLD)
    draw.line((margin, 415 if story else 138, width - margin, 415 if story else 138), fill=GOLD, width=2)
    draw_block(draw, article['title'], (margin, 455 if story else 166), width - 2 * margin,
               620 if story else 265, 68 if story else 49, 44 if story else 30, bold=True)
    draw_block(draw, article['description'], (margin, 1140 if story else 450), width - 2 * margin,
               420 if story else 55, 36 if story else 20, 30 if story else 20, truncate=True)
    draw.text((margin + 24, 1660 if story else 537), 'dangulea.at', font=font(36 if story else 27, True), fill=GOLD)
    if story:
        draw.text((margin + 24, 1720), 'Artikel über den Link-Sticker öffnen', font=font(24), fill=TEXT)
        # Content stays clear of Instagram's top and bottom UI areas.
    return image


def main():
    articles = json.loads((ROOT / 'src/generated/news-articles.json').read_text())
    for article in articles:
        for key, story in [('ogImage', False), ('storyImage', True)]:
            path = ROOT / 'dist' / article[key].lstrip('/')
            path.parent.mkdir(parents=True, exist_ok=True)
            info = PngInfo()
            info.add_text('news_poc', DISCLOSURE['label'])
            info.add_text('news_workflow', DISCLOSURE['summary'])
            render(article, story).save(path, 'PNG', optimize=True, pnginfo=info)
    print(f'News-Bilder erzeugt: {len(articles)} × (1200×630 und 1080×1920)')


if __name__ == '__main__':
    main()
