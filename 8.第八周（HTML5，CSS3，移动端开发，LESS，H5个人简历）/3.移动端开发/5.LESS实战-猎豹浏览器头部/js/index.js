/**
 * Created by Administrator on 2017/1/7.
 */
$(function () {
    $(".slide1").css("opacity","1");
    $(".slide1").addClass("active");
    var step=0,
        isClickOk=true,
        timer=window.setInterval(autoMove,4000);
    function autoMove() {
        step++;
        if(step==2){
            step=0;
        }
        setBanner();
    }
    function setBanner() {
        $(".slide").each(function (index,item) {
            $(this).hide();
            $(item).removeClass("active");
            $(item).css({"zIndex":0,"opacity":0.5});
            if(step==index){
                $(this).show();
                $(this).animate({"opacity":1,"zIndex":1},600,function () {
                    $(this).addClass("active");
                    isClickOk=true;
                });
            }
        });
        //焦点对齐
        $(".focus_list li").each(function (index,item) {
            $(item).removeClass("cur");
            if(step==index){
                $(this).addClass("cur");
            }
        });
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
                step=1;
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
    $(".focus_list li").each(function (index,item) {
        $(this).click(function () {
            step=index;
            setBanner();
        });
    });
});
