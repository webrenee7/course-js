/**
 * Created by Administrator on 2017/1/2.
 */
//引入NODE模块
var http = require("http"),//提供了创建服务的方法
    url = require("url"),//提供了解析URL地址的方法
    fs = require("fs");//提供了文件的I/O操作
//创建服务
var server1 = http.createServer(function (req, res) {
    //req:存储了客户端传递过来的所有请求信息
    //res：提供了服务器返回给客户端内容的一系列方法
    var urlObj = url.parse(req.url, true),//url地址解析
        pathname = urlObj.pathname,//资源文件路径
        query = urlObj.query;//问号传参内容（对象键值对的形式）
    /*
     * 请求的是当前项目的静态资源文件:HTML/CSS/JS/IMG...
     * 1、所有的资源文件都有对应的后缀名,我们根据这个特点验证是否为资源文件
     * 2、读取资源文件中的内容(字符串或者BUFFER格式的数据)->容错处理
     * 3、通过文件的后缀名获取对应的MIME类型,以重写响应头的方法告诉IE对应的类型
     * 4、把读取到的内容返回给客户端的浏览器
     */
    var regFile = /\.([0-9a-zA-Z]+)/i;
    //对资源文件进行处理
    if (regFile.test(pathname)) {
        var conFile = "not found!", status = 404;
        try {
            conFile = fs.readFileSync("." + pathname, "utf-8");
            status = 200;
        } catch (e) {
        }
        //设置请求文件的MIME类型
        var suffix = regFile.exec(pathname)[1].toUpperCase(),
            suffixMIME = "text/plain";
        switch (suffix) {
            case "HTML":
                suffixMIME = "text/html";
                break;
            case "CSS":
                suffixMIME = "text/css";
                break;
            case "JS":
                suffixMIME = "text/javascript";
                break;
        }
        //重写响应头信息
        res.writeHead(status, {
            "content-Type": suffixMIME + ";charset=utf-8"
        });
        //将请求到的文件内容返回给浏览器
        res.end(conFile);
    }

    //实现API接口对应的功能
    /*
     * 1、真实项目中,我们的数据内容都存储在数据库中;本次案例我们把数据临时存储在本地项目的一个JSON文件中:json/custom.json
     * 2、不管是增加还是获取等操作,都需要先把文件中所有的客户信息获取到,然后在进行后续的操作,这样的话我们第一步就先获取所有的客户信息
     * 3、先初始化服务器返回的内容格式
     */
    var customData = fs.readFileSync("./json/custom.json", "utf-8"),//获取到所有数据，获取到的是JSON字符串格式的
        result = {code: 1, msg: "ERROR", data: null};
    customData.length == 0 ? customData = "[]" : null;//如果请求到文件内容为空，要设置为空数组，负责执行JSON.parse时，浏览器会报错，从而导致服务终止
    customData = JSON.parse(customData);

    //1、获取所有的用户信息
    if (pathname == "/getAllList") {
        if (customData.length > 0) {
            result = {code: 0, msg: "SUCCESS", data: customData};
        }
        res.writeHead(200, {"content-Type": "application/json;charset=utf-8;"});
        res.end(JSON.stringify(result));
        return;
    }

    //2、获取指定ID的用户信息
    /*
     * 接收客户端传递进来的ID(问号传参传递的),在query中存储着
     */
    if (pathname == "/getInfo") {
        var customId = query["id"];
        if (customData.length > 0) {
            customData.forEach(function (item, index) {
                if (item.id == customId) {
                    result = {code: 0, msg: "SUCCESS", data: item};
                }
            });
        }
        res.writeHead(200, {"content-Type": "application/json;charset=utf-8;"});
        res.end(JSON.stringify(result));
        return;
    }

    //3、增加用户信息
    /*
     * 1、获取客户端通过请求主体传递进来的客户信息 req.on('data') req.on('end') 使用这两个事件来处理
     * 2、传递进来的数据缺少客户ID(唯一并且自增长的),我们需要获取最后一项的ID,在原来的基础上加一,就是我们需要新增加这一项的ID
     * 3、把新增这一项放在数组的末尾,然后把最新的结果写入文件中
     */
    if (pathname == "/addInfo") {
        var passData = "";
        req.on("data", function (chunk) {//正在接受请求主体内容
            passData += chunk;
        });
        req.on("end", function () {//请求主体内容接收成功
            passData = JSON.parse(passData);
            passData["id"] = customData.length == 0 ? 1 : parseFloat(customData[customData.length - 1]["id"]) + 1;
            customData.push(passData);
            fs.writeFileSync("./json/custom.json", JSON.stringify(customData), "utf-8");
            result = {code: 0, msg: "SUCCESS"};
            res.writeHead(200, {"content-Type": "application/json;charset=utf-8;"});
            res.end(JSON.stringify(result));
        });
        return;
    }

    //4、修改用户信息
    if (pathname == "/updateInfo") {
        var passData = "";
        req.on("data", function (chunk) {
            passData += chunk;
        });
        req.on("end", function () {
            passData = JSON.parse(passData);
            customData.forEach(function (item, index) {
                if (item.id == passData.id) {
                    customData[index] = passData;
                    fs.writeFileSync("./json/custom.json", JSON.stringify(customData), "utf-8");
                    result = {code: 0, msg: "SUCCESS"};
                }
            });
            res.writeHead(200, {"content-Type": "application/json;charset=utf-8;"});
            res.end(JSON.stringify(result));
        });
        return;
    }

    //5、删除用户信息
    /*
     * 1、获取客户端传递进来的ID
     * 2、循环所有的客户信息,把和传递进来ID相同的那一项在数组中移除
     * 3、把最新的数组中的客户信息重新的写入到文件中
     * 4、返回给客户端成功还是失败
     */
    if (pathname == "/removeInfo") {
        customId = query["id"];
        customData.forEach(function (item, index) {
            if (item.id == customId) {
                customData.splice(index, 1);
                fs.writeFileSync("./json/custom.json", JSON.stringify(customData), "utf-8");
                result = {code: 0, msg: "SUCCESS"};
            }
        });
        res.writeHead(200, {"content-Type": "application/json;charset=utf-8;"});
        res.end(JSON.stringify(result));
        return;
    }

    //请求的API接口地址并没有在服务器上进行处理,说明请求的地址错误
    res.writeHead(404, {"content-Type": "text/plain;charset=utf-8;"});
    res.end("API ERROR!");
});
//监听端口
server1.listen(80, function () {
    console.log("server is success,listening on 80 port!");
});