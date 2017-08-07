/**
 * Created by Administrator on 2016/12/23.
 */
var $box=$(".box");
var $mask=$(".mask");
$box.on({
    "mouseenter":function (e) {
        var directionval=getDirection.call(this,e);
        var target=null;
        switch (directionval){
            case 0:
                target={left:-120,top:0};
                break;
            case 1:
                target={left:0,top:120};
                break;
            case 2:
                target={left:120,top:0};
                break;
            case 3:
                target={left:0,top:-120};
                break;
        }
        $mask.css(target);
        $mask.eq($(this).index()).stop().animate({left:0,top:0});
    },
    "mouseleave":function (e) {
        var directionval=getDirection.call(this,e);
        var target=null;
        switch (directionval){
            case 0:
                target={left:-120,top:0};
                break;
            case 1:
                target={left:0,top:120};
                break;
            case 2:
                target={left:120,top:0};
                break;
            case 3:
                target={left:0,top:-120};
                break;
        }
        $mask.eq($(this).index()).stop().animate(target);
    }
});
function getDirection(e) {
    e=e||window.event;
    e.pageX=e.pageX||(e.clientX+document.documentElement.scrollLeft||document.body.scrollLeft);
    e.pageY=e.pageY||(e.clientY+document.documentElement.scrollTop||document.body.scrollTop);
    var x=e.pageX-this.offsetLeft-this.offsetWidth/2;
    var y=this.offsetTop+this.offsetHeight/2-e.pageY;
    var rad=Math.atan2(y,x);
    var ang=rad*180/Math.PI;
    var res=Math.round((ang+180)/90)%4;
    return res;
}