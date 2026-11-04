import importlib.util
import io
from pathlib import Path
import unittest

from PIL import Image
from PIL.PngImagePlugin import PngInfo


def module(filename):
    spec = importlib.util.spec_from_file_location(filename, Path(__file__).parent / filename)
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded


validator = module('validate-news.py')
renderer = module('render-news-images.py')


class ImagesTest(unittest.TestCase):
    def setUp(self):
        self.article = {'title': 'SAP & KI: Individuelle Artikelbilder mit Umlauten äöü', 'date': '2026-11-04', 'number': 1, 'description': 'Ein kurzer Überblick aus dem zugehörigen Beitrag.'}

    def test_both_formats_and_distinct_content(self):
        hashes = []
        for story, size in [(False, (1200, 630)), (True, (1080, 1920))]:
            for title in ['Eine erste Meldung', 'Eine zweite Meldung']:
                output = io.BytesIO()
                renderer.render({**self.article, 'title': title}, story).save(output, 'PNG')
                hashes.append(validator.check_image(output.getvalue(), size))
        self.assertEqual(len(set(hashes)), 4)

    def test_rejects_bad_dimensions_corruption_and_empty_images(self):
        output = io.BytesIO()
        renderer.render(self.article).save(output, 'PNG')
        data = output.getvalue()
        with self.assertRaises(ValueError): validator.check_image(data, (1080, 1920))
        with self.assertRaises(Exception): validator.check_image(data[:100], (1200, 630))
        blank = io.BytesIO()
        Image.new('RGB', (1200, 630)).save(blank, 'PNG')
        with self.assertRaises(ValueError): validator.check_image(blank.getvalue(), (1200, 630))

    def test_long_titles_fit_and_unrenderable_titles_block_generation(self):
        for story in [False, True]:
            renderer.render({**self.article, 'title': ('Sehr lange Überschrift mit Umlauten äöü ' * 8)[:300]}, story)
        with self.assertRaises(ValueError):
            renderer.render({**self.article, 'title': 'Unzulässig lang ' * 500})

    def test_release_requires_current_poc_context_in_image_metadata(self):
        output = io.BytesIO()
        renderer.render(self.article).save(output, 'PNG')
        with self.assertRaises(ValueError): validator.check_image(output.getvalue(), (1200, 630), require_poc=True)
        info = PngInfo()
        info.add_text('news_poc', renderer.DISCLOSURE['label'])
        info.add_text('news_workflow', renderer.DISCLOSURE['summary'])
        current = io.BytesIO()
        renderer.render(self.article).save(current, 'PNG', pnginfo=info)
        validator.check_image(current.getvalue(), (1200, 630), require_poc=True)


if __name__ == '__main__':
    unittest.main()
