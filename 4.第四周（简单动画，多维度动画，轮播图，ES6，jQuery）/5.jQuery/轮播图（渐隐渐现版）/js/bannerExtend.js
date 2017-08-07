/**
 * Created by Administrator on 2016/12/12.
 */
(function () {
    function bannerFadeIn(/*$banner,*/url,interval){
        interval=interval||2000;
        //1、获取元素
        var $bannerInner=/*$banner*/this.children(".bannerInner");
        var $focusList=/*$banner*/this.children(".focusList");
        var $left=/*$banner*/this.find(".left");
        var $right=/*$banner*/this.find(".right");
        var $imgs=null;
        var $lis=null;
        //2、获取数据
        $.ajax({
            type:"get",
            url:"data/data.txt",
            dataType:"json",
            async:false,
            success:function (data) {
                window.data=data;
            }
        });
        //3、绑定数据
        (function bindData() {
            if(data&&data.length>0){
                var str="",strLi="";
                $.each(data,function (index,item) {
                    str+="<div><img src='' tempSrc='"+item.src+"'/></div>";
                    strLi+=index==0?"<li class='selected'></li>":"<li></li>";
                });
                $bannerInner.html(str);
                $focusList.html(strLi);
            }
        })();
        //4、验证图片有效性
        $imgs=$bannerInner.find("img");
        $lis=$focusList.find("li");
        (function imgDelayLoad() {
            $imgs.each(function (index,item) {
                $tempImg=$("<img>");
                $tempImg.prop("src",$(this).attr("tempSrc")).on("load",function () {
                    $(item).prop("src",$(this).prop("src"));
                    if(index==0){
                        $(item).parent().css("zIndex",1);
                        $(item).parent().animate({opacity:1},500);
                    }
                });
            });
        })();
        //5、图片轮播
        var step=0;
        var timer=window.setInterval(autoMove,interval);
        function autoMove() {
            step++;
            if(step==data.length){
                step=0;
            }
            setBanner();
        }
        function setBanner() {
            $imgs.each(function (index,item) {
                if(index==step){
                    $(this).parent().css("zIndex",1);
                    var otherDivs=$(this).parent().siblings();
                    $(otherDivs).animate({opacity:1},500);
                }else{
                    $(this).parent().css("zIndex",0);
                }
            });
            //焦点对齐
            $lis.each(function (index,item) {
                index==step?$(this).addClass("selected"):$(this).removeClass("selected");
            })
        }
        //鼠标悬停和离开
        /*$banner*/this.on({
            "mouseover":function () {
                window.clearInterval(timer);
                $left.stop().fadeIn();
                $right.stop().fadeIn();
            },
            "mouseout":function () {
                timer=window.setInterval(autoMove,interval);
                $left.stop().fadeOut();
                $right.stop().fadeOut();
            }
        });
        //左右按钮切换
        $left.on("click",function () {
            step--;
            if(step==-1){
                step=data.length-1;
            }
            setBanner();
        });
        $right.on("click",autoMove);
        //点击焦点切换
        $lis.each(function (index,item) {
            item.index = index;
            $(item).on("click", function () {
                step = this.index;
                setBanner();
            })
        });
    }
    //将bannerFadeIn方法添加到$类上
    $.extend({
        bannerFadeIn:bannerFadeIn
    });
    //将bannerFadeIn方法添加到$的原型上
    $.fn.extend({
        bannerFadeIn:bannerFadeIn
    });
})();


