'use strict';

let path = "/";
let jsonUrl = "http://127.0.0.1:233"; //url for index json
let json;
let style = 1;

/**
 * Loads when <body> onload triggers.
 */
function load() {
    print("path", path);
    wget(`${jsonUrl}${path}`, ls);
}

/**
 * Change directory(path) to a relative path.
 * @param {string} dir 
 */
function cd(dir) {
    if (dir == ".." && path != "/") {
        x = path.split('/');
        path = "";
        for (let i = 0; i < x.length - 2; i++) {
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

/**
 * Receives json in string format, parse it, and print all the content in it on HTML.
 * @param {string} string 
 */
function ls(string) { //string为string格式的json数据
    json = JSON.parse(string);
    //document.getElementById("debug").innerHTML = string;
    style = 1; //重置style
    let frame = document.getElementById("frame");
    let table = document.getElementsByTagName("TABLE"); //找到原有<table>元素
    frame.removeChild(table[0]); //删除原有<table>元素
    let table = document.createElement("TABLE"); //创建一个<table>元素
    table.setAttribute("cellspacing", "0");
    frame.appendChild(table);
    let thead = document.createElement("THEAD"); //创建一个<thead>元素
    table.appendChild(thead);
    thead.appendChild(addHead()); //添加表头
    let tbody = document.createElement("TBODY"); //创建一个<tbody>元素
    table.appendChild(tbody);
    tbody.appendChild(addRow("directory", "..", "-", "-"));
    for (let i = 0; i < json.length; i++) {
        if (json[i].type == "directory") {
            tbody.appendChild(addRow(json[i].type, json[i].name, json[i].mtime, "-"));
        } else if (json[i].type == "file") {
            tbody.appendChild(addRow(json[i].type, json[i].name, json[i].mtime, json[i].size));
        }
    }

    json = JSON.parse("");
}

/**
 * Prints a row of <thead>.
 */
function addHead() {
    let th = document.createElement("TH");
    let tr = document.createElement("TR");
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

/**
 * Prints a row of information of files or directories.
 * @param {string} type 
 * @param {string} name 
 * @param {string} time 
 * @param {string} size 
 */
function addRow(type, name, time, size) {
    let tr = document.createElement("TR");
    let td = document.createElement("TD");
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
    let a = document.createElement("A");
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

/**
 * Setting class for HTML elements.
 * @param {Element} a 
 */
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

/**
 * Sending GET http requests.
 * @param {string} url 
 * @param {function} callback 
 */
function wget(url, callback) {
    let Http = new XMLHttpRequest(); //创建http请求
    Http.timeout = 3000;
    Http.open("GET", url, true);
    Http.responseType = "text";
    Http.send();
    Http.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            let x = Http.response;
            callback(x);
        } else if (this.status == 403) {
            callback("[]");
        }
    }
}

/**
 * Translate file size in byte to human readable units. 
 * @param {number} size 
 * @returns {number} result
 */
function humanSize(size) {
    const unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
    const standard = 1024;
    let modTimes = 0;
    while (size > standard) {
        size /= standard;
        modTimes += 1;
    }
    result = (Math.round(size * 100)) / 100 + unit[modTimes];
    return result;
}

/**
 * Just an alias.
 * @param {string} id 
 * @param {string} content 
 */
function print(id, content) {
    document.getElementById(id).innerHTML = content;
}