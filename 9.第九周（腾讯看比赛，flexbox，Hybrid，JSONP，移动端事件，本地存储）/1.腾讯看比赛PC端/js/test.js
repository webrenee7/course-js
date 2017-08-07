/**
 * Created by Administrator on 2017/1/14.
 */
//格式化时间
(function (pro) {
    function myFormatTime(templete) {
        templete=templete||"{0}年{1}月{2}日{3}时{4}分{5}秒",
            ary=this.match(/(\d+)/g);//["2017", "1", "12", "17", "10", "3"]
        templete=templete.replace(/\{(\d+)\}/g,function () {
            /*var n=arguments[1],
                val=ary[n]||"00";
            val.length<2?val="0"+val:null;
            return val;*/
            return (ary[arguments[1]] || '00').length < 2 ? '0' + ary[arguments[1]] : ary[arguments[1]];
        });
        return templete;
    }
    pro.myFormatTime=myFormatTime;
})(String.prototype);

//1、main区域高度的计算(main高度的计算，menuNav高度的计算)
~(function () {
    function fn() {
        var $header=$(".header"),
            $main=$(".main"),
            $menuNav=$main.children(".menuNav");
        var winH=$(window).height(),
            headerH=$header.height(),
            resultH=winH-headerH-40;
        $main.height(resultH);
        $menuNav.height(resultH-2);
    }
    fn();
    $(window).on("resize",fn);
})();

//2、menuNav区域的操作
var menuRender=(function () {
    var $menuNav=$(".menuNav"),
        $link=$menuNav.find("a"),
        exampleIS=null;
    //1>.实现局部区域的滚动（利用iscroll插件）
    function completeScroll() {
        exampleIS=new IScroll(".menuNav",{
            scrollbars:true,/*是否有滚动条*/
            mouseWheel:true,/*开启鼠标滚轮的控制*/
            bounce:false,/*禁止到达边界的反弹效果*/
            fadeScrollbars:true/*操作的时候再显示滚动条，不操作的时候隐藏滚动条*/
        });
    }
    //2>.根据HASH值定位到具体的位置
    function locationPosition() {
        var nowURL=window.location.href,
            hash=nowURL.substr(nowURL.indexOf("#"));
        var $tar=$link.filter('[href="'+hash+'"]');
        $tar.length==0?$tar=$link.eq(0):null;
        $tar.addClass("bg");
        exampleIS.scrollToElement($tar[0],300);
        //日期区域显示
        calendarRender.init($tar.attr("data-id"));
    }
    //3>.给所有a绑定点击事件
    function bindEvent() {
        $link.on("click",function () {
            var _this=this;
            $link.each(function (index,item) {
               item==_this?$(item).addClass("bg"):$(item).removeClass("bg");
            });
            //日期区域显示
            calendarRender.init($(this).attr("data-id"));
        });
    }
    return {
        init:function () {
            completeScroll();
            locationPosition();
            bindEvent();
        }
    }
})();

//3、calendar区域的操作(使用发布订阅模式)
var calendarRender=(function () {
    var $calendarPlan=$.Callbacks();
    var $calendar = $('.calendar'),
        $wrapper = $calendar.find('.wrapper'),
        $btn = $calendar.find('.btn'),
        $link = null;
    var maxL = 0, minL = 0;
    //数据绑定
    $calendarPlan.add(function (today,data,columnId) {
        var str="";
        $.each(data,function (index,item) {
            str+='<li><a href="javascript:;" data-time="'+item.date+'">';
            str+='<span class="week">'+item.weekday+'</span>';
            str+='<span class="date">'+item.date.myFormatTime('{1}-{2}')+'</span>';
            str+='</a></li>';
        });
        $wrapper.html(str).css("width",data.length*110);
        //数据绑定完成后获取所有的a
        $link = $wrapper.find('a');
        minL = -(data.length - 7) * 110;
    });
    //定位到今天的日期
    $calendarPlan.add(function (today,data,columnId) {
        var $tar = $link.filter('[data-time="' + today + '"]');
        if ($tar.length === 0) {
            var todayTime = today.replace(/-/g, '');
            $link.each(function (index, item) {
                var itemTime = $(item).attr('data-time');
                itemTime = itemTime.replace(/-/g, '');
                if (itemTime > todayTime) {
                    $tar = $(item);
                    return false;
                }
            });
        }
        if ($tar.length === 0) {
            $tar = $link.eq($link.length - 1);
        }
        var index = $tar.parent().index(),
            curL = -index * 110 + 330;
        curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
        $tar.addClass('bg');
        $wrapper.css('left', curL);
        //->控制MATCH区域的数据
        var starIndex = Math.abs(curL) / 110,
            endIndex = starIndex + 6,
            startTime = $link.eq(starIndex).attr('data-time'),
            endTime = $link.eq(endIndex).attr('data-time');
        matchRender.init(columnId, startTime, endTime);
    });
    //实现左右切换
    $calendarPlan.add(function (today,data,columnId) {
        $btn.on('click', function () {
            var curL = parseFloat($wrapper.css('left'));
            if (curL % 110 !== 0) {
                curL = Math.round(curL / 110) * 110;
            }
            $(this).hasClass('prev') ? curL += 770 : curL -= 770;
            curL = curL > maxL ? maxL : (curL < minL ? minL : curL);

            $wrapper.stop().animate({left: curL}, 300, function () {
                var starIndex = Math.abs(curL) / 110;
                $link.eq(starIndex).addClass('bg').parent().siblings().children('a').removeClass('bg');

                //->控制MATCH区域的数据
                matchRender.init(columnId);
            });
        });
    });
    return {
        init:function (columnId) {
            //1>.从腾讯服务器获取数据
            //2>.数据绑定
            //3>.定位到今天的日期
            //4>.实现左右切换
            //5>.给每一项绑定点击操作
            $.ajax({
                url:'http://matchweb.sports.qq.com/kbs/calendar?columnId=' + columnId,
                type:"get",
                dataType:"jsonp",
                cache:false,
                success:function (result) {
                    if(result&&result.code==0){
                        result=result["data"];
                        var today=result["today"],
                            data=result["data"];
                        $calendarPlan.fire(today,data,columnId);
                    }
                }
            });
        }
    }
})();

//4、match区域的操作
var matchRender = (function () {
    return {
        init: function (columnId, startTime, endTime) {
            //->http://matchweb.sports.qq.com/kbs/list?columnId=100000&startTime=2017-01-09&endTime=2017-01-15
        }
    }
})();

menuRender.init();