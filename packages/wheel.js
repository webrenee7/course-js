/**
 * Created by Administrator on 2016/12/25.
 */
;(function () {
    function addWheelEventListener(ele,callback) {
        if(window.navigator.userAgent.indexOf("Firefox")===-1){//ie和谷歌
            ele.onmousewheel=fn;
        }else{
            ele.addWheelEventListener("DOMMouseScroll",fn);//火狐
        }
        document.body.onkeydown=fn;
        function fn(e) {
            e=e||window.event;
            e.preventDefault?e.preventDefault():e.returnValue=false;//不会触发在body上滚动的同时还触发onscroll事件
            var isDown=null;
            if(e.wheelDelta){
                isDown=e.wheelDelta<0;
            }else{
                isDown=e.detail>0;
            }
            if(e.keyCode==38){
                isDown=false;
            }
            if(e.keyCode==40){
                isDown=true;
            }
            callback.call(ele,isDown);
        }
    }
    window.addWheelEventListener=addWheelEventListener;
})();
