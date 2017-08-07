/**
 * Created by Administrator on 2016/12/29.
 */
//1、导入内置模块
//内置模块包括：
//http:提供了处理服务和处理请求响应的模块
//url:提供了对url的操作
//fs:提供了对文件的I/O操作
var http=require("http"),url=require("url"),fs=require("fs");
//2、创建一个服务
var server1=http.createServer(function (request,response) {
    //客户端向服务器发送请求后才执行以下代码
    //request:存储了从客户端发送过来的请求信息
    //response:提供了服务器返回给客户端内容的一系列方法
   var urlObj=url.parse(request.url,true),pathname=urlObj.pathname,query=urlObj.query;
    //request.url：存储了url地址  资源路径+问号传参
    //url.parse()对url进行解析，如果是true,是将url转化为对象键值对的方式
    //pathname：是请求资源文件的路径和名称
    //query：是问号传参以对象键值对的方式存储起来
    /*if(pathname=="/index.html"){
        var conFile=fs.readFileSync("./index.html","utf-8");
        response.end(conFile);
    }*/
    //如果处理请求回来的是资源文件，走以下流程
    var reg=/\.([0-9a-zA-Z]+)/i;
    if(reg.test(pathname)){//如果有后缀名，说明请求回来的是资源文件
        var conFile="sorry,resources requested does't find!";//设置默认值
        try{
            conFile=fs.readFileSync("."+pathname);//如果没有找到文件，会返回默认值
        }catch (e){

        }
        //重写响应头信息：指定返回内容的MIME类型
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME="text/plain";
        //根据文件后缀名，设置MIME类型
        switch(suffix){
            case "HTML":
                suffixMIME="text/html";
                break;
            case "CSS":
                suffixMIME="text/css";
                break;
            case "JS":
                suffixMIME="text/javascript";
                break;
        }
        response.writeHead(200,{
            "content-Type":suffixMIME
        });
        response.end(conFile);
    }


});
//3、监听端口
server1.listen(81,function () {//如果端口被占用了，需要换一个端口，或者停止使用该端口的服务
    //监听端口成功后就执行以下代码
   console.log("server is success,listening on port 81!");
});