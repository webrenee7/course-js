/**
 * Created by Administrator on 2016/12/23.
 */
//将on和off封装为构造函数,ie不允许在内置类原型上添加方法
Element.prototype.on=function (/*ele,*/type,handler) {
    if(this.addEventListener){
        this.addEventListener(type,handler,false);
        return;
    }
    if(this.attachEvent){
        if(!this["ev"+type]){
            this["ev"+type]=[];
            this.attachEvent("on"+type,function () {
                run.call(this);
            });
        }
        var ary=this["ev"+type];
        for(var i=0;i<ary.length;i++){
            if(ary[i]==handler){
                return;
            }
        }
        ary.push(handler);
    }
};
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
        if(typeof ary[i]=="function"){
            ary[i].call(this,e);
        }else{
            ary.splice(i,1);
            i--;
        }
    }
}
Element.prototype.off=function (/*ele,*/type,handler) {
    if(this.removeEventListener){
        this.removeEventListener(type,handler,false);
        return;
    }
    if(this.detachEvent){
        var ary=this["ev"+type];
        if(ary&&ary.length){
            for(var i=0;i<ary.length;i++){
                if(ary[i]==handler){
                    ary[i]=null;
                    break;
                }
            }
        }
    }
};