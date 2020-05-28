var path = ""; //path
var jsonUrl = "http://127.0.0.1:233" + path; //url for index json
var json = "";

function load() {
    if (path == "") {
        print("path", "/");
    } else {
        print("path", path);
    }
    var y = wget(jsonUrl, ls);
}

function cd(dir) {
    path = path + dir;
    load();
}

function ls(x) { //x为string格式的json数据
    json = JSON.parse(x);

    for (var i = 0; i < json.length; i++) {
        if (json[i].type == "directory") {
            
        } else if (json[i].type == "file") {
            
        }
    }
}

function addRow(type, name, time, size) {
}


function wget(url, callback) {
    var Http = new XMLHttpRequest(); //创建http请求
    Http.timeout = 3000;
    Http.open("GET", url, true);
    Http.responseType = "text";
    Http.send();
    Http.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            var x = Http.response;
            callback(x);
        }
    }
}

function print(id, content) {
    document.getElementById(id).innerHTML = content;
}