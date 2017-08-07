/**
 * Created by Administrator on 2017/1/2.
 */
//使用惰性思想，处理AJAX对象的兼容性
function createXHR() {
    var xhr = null,
        flag = false,
        ary = [
            function () {//标准浏览器
                return new XMLHttpRequest();
            },
            //IE7及以下
            function () {
                return new ActiveXObject("Microsoft.XMLHTTP");
            },
            function () {
                return new ActiveXObject("Msxml2.XMLHTTP");
            },
            function () {
                return new ActiveXObject("Msxml3.XMLHTTP");
            }
        ];
    for (var i = 0; i < ary.length; i++) {
        var curFn = ary[i];
        try {
            xhr = curFn();
            createXHR = curFn;
            flag = true;
            break;
        } catch (e) {
        }
    }
    if (!flag) {
        throw new Error("your browser is not support ajax,please change your browser,try again!");
    }
    return xhr;
}
function ajax(opts) {
    //设置默认参数
    var _default = {
        url: "",//请求地址
        type: "get",//请求方式
        dataType: "text",//预设获取的数据类型
        data: null,//客户端传递给服务器端的数据
        async: true,//同步还是异步，true为同步，false为异步
        cache: true,//是否清楚缓存，true为不清除，false为清除
        success: null,//成功
        error: null,//失败
        header: null//获取到响应头
    };
    //用传递进来的参数覆盖默认参数
    for (var key in opts) {
        if (opts.hasOwnProperty(key)) {
            _default[key] = opts[key];
        }
    }
    var mark = _default.url.indexOf("?") >= 0 ? "&" : "?",//设置URL连接符，如果有问号，用&连接，否则用?
        regGet = /^(get|delete|head)$/i;//判断是否为get系列请求的正则
    if (_default.data) {//传递的数据存在，才执行后面的操作
        if (regGet.test(_default.type)) {//GET请求：将数据以URL问号传参的形式发送给服务器
            _default.data = formatData(_default.data);//将对象键值对转化为URL问号传参的形式
            _default.url += mark + _default.data;
            _default.data = null;
        } else {//POST请求：将数据放在请求主体中发送给服务器
            _default.data = JSON.stringify(_default.data);
        }
    }
    if (regGet.test(_default.type) && _default.cache == false) {//是GET请求，并且cache=false
        mark = _default.url.indexOf("?") >= 0 ? "&" : "?";//此处必须要给mark重新赋值，因为url有可能改变了
        _default.url += mark + "_=" + Math.random();//清除缓存
    }
    var xhr = createXHR();//创建一个AJAX对象（做过兼容性处理）
    xhr.open(_default.type, _default.url, _default.async);//打开一个URL地址
    xhr.onreadystatechange = function () {
        if (/^(?:2|3)\d{2}$/.test(xhr.status)) {//服务器的状态为2或者3开头，代表成功
            if (xhr.readyState == 2) {//AJAX状态为2，说明接收到响应头
                var serverTime = new Date(xhr.getResponseHeader("Date"));
                _default.header && _default.header.call(xhr, serverTime);
            }
            if (xhr.readyState == 4) {//AJAX状态为4，说明接收到响应主体
                var val = xhr.responseText;
                _default.dataType = _default.dataType.toUpperCase();
                //根据获取到的文件内容格式的不同，做相应的处理
                switch (_default.dataType) {
                    case "JSON":
                        val = "JSON" in window ? JSON.parse(val) : eval("(" + val + ")");
                        break;
                    case "XML":
                        val = xhr.responseXML;
                        break;
                }
                _default.success && _default.success.call(xhr, val);//如果回调函数success存在，就执行它，同时改变它的this为xhr
            }
        }
        _default.error && _default.error.call(xhr, {
            status: xhr.status,//AJAX状态
            statusText: xhr.statusText//AJAX状态说明
        });
    };
    xhr.send(_default.data);//发送AJAX对象（_default.data为响应主体内容）
}
//将对象键值对转化为URL问号传参的形式
//{name:xy,age:12}
//===>name=xy&age=12
function formatData(obj) {
    if (({}).toString.call(obj) !== "[object Object]") {
        return;
    }
    var result = "";
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result += key + "=" + obj[key] + "&";
        }
    }
    result = result.substr(0, result.length - 1);
    return result;
}