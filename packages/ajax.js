/**
 * Created by Administrator on 2017/1/2.
 */
function createXHR() {
    var xhr=null,
        flag=false,
        ary=[
            function () {
                return new XMLHttpRequest();
            },
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
    for(var i=0;i<ary.length;i++){
        var curFn=ary[i];
        try{
            xhr=curFn();
            createXHR=curFn;
            flag=true;
            break;
        }catch (e){
        }
    }
    if(!flag){
        throw new Error("your browser is not support ajax,please change your browser,try again!");
    }
    return xhr;
}
function ajax(opts) {
    var _default={
        url:"",
        type:"get",
        dataType:"text",
        data:null,
        async:true,
        cache:true,
        success:null,
        error:null,
        header:null
    };
    for(var key in opts){
        if(opts.hasOwnProperty(key)){
            _default[key]=opts[key];
        }
    }
    var mark=_default.url.indexOf("?")>=0?"&":"?",
        regGet=/^(get|delete|head)$/i;
    if(_default.data){
        if(regGet.test(_default.type)){
            _default.data=formatData(_default.data);
            _default.url+=mark+_default.data;
            _default.data=null;
        }else{
            _default.data=JSON.stringify(_default.data);
        }
    }
    if(regGet.test(_default.type)&&_default.cache==false){
        mark=_default.url.indexOf("?")>=0?"&":"?";
        _default.url+=mark+"_="+Math.random();
    }
    var xhr=createXHR();
    xhr.open(_default.type,_default.url,_default.async);
    xhr.onreadystatechange=function () {
        if(/^(?:2|3)\d{2}$/.test(xhr.status)){
            if(xhr.readyState==2){
                var serverTime=new Date(xhr.getResponseHeader("Date"));
                _default.header&&_default.header.call(xhr,serverTime);
            }
            if(xhr.readyState==4){
                var val=xhr.responseText;
                _default.dataType=_default.dataType.toUpperCase();
                switch (_default.dataType){
                    case "JSON":
                        val="JSON" in window?JSON.parse(val):eval("("+val+")");
                        break;
                    case "XML":
                        val=xhr.responseXML;
                        break;
                }
                _default.success&&_default.success.call(xhr,val);
            }
        }
        _default.error&&_default.error.call(xhr,{
            status:xhr.status,
            statusText:xhr.statusText
        });
    };
    xhr.send(_default.data);
}
function formatData(obj) {
    if(({}).toString.call(obj)!=="[object Object]"){
        return;
    }
    var result="";
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            result+=key+"="+obj[key]+"&";
        }
    }
    result=result.substr(0,result.length-1);
    return result;
}