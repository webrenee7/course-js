/**
 * Created by Administrator on 2016/12/23.
 */
//绑定事件
function on(ele,type,handler) {
    if(ele.addEventListener){
        ele.addEventListener(type,handler,false);
        return;
    }
    if(ele.attachEvent){
        if(!ele["ev"+type]){
            ele["ev"+type]=[];
            ele.attachEvent("on"+type,function () {
                run.call(ele);
            });
        }
        var ary=ele["ev"+type];
        for(var i=0;i<ary.length;i++){
            if(ary[i]==handler){
                return;
            }
        }
        ary.push(handler);
    }
}
function run(e) {
    e=window.event;
    e.target=e.srcElement;
    e.pageX=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft);
    e.pageY=e.clientY+(document.documentElement.scrollTop||document.body.scrollTop);
    e.preventDefault=function () {
        e.returnValue=false;
    };
    e.stopPropagation=function () {
        e.cancelBubble=true;
    };
    var ary=this["ev"+e.type];
    if(ary&&ary.length){
        for(var i=0;i<ary.length;i++){
            if(typeof ary[i]=="function"){
                //ary[i]();
                ary[i].call(this,e);
            }else{
                ary.splice(i,1);
                i--;
            }
        }
    }
}
//移除事件
function off(ele,type,handler) {
    if(ele.removeEventListener){
        ele.removeEventListener(type,handler);
        return;
    }
    if(ele.detachEvent){
        var ary=ele["ev"+type];
        if(ary&&ary.length){
            for(var i=0;i<ary.length;i++){
                if(ary[i]==handler){
                    ary[i]=null;
                    break;
                }
            }
        }
    }
}
//处理this
function processThis(callback,context) {
    return function (e) {
        callback.call(context,e);
    }
}