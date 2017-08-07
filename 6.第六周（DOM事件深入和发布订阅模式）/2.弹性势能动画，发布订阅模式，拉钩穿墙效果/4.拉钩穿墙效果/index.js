/**
 * Created by Administrator on 2016/12/23.
 */
var box=document.getElementById("box");
var mask=document.getElementById("mask");
box.onmouseenter=function (e) {
    var directionval=getDirection.call(this,e);
    var target=null;
    /*
     在发生mouseover和mouseout事件时，还会涉及更多的元素。这两个事件都会涉及把鼠标指针从一个元素的边界之内移到另一个元素边界之内。对mouseover事件而言，事件的主目标是获得光标的元素，而相关元素就是那个失去光标的元素。类似地，对mouseout事件而言，事件的主目标是失去光标的元素，而相关元素则是获得光标的元素。
    * */
    //mouseover和mouseout会导致事件冒泡，多次触发box的onmouseover事件，最简单的方法就是用onmouseenter和onmouseleave代替，这两个方法不支持事件冒泡
    /*
    var fromEle=e.fromElement||e.relatedTarget;
    if(box.contains(fromEle)){//如果box包含fromEle这个子元素
        return;
    }*/
    switch (directionval){
        case 0:
            target={left:-100,top:0};
            break;
        case 1:
            target={left:0,top:100};
            break;
        case 2:
            target={left:100,top:0};
            break;
        case 3:
            target={left:0,top:-100};
            break;
    }
    $(mask).css(target);
    $(mask).stop().animate({left:0,top:0});
};
box.onmouseleave=function (e) {
    var directionval=getDirection.call(this,e);
    var target=null;
    /*var fromEle=e.fromElement||e.relatedTarget;
    if(box.contains(fromEle)){
        return;
    }*/
    switch (directionval){
        case 0:
            target={left:-100,top:0};
            break;
        case 1:
            target={left:0,top:100};
            break;
        case 2:
            target={left:100,top:0};
            break;
        case 3:
            target={left:0,top:-100};
            break;
    }
    $(mask).stop().animate(target);
};
function getDirection(e) {
    e=e||window.event;
    e.pageX=e.pageX||(e.clientX+document.documentElement.scrollLeft||document.body.scrollLeft);
    e.pageY=e.pageY||(e.clientY+document.documentElement.scrollTop||document.body.scrollTop);
    var x=e.pageX-this.offsetLeft-this.offsetWidth/2;
    var y=this.offsetTop+this.offsetHeight/2-e.pageY;
    //求出弧度值
    var rad=Math.atan2(y,x);
    //360度=2*(Math.PI)弧度====>1弧度=180度/(Math.PI)
    //===>1度=1弧度*180/(Math.PI)
    //求出角度值
    var ang=rad*180/Math.PI;
    var res=Math.round((ang+180)/90)%4;//这样是为了方便判断
    return res;
}