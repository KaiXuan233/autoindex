var path = "/";
var jsonUrl = "http://127.0.0.1:233"; //url for index json
var json;
var style = 1;

function load() {
    print("path", path);
    wget(`${jsonUrl}${path}`, ls);
}

function cd(dir) {
    if (dir == ".." && path != "/") {
        x = path.split('/');
        path = "";
        for (var i = 0; i < x.length - 2; i ++) {
            path += x[i] + "/";
        }
    } else if (dir == ".." && path == "/") {
        path = "/";
    } else {
        path = `${path}${dir}/`;
    }
    print("path", path);
    wget(`${jsonUrl}${path}`, ls);
}

function ls(string) { //string为string格式的json数据
    json = JSON.parse(string);

    //document.getElementById("debug").innerHTML = string;

    style = 1; //重置style

    var frame = document.getElementById("frame");
    var table = document.getElementsByTagName("TABLE"); //找到原有<table>元素
    frame.removeChild(table[0]); //删除原有<table>元素
    var table = document.createElement("TABLE"); //创建一个<table>元素
    table.setAttribute("cellspacing", "0");
    frame.appendChild(table);
    var thead = document.createElement("THEAD"); //创建一个<thead>元素
    table.appendChild(thead);
    thead.appendChild(addHead()); //添加表头
    var tbody = document.createElement("TBODY"); //创建一个<tbody>元素
    table.appendChild(tbody);
    tbody.appendChild(addRow("directory", "..", "-", "-"));
    for (var i = 0; i < json.length; i++) {
        if (json[i].type == "directory") {
            tbody.appendChild(addRow(json[i].type, json[i].name, json[i].mtime, "-"));
        } else if (json[i].type == "file") {
            tbody.appendChild(addRow(json[i].type, json[i].name, json[i].mtime, json[i].size));
        }
    }

    json = JSON.parse("");
}

function addHead() {
    var th = document.createElement("TH");
    var tr = document.createElement("TR");
    //type
    th.innerHTML = "Type";
    th.setAttribute("id", "type");
    tr.appendChild(th);
    //name
    th = document.createElement("TH");
    th.innerHTML = "Name";
    th.setAttribute("id", "name");
    tr.appendChild(th);
    //time
    th = document.createElement("TH");
    th.innerHTML = "Time";
    th.setAttribute("id", "time");
    tr.appendChild(th);
    //size
    th = document.createElement("TH");
    th.innerHTML = "Size";
    th.setAttribute("id", "size");
    tr.appendChild(th);
    return tr;
}

function addRow(type, name, time, size) {
    var tr = document.createElement("TR");
    var td = document.createElement("TD");
    //type
    if (type == "directory") {
        td.innerHTML = "Directory";
    } else if (type == "file") {
        td.innerHTML = "File";
    } else {
        td.innerHTML = type;
    }
    tr.appendChild(td);
    //name
    td = document.createElement("TD");
    tr.appendChild(td);
    var a = document.createElement("A");
    if (type == "directory") {
        a.setAttribute("href", "#");
        a.setAttribute("onclick", `cd("${name}")`);
        a.innerHTML = `${name}/`;
        td.appendChild(a);
    } else if (type == "file") {
        a.setAttribute("href", `${path}/${name}`);
        a.innerHTML = name;
        td.appendChild(a);
    }
    //time
    td = document.createElement("TD");
    td.innerHTML = time;
    tr.appendChild(td);
    //size
    td = document.createElement("TD");
    if (type == "file") {
        td.innerHTML = humanSize(size);
    } else {
        td.innerHTML = size;
    }
    tr.appendChild(td);
    tr = addStyle(tr);
    return tr;

}

function addStyle(a) {
    if (style == 0) {
        a.setAttribute("class", "style1");
        style = 1;
    } else if (style == 1) {
        a.setAttribute("class", "style2");
        style = 0;
    }
    return a;
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
        } else if (this.status == 403) {
            callback("[]");
        }
    }
}

function humanSize(size) {
    const unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
    const standard = 1024;
    var modTimes = 0;
    while (size > standard) {
        size /= standard;
        modTimes += 1;
    }
    result = (Math.round(size * 100))/100 + unit[modTimes];
    return result;
}

function print(id, content) {
    document.getElementById(id).innerHTML = content;
}
