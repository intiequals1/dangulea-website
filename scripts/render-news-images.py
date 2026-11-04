"""Deterministic, local typography; no external images, fonts or API keys."""
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from PIL.PngImagePlugin import PngInfo

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'scripts/fonts'
BG, PANEL, GOLD, TEXT, MUTED = '#1a1714', '#221e1a', '#c8935a', '#e8e0d5', '#c4b49d'
DISCLOSURE = json.loads((ROOT / 'src/content/news-disclosure.json').read_text())


def font(size, bold=False):
    return ImageFont.truetype(str(FONTS / ('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf')), size)


def wrap(draw, text, face, width):
    lines, line = [], ''
    for word in text.split():
        # Split very long individual tokens as well as ordinary words.
        while draw.textlength(word, font=face) > width:
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


def draw_block(draw, text, xy, width, height, size, minimum, bold=False, truncate=False):
    for candidate in range(size, minimum - 1, -1):
        face = font(candidate, bold)
        lines = wrap(draw, text, face, width)
        leading = round(candidate * 1.32)
        if len(lines) * leading <= height:
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
        draw.text((x, y), line, font=face, fill=TEXT if bold else MUTED, anchor='lt')
        y += leading


def render(article, story=False):
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
