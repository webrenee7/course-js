/**
 * Created by Administrator on 2016/12/20.
 */
function Drag(ele) {
    this.ele=ele;
    this.l=null;
    this.t=null;
    function processThis(callback,context) {//把callback中的this修改成context
        return function (e) {
            callback.call(context,e);
        }
    }
    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,"mousedown",this.DOWN);
}
Drag.prototype={
    constructor:Drag,
    down:function (e) {
        this.l=e.pageX-this.ele.offsetLeft;
        this.t=e.pageY-this.ele.offsetTop;
        if(this.ele.setCapture){
            this.ele.setCapture();
            on(this.ele,"mousemove",this.MOVE);
            on(this.ele,"mouseup",this.UP);
        }else{
            on(document,"mousemove",this.MOVE);
            on(document,"mouseup",this.UP);
        }
    },
    move:function (e) {
        var left=e.pageX-this.l;
        var top=e.pageY-this.t;
        var minL=0,minT=0,maxL=(document.documentElement.clientWidth||document.body.clientWidth)+this.ele.offsetWidth,maxT=(document.documentElement.clientHeight||document.body.clientHeight)+this.ele.offsetHeight;
        left=left<minL?minL:(left>maxL?maxL:left);
        top=top<minT?minT:(top>maxT?maxT:top);
        this.ele.style.left=left+"px";
        this.ele.style.top=top+"px";
        e.preventDefault();
    },
    up:function () {
        if(this.ele.releaseCapture){
            this.ele.releaseCapture();
            off(this.ele,"mousemove",this.MOVE);
            off(this.ele,"mouseup",this.UP);
        }else{
            off(document,"mousemove",this.MOVE);
            off(document,"mouseup",this.UP);
        }
    }
}