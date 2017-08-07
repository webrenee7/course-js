/**
 * Created by Administrator on 2016/12/17.
 */
// div1.attachEvent("onclick",handler);
function on(ele,type,handler){
    if(ele.addEventListener){
        ele.addEventListener();
    }
    if(ele.attachEvent){
        if(!ele["ev"+type]){
            ele["ev"+type]=[];
            ele.attachEvent("on"+type,function(){
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
    var ary=this["ev"+e.type];
    if(ary&&ary.length>0){
        for(var i=0;i<ary.length;i++){
            if(typeof ary[i]=="function"){
                ary[i].call(this);
            }else{
                ary.splice(i,1);
                i--;
            }
        }
    }
}
//div1.detachEvent("on"+type,handler);
function off(ele,type,handler) {
    if(ele.removeEventListener){
        ele.removeEventListener(type,handler);
        return;
    }
    var ary=ele["ev"+type];
    if(ary&&ary.length>0){
        for(var i=0;i<ary.length;i++){
            if(ary[i]==handler){
                ary[i]=null;
                i--;
                return;
            }
        }
    }
}

