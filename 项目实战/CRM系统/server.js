/**
 * Created by Administrator on 2017/1/4.
 */
var http=require("http"),url=require("url"),fs=require("fs");
var server1=http.createServer(function (req,res) {
    var urlObj=url.parse(req.url,true),
        pathname=urlObj.pathname,
        query=urlObj.query;
    var regFile=/\.([0-9a-zA-Z]+)/;
    if(regFile.test(pathname)){
        var conFile="not found!",
            status=404;
        try{
            conFile=fs.readFileSync("."+pathname,"utf-8");
            status=200;
        }catch (e){
        }
        var suffix=regFile.exec(pathname)[1].toUpperCase(),
            suffixMIME="text/plain";
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
        res.writeHead(status,{"content-Type":suffixMIME+";charset=utf-8;"});
        res.end(conFile);
    }
    var customData=fs.readFileSync("./json/custom.json"),
        customId=query["id"],
        result={
            code:1,
            msg:"ERROR",
            data:null
        };
    customData.length==0?customData="[]":null;
    customData=JSON.parse(customData);
    //1、获取所有客户信息
    if(pathname=="/getAllList"){
        if(customData.length>0){
            result={
                code:0,
                msg:"SUCCESS",
                data:customData
            }
        }
        res.writeHead(200,{"content-Type":"application/json;charset=utf-8;"});
        res.end(JSON.stringify(result));
        return;
    }
    //2、获取指定ID的用户信息
    if(pathname=="/getInfo"){
        customData.forEach(function (item,index) {
            if(item.id==customId){
                result={
                    code:0,
                    msg:"SUCCESS",
                    data:item
                }
            }
        });
        res.writeHead(200,{"content-Type":"application/json;charset=utf-8;"});
        res.end(JSON.stringify(result));
        return;
    }
    //3、新增用户信息
    if(pathname=="/addInfo"){
        var passData="";
        req.on("data",function (chunk) {
            passData+=chunk;
        });
        req.on("end",function () {
            passData=JSON.parse(passData);
            passData["id"]=customData.length==0?1:parseInt(customData[customData.length-1]["id"])+1;
            customData.push(passData);
            fs.writeFileSync("./json/custom.json",JSON.stringify(customData),"utf-8");
            result={
                code:0,
                msg:"SUCCESS"
            };
            res.writeHead(200,{"content-Type":"application/json;charset=utf-8;"});
            res.end(JSON.stringify(result));
        });
        return;
    }
    //4、修改用户信息
    if(pathname=="/updateInfo"){
        passData="";
        req.on("data",function (chunk) {
            passData+=chunk;
        });
        req.on("end",function () {
            passData=JSON.parse(passData);
            customData.forEach(function (item,index) {
                if(item.id==passData.id){
                    customData[index]=passData;
                    fs.writeFileSync("./json/custom.json",JSON.stringify(customData),"utf-8");
                    result={
                        code:0,
                        msg:"SUCCESS"
                    }
                }
            });
            res.writeHead(200,{"content-Type":"application/json;charset=utf-8;"});
            res.end(JSON.stringify(result));
        });
        return;
    }
    //5、删除用户信息
    if(pathname=="/removeInfo"){
        customData.forEach(function (item,index) {
            if(item.id==customId){
                customData.splice(index,1);
                fs.writeFileSync("./json/custom.json",JSON.stringify(customData),"utf-8");
                result={
                    code:0,
                    msg:"SUCCESS"
                }
            }
        });
        res.writeHead(200,{"content-Type":"application/json;charset=utf-8;"});
        res.end(JSON.stringify(result));
        return;
    }
    res.writeHead(404,{"content-Type":"text/plain;charset=utf-8;"});
    res.end("API ERROR!");
});
server1.listen(80,function () {
   console.log("server is success,listening on 80 port!");
});