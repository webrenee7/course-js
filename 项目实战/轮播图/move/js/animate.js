/**
 * Created by Administrator on 2016/12/9.
 */
function animate(opt){
    var time=0;
    var ele=opt.ele;
    var duration=opt.duration||1000;
    var target=opt.target;
    var callback=opt.callback;
    var begin={},change={};
    var effect={
        //匀速运动
        Linear:function (t,b,c,d) {
            return b+t/d*c;
        }
    };
    for(var key in target){
        begin[key]=utils.css(ele,key);
        change[key]=target[key]-begin[key];
    }
    window.clearInterval(ele.timer);
    ele.timer=window.setInterval(function () {
        if(time>=duration){
            window.clearInterval(ele.timer);
            utils.css(ele,target);
            if(typeof callback=="function"){
                callback.call(ele);
            }
            return;
        }
        time+=10;
        for(var key in change){
            var value=effect.Linear(time,begin[key],change[key],duration);
            utils.css(ele,key,value);
        }
    },10);
}