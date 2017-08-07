/**
 * Created by Administrator on 2016/12/30.
 */
(function () {

//JS高阶编程思想："惰性思想"  能够执行一次就搞定的绝对不会执行多次*/
//创建AJAX对象，要求兼容所有浏览器
    function createXHR() {
        var xhr=null,
            flag=false;
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
                //本次循环获取的方法执行没有出现错误，说明此方法是我想要的，我们下一次直接执行这个小方法即可，这就需要我们把creatXHR重写为小方法（完成后不需要再判断下面的了，直接退出循环即可）
                createXHR=curFn;
                flag=true;
                break;//结束循环
            }catch(e){
                //本次循环获取的方法执行出现错误，继续执行下一次循环
            }
        }
        if(!flag){//一个方法都不支持
            throw new Error("your browser is not support ajax,please change your broswer,try again!");
        }
        return xhr;
    }
//实现AJAX请求的公共方法,当一个方法传递的参数值过多，而且还不固定，我们使用对象统一传值法==》把需要传递的参数值都先放在一个对象值，一起传进去
    function ajax(options) {
        //把需要使用的参数值设定一个规则和初始值
        var _default={
            url:"",//请求的地址
            type:"get",//请求的方式
            dataType:"json",//设置请求回来的内容格式
            async:true,//请求是同步还是异步
            data:null,//放在请求主体中的内容
            getHead:null,//当readyState=2的时候执行的回调方法
            success:null//当readyState=4的时候执行的回调方法
        };
        //使用用户自己传递进来的值覆盖默认值
        for(var key in options){
            if(options.hasOwnProperty(key)){
                _default[key]=options[key];
            }
        }
        //如果当前的请求方式是get请求，我们需要在url的末尾加随机数清除缓存
        if(_default.type=="get"){
            _default.url.indexOf("?")>=0?_default.url+="&":_default.url+="?";
            _default.url+="_="+Math.random();
        }
        var xhr=createXHR();
        xhr.open(_default.type,_default.url,_default.async);
        xhr.onreadystatechange=function () {
            if(/^2\d{2}$/.test(xhr.status)){
                if(xhr.readyState===2){
                    //想要在readyState=2的时候做一些操作，我们需要保证AJAX是异步请求
                    if(typeof _default.getHead=="function"){
                        _default.getHead.call(xhr);
                    }
                }
                if(xhr.readyState===4){
                    var val=xhr.responseText;
                    if(typeof _default.dataType=="json"){//如果传递的参数值是json，说明获取的内容应该是json格式的对象
                        val="JSON" in window?JSON.parse(val):eval("("+val+")");
                    }
                    _default.success&&_default.success.call(xhr,val);
                }
            }
        };
        xhr.send(_default.data);
    }
    window.ajax=ajax;
})();
