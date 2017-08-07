/**
 * Created by Administrator on 2016/12/23.
 */
var box=document.getElementById("box");
on(box,"mousedown",function (e) {
    this.l=e.pageX-this.offsetLeft;
    this.t=e.pageY-this.offsetTop;
    if(this.setCapture){
        this.setCapture();
        on(box,"mousemove",move);
        on(box,"mouseup",up);
    }else{
        // on(document,"mousemove",move);//这样绑定move中的this是document
        /*var _this=this;
        on(document,"mousemove",function () {//如果这样绑定，解绑时候找不到函数名字，所以要使用实名函数绑定
            move.call(_this,e);
        });*/
        /*var _this=this;
        this.MOVE=function () {
            move.call(_this,e);
        };
        this.UP=function () {
            move.call(_this,e);
        };
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);*/
        //修改this的过程封装为一个函数(在event-1.0.js中)
        this.MOVE=processThis(move,this);
        this.UP=processThis(up,this);
        on(document,"mousemove",this.MOVE);//on方法尽量绑定实名函数，以便于解绑时能找到该函数
        on(document,"mouseup",this.UP);
    }
});
function move(e) {
    var left=e.pageX-this.l;
    var top=e.pageY-this.t;
    var minL=0,minT=0,maxL=(document.documentElement.clientWidth||document.body.clientWidth)+this.offsetWidth,maxT=(document.documentElement.clientHeight||document.body.clientHeight)+this.offsetHeight;
    left=left<minL?minL:(left>maxL?maxL:left);
    top=top<minT?minT:(top>maxT?maxT:top);
    this.style.left=left+"px";
    this.style.top=top+"px";
}
function up() {
    if(this.releaseCapture){
        this.releaseCapture();
        off(box,"mousemove",move);
        off(box,"mouseup",up);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
}