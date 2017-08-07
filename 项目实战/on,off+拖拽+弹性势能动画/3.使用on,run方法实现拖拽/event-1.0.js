/**
 * Created by Administrator on 2016/12/23.
 */
//绑定事件
//div1.attachEvent("on"+type,handler);
function on(ele,type,handler) {
    if(ele.addEventListener){//标准浏览器绑定事件
        ele.addEventListener(type,handler,false);
        return;
    }
    if(ele.attachEvent){//IE低版本浏览器绑定事件
        //将相同的事件类型绑定时要执行的函数放到自定义属性的数组中
        if(!ele["ev"+type]){
            ele["ev"+type]=[];
            // ele.attachEvent("on"+type,run);//这样执行run中的this是window
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
    //能执行run，说明是ie低版本浏览器
    //在run函数中处理好兼容性问题，以后就不用再处理了
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
    //run负责找到当前绑定的事件类型的自定义属性数组
    var ary=this["ev"+e.type];
    if(ary&&ary.length){
        for(var i=0;i<ary.length;i++){
            if(typeof ary[i]=="function"){//如果当前项是函数才执行
                //ary[i]();//这样执行ary[i]中的this是ary数组
                ary[i].call(this,e);
            }else{//当前项不是函数，要删除它
                ary.splice(i,1);//删除后会造成数组塌陷
                i--;//这样才能让所有的项都遍历到，不会落下
            }
        }
    }
}
//移除事件
//div1.detachEvent("on"+type,handler);
function off(ele,type,handler) {
    if(ele.removeEventListener){//标准浏览器移除事件
        ele.removeEventListener(type,handler);
        return;
    }
    if(ele.detachEvent){//ie低版本浏览器移除事件
        //找到当前要移除的事件类型的自定义属性数组
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
//修改this封装为一个函数
function processThis(callback,context) {//将callback中的this修改为context
    return function (e) {
        callback.call(context,e);
    }
}