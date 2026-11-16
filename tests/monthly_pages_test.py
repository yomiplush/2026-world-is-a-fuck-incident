import importlib.util
import sys
import tempfile
import unittest
import types
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))

class MonthlyPagesTests(unittest.TestCase):
    def test_build_includes_legacy_reports_and_daily_pages(self):
        import monthly_pages
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp);site=root/'site';site.mkdir();(root/'data').mkdir()
            for name in ('day-20261017.html','update-20261025.html','update-20261026-1301.html'):(site/name).write_text('<h1>Historical report</h1>')
            pub=types.SimpleNamespace(ROOT=root,SITE=site,shell=lambda title,intro,body:body,clean_url=lambda s:s,LATEST={'site_report':'/update-current'})
            monthly_pages.build(pub)
            page=(site/'month-2026-10.html').read_text()
            for href in ('/day-20261017','/update-20261025','/update-20261026-1301'):self.assertIn('href="'+href+'"',page)

    def test_month_grouping_keeps_same_day_reviews_and_orders_newest_first(self):
        import monthly_pages
        records=[{'cutoff_jst':'2026-10-31T23:00:00+09:00','report':{'path':'a.html'}},
                 {'cutoff_jst':'2026-11-16T09:00:00+09:00','report':{'path':'b.html'}},
                 {'cutoff_jst':'2026-11-16T11:33:00+09:00','report':{'path':'c.html'}}]
        grouped=monthly_pages.group_reviews(records)
        self.assertEqual(list(grouped),['2026-11','2026-10'])
        self.assertEqual([r['report']['path'] for r in grouped['2026-11']],['c.html','b.html'])

    def test_render_month_is_static_bilingual_and_does_not_sum_incidents(self):
        import monthly_pages
        record={'cutoff_jst':'2026-11-16T11:33:00+09:00','counts':{'record_topic_groups':330},
                'report':{'path':'update-20261116-1133.html','title':'最新の調査'}}
        for lang in ('ja','en'):
            page=monthly_pages.render_month('2026-11',[record],lang)
            suffix='' if lang=='ja' else '.en'
            self.assertIn('/update-20261116-1133'+suffix,page)
            self.assertIn('/months'+suffix,page)
            self.assertIn('11:33',page)
            self.assertNotIn('330 incidents',page)
            self.assertNotIn('<script',page)

if __name__=='__main__':unittest.main()
