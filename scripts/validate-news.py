"""Validate the actual deployment artifact or every live article, without JS."""
import argparse
import hashlib
import io
import json
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlsplit
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SITE = 'https://dangulea.at'


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.meta, self.canonicals, self.links, self.shares, self.ld = {}, [], [], [], []
        self.title, self.h1, self.text = [], [], []
        self.in_head = self.in_title = self.in_h1 = self.in_ld = False
        self.ld_text = ''
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'head': self.in_head = True
        if tag == 'title': self.in_title = True
        if tag == 'h1': self.in_h1 = True
        if not self.in_head and tag in ['p', 'div', 'article', 'h1', 'h2', 'h3', 'section', 'li']:
            self.text.append('\n')
        if tag == 'meta' and self.in_head:
            key = attrs.get('property') or attrs.get('name')
            self.meta.setdefault(key, []).append(attrs.get('content'))
        if tag == 'link' and attrs.get('rel') == 'canonical' and self.in_head:
            self.canonicals.append(attrs.get('href'))
        if tag == 'a': self.links.append(attrs)
        if tag == 'button' and 'data-share-url' in attrs: self.shares.append(attrs['data-share-url'])
        if tag == 'script' and attrs.get('type') == 'application/ld+json' and self.in_head:
            self.in_ld, self.ld_text = True, ''

    def handle_endtag(self, tag):
        if tag == 'head': self.in_head = False
        if tag == 'title': self.in_title = False
        if tag == 'h1': self.in_h1 = False
        if tag == 'script' and self.in_ld:
            self.ld.append(json.loads(self.ld_text))
            self.in_ld = False

    def handle_data(self, data):
        if self.in_title: self.title.append(data)
        if self.in_h1: self.h1.append(data)
        if self.in_ld: self.ld_text += data
        if not self.in_head: self.text.append(data)


def require(condition, message):
    if not condition:
        raise ValueError(message)


def check_page(html, article):
    page = Page(html)
    require(''.join(page.title) == f'{article["title"]} · Claudiu Dangulea', 'HTML-Titel falsch')
    require(''.join(page.h1) == article['title'], 'Artikelüberschrift fehlt/falsch')
    require(page.canonicals == [article['url']], 'Canonical fehlt, doppelt oder falsch')
    metadata = {
        'description': article['description'], 'og:type': 'article', 'og:title': article['title'],
        'og:description': article['description'], 'og:url': article['url'],
        'og:image': SITE + article['ogImage'], 'og:image:secure_url': SITE + article['ogImage'],
        'og:image:width': '1200', 'og:image:height': '630', 'og:image:type': 'image/png',
        'og:image:alt': article['title'], 'og:locale': 'de_AT',
        'article:published_time': article['date'], 'twitter:card': 'summary_large_image',
        'twitter:title': article['title'], 'twitter:description': article['description'],
        'twitter:image': SITE + article['ogImage'],
    }
    for key, value in metadata.items():
        require(page.meta.get(key) == [value], f'Metadatum fehlt, doppelt oder falsch: {key}')
    require(not any('noindex' in (value or '').lower() for value in page.meta.get('robots', [])), 'Artikel ist noindex')
    require(page.shares == [article['url']], 'Share-Button fehlt oder teilt falsche URL')
    for host, path, parameter in [('www.linkedin.com', '/sharing/share-offsite/', 'url'), ('www.facebook.com', '/sharer/sharer.php', 'u')]:
        matches = [link for link in page.links if urlsplit(link.get('href', '')).netloc == host]
        require(len(matches) == 1, f'Teilen-Link fehlt/doppelt: {host}')
        target = urlsplit(matches[0]['href'])
        require(target.scheme == 'https' and target.path == path and parse_qs(target.query).get(parameter) == [article['url']], f'Falsche Share-URL: {host}')
    require(any(link.get('href') == article['storyImage'] and 'download' in link for link in page.links), 'Story-Download fehlt')
    require(len(page.ld) == 1, 'NewsArticle JSON-LD fehlt/doppelt')
    ld = page.ld[0]
    for key, value in {'@type': 'NewsArticle', 'headline': article['title'], 'description': article['description'], 'url': article['url'], 'mainEntityOfPage': article['url'], 'datePublished': article['date'], 'image': [SITE + article['ogImage']]}.items():
        require(ld.get(key) == value, f'Falsches JSON-LD: {key}')
    text = ' '.join(''.join(page.text).split())
    require('Transparenz zur KI-Unterstützung:' in text, 'KI-Hinweis fehlt')
    # Ensure the full body and source URLs are present, not only a generic shell.
    for line in article['text'].splitlines():
        require(' '.join(line.split()) in text, 'Artikeltext/Quellen fehlen im statischen HTML')
    return page


