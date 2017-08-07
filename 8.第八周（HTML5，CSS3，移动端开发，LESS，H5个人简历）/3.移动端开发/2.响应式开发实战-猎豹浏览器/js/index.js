/**
 * Created by Administrator on 2017/1/7.
 */
$(function () {
    var $slide=$(".slide"),
        $focus=$(".focus_list li"),
        step=0,/*当前显示的banner的索引*/
        isClickOk=true,/*是否点击过，用来限制用户连续操作行为*/
        hasClass=$("slide").hasClass("active"),/*当前slide是否已经有active属性*/
        timer=window.setInterval(autoMove,4000);
    $slide.eq(0).addClass("active");/*初始化slide*/
    function autoMove() {
        step++;
        if(step==$(".slide").length){
            step=0;
        }
        setBanner();
    }
    function setBanner() {
        $slide.hide().css({ opacity: 0.5,zIndex: 0});
        $slide.eq(step).show().stop().animate({opacity:1,zIndex:1},700,function () {
            isClickOk=true;
        });
        if(!hasClass){
            $slide.removeClass('active');
            $slide.eq(step).addClass('active');
        }
        //焦点对齐
        $focus.removeClass("cur").eq(step).addClass("cur");
    }
    //点击左按钮切换上一张
    $(".next").on("click",function () {
        if(isClickOk){
            autoMove();
            isClickOk=false;
        }
    });
    //点击右按钮切换下一张
    $(".prev").on("click",function () {
        if(isClickOk){
            step--;
            if(step==-1){
                step=$(".slide").length-1;
            }
            setBanner();
            isClickOk=false;
        }
    });
    //鼠标悬停在banner和离开时候
    $(".banner").on({
        "mouseover":function () {
            window.clearInterval(timer);
        },
        "mouseout":function () {
            timer=window.setInterval(autoMove,4000);
        }
    });
    //点击每个li切换
    $focus.click(function () {
        step=$(this).index();
        setBanner();
    });
});
