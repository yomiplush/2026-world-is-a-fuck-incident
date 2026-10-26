#!/usr/bin/env python3
"""Local static server with Pages-style clean HTML URLs and real404s."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import sys
ROOT = Path(__file__).resolve().parents[1] / 'site'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
    def translate_path(self,path):
        result=super().translate_path(path)
        if not Path(result).exists() and Path(result+'.html').is_file():return result+'.html'
        return result
if __name__=='__main__':ThreadingHTTPServer(('127.0.0.1',int(sys.argv[1]) if len(sys.argv)>1 else 8096),Handler).serve_forever()