def check_image(data, expected_size):
    require(len(data) < 5_000_000, 'Bild überschreitet 5 MB')
    with Image.open(io.BytesIO(data)) as image:
        require(image.format == 'PNG' and image.size == expected_size, f'Bildformat/-größe falsch: {image.format} {image.size}')
        image.verify()
    with Image.open(io.BytesIO(data)) as image:
        image.load()  # verify alone does not decode all pixel data
        require(any(low != high for low, high in image.convert('RGB').getextrema()), 'Leeres/einfarbiges Bild')
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', help='Validate HTTP responses instead of local dist files')
    args = parser.parse_args()
    expected = json.loads((ROOT / 'src/generated/news-articles.json').read_text())
    archive = json.loads((ROOT / 'data/news-archive.json').read_text())['articles']
    require(len(expected) == len(archive) > 0, 'Manifest/Archiv-Anzahl falsch')
    for actual, original in zip(expected, archive):
        require(all(actual.get(key) == value for key, value in original.items()), 'Manifest widerspricht Archiv')
    ids, urls, images = set(), set(), set()
    for article in expected:
        require(article['id'] not in ids and article['url'] not in urls, 'Doppelte ID/URL')
        ids.add(article['id']); urls.add(article['url'])
        require(article['path'] == f'/news/{article["date"]}/{article["number"]}/', 'Ungültiger Artikelpfad')
        require(article['url'] == SITE + article['path'], 'Ungültige Artikel-URL')
        for key in ['ogImage', 'storyImage']:
            path = article[key]
            require(path.startswith('/news-media/') and '..' not in path and path.endswith('.png') and path not in images, 'Ungültiger/doppelter Bildpfad')
            images.add(path)

    def read(path, kind):
        if args.base_url:
            target = args.base_url.rstrip('/') + path
            request = Request(target, headers={'User-Agent': 'Dangulea-News-Validator/1.0', 'Cache-Control': 'no-cache'})
            with urlopen(request, timeout=45) as response:
                require(response.status == 200, f'HTTP {response.status}: {target}')
                require(response.url == target, f'Unerwartete Weiterleitung: {response.url}')
                allowed_types = ['application/xml', 'text/xml'] if kind == 'application/xml' else [kind]
                require(response.headers.get_content_type() in allowed_types, f'Falscher Content-Type: {target}')
                require('noindex' not in response.headers.get('X-Robots-Tag', '').lower(), 'HTTP noindex')
                return response.read()
        file = ROOT / 'dist' / path.lstrip('/')
        if path.endswith('/'): file = file / 'index.html'
        return file.read_bytes()

    manifest = json.loads(read('/news-manifest.json', 'application/json'))
    require(manifest == expected, 'Veröffentlichtes Manifest gehört nicht zum geprüften Build')
    overview = Page(read('/news.html' if not args.base_url else '/news', 'text/html').decode())
    overview_links = {link.get('href') for link in overview.links}
    for article in expected:
        require(article['path'] in overview_links and article['url'] in overview.shares, f'Artikel fehlt in Übersicht: {article["id"]}')
    sitemap = ET.fromstring(read('/sitemap.xml', 'application/xml'))
    locations = [element.text for element in sitemap.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
    require(all(locations.count(url) == 1 for url in urls), 'Artikel in Sitemap fehlt/doppelt')

    def check(article):
        try:
            check_page(read(article['path'], 'text/html').decode(), article)
            og = check_image(read(article['ogImage'], 'image/png'), (1200, 630))
            story = check_image(read(article['storyImage'], 'image/png'), (1080, 1920))
            return og, story
        except Exception as error:
            raise ValueError(f'{article["id"]}: {error}') from error

    with ThreadPoolExecutor(max_workers=6 if args.base_url else 4) as pool:
        hashes = list(pool.map(check, expected))
    require(len({pair[0] for pair in hashes}) == len(expected), 'OG-Bilder sind nicht individuell')
    require(len({pair[1] for pair in hashes}) == len(expected), 'Story-Bilder sind nicht individuell')
    print(f'NEWS VALIDIERUNG OK: {len(expected)} Artikel, {len(expected) * 2} individuelle PNGs, Metadaten, Share-Links, Sitemap, Archiv. Quelle: {args.base_url or "dist"}')


if __name__ == '__main__':
    main()
