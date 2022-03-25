from http.server import HTTPServer, BaseHTTPRequestHandler

import logging
import sys

logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler(sys.stdout))

class HelloHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; utf-8')
        self.end_headers()

        with open('index.html', 'rb') as file: 
            self.wfile.write(file.read())

if __name__ == '__main__':
    logger.info("PC browswer http://localhost:8000/")
    logger.info("Mobile browser 192.168.x.x:8000/")
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, HelloHandler)
    httpd.serve_forever()
