/**
 * Created by Administrator on 2016/12/25.
 */
var wrap=document.getElementById("wrap");
var inner=document.getElementById("inner");
var lis=wrap.getElementsByTagName("li");
var screenH=$("body").innerHeight();
var step=0;
var isOkWheel=true;
addWheelEventListener(inner,function (isDown,e) {
    if(isOkWheel){
        if(isDown){
            if(step==lis.length-1){
                return;
            }
            step++;
        }else{
            if(step==0){
                return;
            }
            step--;
        }
        $(inner).stop().animate({top:-step*screenH},function () {
            isOkWheel=true;
        });
        for(var i=0;i<lis.length;i++){
            lis[i].className=i==step?"selected":"";
        }
        isOkWheel=false;
    }
});