# Hello WebGL

- [Summary](#summary)
- [How to](#how_to)
  * [1. Create a python http server](#create_server)
  * [2. Create your WebGL content](#create_content)
  * [3. Find your computer ip address (Windows PowerShell)](#find_ip_address)
  * [4. View results on phone](#view_results)
- [Conclusions](#conclusions)


## Summary
Goal of this project is to get a hello world WebGL from your home PC to your mobile phone. This was done on a Window 10 PC for development. Android Pixel 3 XL with a Chrome browser.

## How to

<a name="create_server"></a>
#### 1. Create a python http server

``` python
from http.server import HTTPServer, BaseHTTPRequestHandler

class HelloHandler(BaseHTTPRequestHandler):
   def do_GET(self):
       self.send_response(200)
       self.send_header('Content-type', 'text/html; charset=utf-8')
       self.end_headers()

       with open('index.html', 'rb') as file:
           self.wfile.write(file.read())

if __name__ == '__main__':
   server_address = ('', 8000)
   httpd = HTTPServer(server_address, HelloHandler)
   httpd.serve_forever()
```

<a name="create_content"></a>
#### 2. Create your WebGL content

``` html
<!doctype html>
<html lang="en">
 <head>
   <title>WebGL Demo</title>
   <meta charset="utf-8">
   <link rel="stylesheet" href="../webgl.css" type="text/html">
 </head>

 <body>
   <canvas id="glcanvas"/>
 </body>

 <script
   src="https://code.jquery.com/jquery-3.3.1.min.js"
   integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
   crossorigin="anonymous">
 </script>

 <script>
   main();
  
   function main() {
     const canvas = document.getElementById("glcanvas");
     canvas.width = $(window).width();
     canvas.height = $(window).height();

     const gl = canvas.getContext("webgl");
     if (!gl) {
       alert("Your browser may not support WebGL.");
       return;
     }

     gl.clearColor(0.18, 0.55, 0.34, 1.0);
     gl.clear(gl.COLOR_BUFFER_BIT);
   }
 </script>
</html>
```

<a name="find_ip_address"></a>
#### 3. Find your computer ip address 

(Linux)
```
$ ifconfig
enp4s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::347e:d2d1:1871:aa1c  prefixlen 64  scopeid 0x20<link>
        inet6 2604:5500:c004:f900:c589:a1d2:4a08:7cb  prefixlen 64  scopeid 0x0<global>
        ether 40:8d:5c:e3:7d:02  txqueuelen 1000  (Ethernet)
        RX packets 31738731  bytes 38001886045 (35.3 GiB)
        RX errors 0  dropped 916  overruns 0  frame 0
        TX packets 7855912  bytes 1593862791 (1.4 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
        device interrupt 18  
```

(Windows PowerShell)
```
>> ipconfig
...
Wireless LAN adapter Wi-Fi:

   Connection-specific DNS Suffix  . :
   Link-local IPv6 Address . . . . . : fe80::8c5a:f427:cd9b:3b9b%6
   IPv4 Address. . . . . . . . . . . : 192.168.154.123
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.154.1
...
```

<a name="view_results"></a>
#### 4. View results on phone
From your mobile device add the ip address into your browser followed by the port
E.g., 192.168.154.123:8000

## Conclusions
WebGL is nice where you can test on a browser and see results from javascript and HTML with simple browser refreshes.

Further investigation needed to deal with window sizes. Maybe check if there needs to be a resize when drawing frames.
