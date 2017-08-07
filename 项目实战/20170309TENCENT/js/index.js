/*--MAIN RENDER--*/
let mainRender = (()=> {
    let $header = $('.header'),
        $main = $('.main'),
        $menu = $main.find('.menu'),
        $calendar = $main.find('.calendar'),
        $match = $main.find('.match');

    let computedHeight = ()=> {
        let winH = $(window).height(),//->获取一屏幕高度(JQ语法)
            headerH = $header.outerHeight(),//->JQ:outerHeight <=> JS:offsetHeight  JQ:innerHeight <=> JS:clientHeight
            calendarH = $calendar.outerHeight();

        let mainH = winH - headerH - 40;
        $main.height(mainH);//->$main.css('height',mainH)
        $menu.height(mainH - 2);
        $match.height(mainH - calendarH - 20);
    };

    return {
        init(){
            computedHeight();
            $(window).on('resize', computedHeight);//->当浏览器的窗口大小发生改变的时候,把所有的高度计算重新执行,让高度随着浏览器的高度一起改变即可
        }
    }
})();
mainRender.init();