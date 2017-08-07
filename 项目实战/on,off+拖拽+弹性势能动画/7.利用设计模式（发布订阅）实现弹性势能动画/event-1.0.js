/**
 * Created by Administrator on 2016/12/23.
 */
//绑定事件
function on(ele,type,handler) {
    if(/^self/.test(type)){//当事件类型前缀是self时候，将该事件绑定的所有函数放到数组中，但是不执行，执行的时候要用selfrun方法
        if(!ele[type]){//type此时不是系统事件，可以不加前缀
            ele[type]=[];
        }
        var ary=ele[type];
        for(var i=0;i<ary.length;i++){
            if(ary[i]==handler){
                return;
            }
        }
        ary.push(handler);
        return;
    }
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
//selfrun负责找到对应事件类型的自定义属性数组，并且依次执行其中的每一项（函数）
function selfrun(type,e) {
    var ary=this["self"+type];
    if(ary&&ary.length){
        for(var i=0;i<ary.length;i++){
            if(typeof ary[i]=="function"){
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
    if(/^self/.test(type)){
        var ary=ele[type];
        if(ary&&ary.length){
            for(var i=0;i<ary.length;i++){
                if(ary[i]==handler){
                    ary[i]=null;
                    break;
                }
            }
        }
        return;
    }
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
//修改this
function processThis(callback,context) {
    return function (e) {
        callback.call(context,e);
    }
}