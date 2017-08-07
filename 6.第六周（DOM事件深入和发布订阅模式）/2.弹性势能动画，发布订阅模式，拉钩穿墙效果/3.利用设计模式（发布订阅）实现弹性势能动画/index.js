/**
 * Created by Administrator on 2016/12/23.
 */
//new Drag(div1);
function Drag(ele){
    this.ele=ele;
    this.l=null;
    this.t=null;
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
        // increaseZIndex.call(this);
        selfrun.call(this.ele,"dragstart",e);//鼠标按下时，执行开始拖拽事件dragstart
    },
    move:function (e) {
        var left=e.pageX-this.l;
        var top=e.pageY-this.t;
        var minL=0,minT=0,maxL=(document.documentElement.clientWidth||document.body.clientWidth)-this.ele.offsetWidth,maxT=(document.documentElement.clientHeight||document.body.clientHeight)-this.ele.offsetHeight;
        left=left<minL?minL:(left>maxL?maxL:left);
        top=top<minT?minT:(top>maxT?maxT:top);
        this.ele.style.left=left+"px";
        this.ele.style.top=top+"px";
        e.preventDefault();
        // getSpeed.call(this);
        selfrun.call(this.ele,"draging",e);//鼠标移动时，执行正在拖拽事件draging
    },
    up:function (e) {
        if(this.ele.releaseCapture){
            this.ele.releaseCapture();
            off(this.ele,"mousemove",this.MOVE);
            off(this.ele,"mouseup",this.UP);
        }else{
            off(document,"mousemove",this.MOVE);
            off(document,"mouseup",this.UP);
        }
        /*fly.call(this);
        drop.call(this);*/
        //这样把代码写死了，所有要操作的元素都会执行该方法
        //使用发布订阅模式方法，只有订阅了该方法的元素才执行该方法
        selfrun.call(this.ele,"dragend",e);//鼠标抬起时，执行拖拽结束事件dragend
    }
};
function increaseZIndex() {
    //this->ele
    var divList=document.getElementsByTagName("div");
    for(var i=0;i<divList.length;i++){
        divList[i].style.zIndex=0;
    }
    this.style.zIndex=1;
}
function getSpeed() {
    //this->ele
    if(this.prev){
        this.speed=this.offsetLeft-this.prev;
    }
    this.prev=this.offsetLeft;
}
function fly() {
    //this->ele
    var _this=this;
    window.clearInterval(this.flyTimer);
    this.flyTimer=window.setInterval(function () {
        var curLeft=_this.offsetLeft;
        _this.speed*=0.99;
        curLeft+=_this.speed;
        if(Math.abs(_this.speed)<0.5){
            window.clearInterval(_this.flyTimer);
            return;
        }
        var minL=0,maxL=(document.documentElement.clientWidth||document.body.clientWidth)-_this.offsetWidth;
        if(curLeft>maxL){
            _this.style.left=maxL+"px";
            _this.speed*=-1;
        }else if(curLeft<minL){
            _this.style.left=minL+"px";
            _this.speed*=-1;
        }else{
            _this.style.left=curLeft+"px";
        }
    },10);
}
function drop() {
    //this->ele
    var _this=this;
    window.clearInterval(this.dropTimer);
    this.dropTimer=window.setInterval(function () {
        if(_this.flag>=2){
            window.clearInterval(_this.dropTimer);
            return;
        }
        _this.dropSpeed=!_this.dropSpeed?9.8:_this.dropSpeed+9.8;
        _this.dropSpeed*=0.99;
        var curTop=_this.offsetTop;
        curTop+=_this.dropSpeed;
        var maxT=(document.documentElement.clientHeight||document.body.clientHeight)-_this.offsetHeight;
        if(curTop>=maxT){
            _this.style.top=maxT+"px";
            _this.dropSpeed*=-1;
            _this.flag++;
        }else{
            _this.style.top=curTop+"px";
            _this.flag=0;
        }
    },10);
}
