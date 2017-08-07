function win(attr, val) {
    if (typeof val !== 'undefined') {
        document.documentElement[attr] = val;
        document.body[attr] = val;
    }
    return document.documentElement[attr] || document.body[attr];
}

function goTop(config){
    config.speed= config.speed||120;
    config.rate=config.rate||8;
    config.decelerate=config.decelerate||false;
    config.dis=config.dis||win("clientHeight");
    config.container.onclick = function () {
        config.container.timer && clearInterval(config.container.timer);
        config.container.timer = setInterval(function () {
            var cur = win("scrollTop");
            if(config.decelerate){
                cur-=cur/config.rate;//减速运动
            }else{
                cur-=config.speed;
            }
            if (cur <= 0) {
                clearInterval(config.container.timer);
                window.onscroll = fn;
                return;
            }
            win("scrollTop", cur);
        },20);
        config.container.style.display = "none";
        window.onscroll = null;
        window.onmousewheel=function(){
            clearInterval(config.container.timer);
            window.onscroll = fn;
        }
    };
    window.onscroll = fn;
    function fn() {
        var scrollHeight = win("scrollTop");
        if (scrollHeight>config.dis ) {
            config.container.style.display = "block";
        }else{
            config.container.style.display = "none";
        }
    }
}
