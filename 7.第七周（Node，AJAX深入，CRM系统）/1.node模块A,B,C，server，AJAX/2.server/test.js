/**
 * Created by Administrator on 2016/12/29.
 */
var http=require("http"),url=require("url"),fs=require("fs");
var server1=http.createServer(function (request,response) {
    var urlObj=url.parse(request.url,true),
        pathname=urlObj.pathname,
        query=urlObj.query;
    var reg=/\.([0-9a-zA-Z]+)/i;
    if(reg.test(pathname)){//如果请求的是资源文件
        var conFile="sorry,resources requested does't find!";
        try{
            conFile=fs.readFileSync("."+pathname);
        }catch (e){

        }
        var suffix=reg.exec(pathname)[1].toUpperCase(),
            suffixMIME="text/plain";
        //重写响应头信息：指定返回内容的MIME类型
        switch (suffix){
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
        response.end(conFile);//把源代码返回给客户端
    }
});
server1.listen(81,function () {
   console.log("server is success,listening on 81 port!");
});