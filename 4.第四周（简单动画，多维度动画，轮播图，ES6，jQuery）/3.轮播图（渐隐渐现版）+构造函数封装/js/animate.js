/**
 * Created by Administrator on 2016/12/7.
 */
function animate(opt) {
    var time=0;
    var duration=opt.duration||1000;
    var begin={},change={};
    var target=opt.target;
    var ele=opt.ele;
    var callback=opt.callback;
    var zhufengEffect={
        Linear:function (t,b,c,d) {
            return b+t/d*c;
        }
    }
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
            var value=zhufengEffect.Linear(time,begin[key],change[key],duration);
            utils.css(ele,key,value);
        }
    },10);
}
//总结：
/*
* 1.准备t,b,c,d
* 2.根据target来给begin和change添加属性
* 3.清定时器（上一次）
* 4.启动定时器
*   time+=10
*   到达终点，要清定时器，重新设置位置，执行回调函数
*   for in
*   由于time增加重新计算位置
*   把计算好的位置设置生效
* */


/*
//如何把ele的参数换成this
//div1.animate()
//==>将animate添加到div1家族的原型上（Element），原型上才能这么用
(function () {
    //getCss,setCss  ==》这几个方法是服务于animate这个函数的，我们在不使用utils的时候，那么直接把函数定义在这个闭包里，并不用暴露在全局下
    function animate(opt) {

    }
    window.animate=animate;
})();*/
