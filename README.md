# Autoindex
A front-end webpage for nginx's autoindex.
It parses the json provided by nginx and makes a GUI with HTML and CSS.

## Usage:
1. Config nginx to turn on autoindex
    example nginx.conf:
    
    ```conf
	server {
		listen 233; #any port you like
	charset utf-8; #avoiding encoding problems
	
		location / {
			root /;
			autoindex on;
			autoindex_format json;
			
			add_header Content-Type 'text/html; charset=utf-8'; #avoiding encoding problems
	
			#code from https://segmentfault.com/a/1190000012550346
			#解决无法跨域
			add_header Access-Control-Allow-Origin *;
			add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
			add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
			if ($request_method = 'OPTIONS') {
				return 204;
			}
		}
    }
    ```
	Note: 
	* `autoindex_format json;` is for nginx to autoindex in json format.
	* `add_header` options are for solving CORS security issues.  
	They are needed for autoindex to work properly.
2. Download files(`$ git clone` or download straightly from github) and put them under your webpage folder.
3. Edit `autoindex.js`: find this line (autoindex.js:2):

    ```javascript
    var jsonUrl = "var jsonUrl = "http://127.0.0.1:233"; //url for index json";
    ```
    then change `http://127.0.0.1:233` to your ip(domain or public ip) and port(you set in nginx).
4. Then you are good to go!
