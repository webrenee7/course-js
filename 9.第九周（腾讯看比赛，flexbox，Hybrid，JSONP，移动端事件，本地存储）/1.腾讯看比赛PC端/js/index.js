/**
 * Created by Administrator on 2017/1/12.
 */
~(function (pro) {
    /*
     * '2016-1-12 17:23:3'==>2016年1月12日 '17时23分3秒'
     *                    ==>01-12 17:10'
     * */
    function myformatTime(template) {
        template=template||"{0}年{1}月{2}日{3}时{4}分{15}秒";
        var _this=this,
            ary=_this.match(/(\d+)/g);
        template.replace(/\{(\d+)\}/g,function () {
            var n=arguments[1],
                val=ary[n]||"00";
            val.length<2?val="0"+val:null;
            console.log(val);
            return val;
            // return (ary[arguments[1]]||"00").length<2?"0"+ary[arguments[1]]||"00":arguments[1];
        });
    }
    pro.myformatTime=myformatTime;
})(String.prototype);
console.log('2016-1-12 17:23:3'.myformatTime('{1}-{2}'));

//计算main区域高度(main的高度,menuNav高度)
~(function () {
    function fn() {
        var $header = $(".header"),
            $main = $(".main"),
            $menuNav = $main.children(".menuNav");
        var winH = $(window).height(),
            headerH = $header.outerHeight(),
            resultH = winH - headerH - 40;//->40是margin
        $main.height(resultH);
        $menuNav.height(resultH - 2);
    }

    fn();
    $(window).on("resize", fn);
})();

// main区域的操作（我们统一使用最简单的设计模式构建：单例模式->命令模式）
var menuRender = (function () {/*单例模式(基于惰性思想的高级单例模式)*/
    /*不销毁的私有作用域*/
    var $menuNav = $(".menuNav"),
        $link=$menuNav.find("a"),
        exampleIS=null;
    //completeScroll:实现区域的局部滚动
    function completeScroll() {
        exampleIS=new IScroll(".menuNav",{
            scrollbars:true,/*显示滚动条(自己来计算是哪个方向的)*/
            mouseWheel:true,/*开启鼠标滚轮的操控*/
            bounce:false,/*禁止到达边界的反弹效果，默认是true*/
            // useTransform:false/*开启transform滚动，默认就是开启的，false是禁止*/
            fadeScrollbars:true/*操作的时候再展示滚动条，不操作的时候隐藏滚动条*/
        });
    }
    //bindEvent:给所有的A绑定点击事件
    function bindEvent() {
        $link.on("click",function () {
            //点击的是谁，让其拥有选中样式，其余的移除选中样式
            //方式一：JQ筛选方法，链式写法
            // $(this).addClass("bg").parent().siblings().children("a").removeClass("bg");
            //方式二：遍历所有A
            var _this=this;
            $link.each(function (index,item) {
               //this-->item
                item==_this?$(item).addClass("bg"):$(item).removeClass("bg");
                //控制右侧日历展示不同的信息
            });
            calendarRender.init($(_this).attr("data-id"));
        });
    }
    //position：根据HASH定位到具体的某个位置
    function locationPosition() {
        var nowURL=window.location.href,
            hash=nowURL.substr(nowURL.lastIndexOf("#"));
        //在所有A中找到和对应HASH值相同的一项，如果找不到选中第一个A
        var $tar=$link.filter('[href="'+hash+'"]');
        $tar.length===0?$tar=$link.eq(0):null;
        $tar.addClass("bg");
        exampleIS.scrollToElement($tar[0],2000);
        //控制右侧日历展示不同的信息
        calendarRender.init($tar.attr("data-id"));
    }
    return {
        init: function () {
            /*
            * 1、实现局部滚动
            * 2、根据当前URL的HASH值定位到具体的A标签
            * 3、给所有的A标签绑定点击事件
            * */
            completeScroll();
            bindEvent();
            locationPosition();
        }
    }
})();

//calendar区域的操作
var calendarRender=(function () {
    var $calendarPlan=$.Callbacks();/*创建一个计划表，然后使用add和remove方法向计划表中增加方法和移除方法，使用fire方法通知这些方法执行*/
    var $calendar=$(".calendar"),
        $wrapper=$calendar.find(".wrapper"),
        $btn=$calendar.find(".btn");
        $link=null;
    var maxL=0,minL=0;
    //数据绑定
    $calendarPlan.add(function (today,data) {
        var str="";
        $.each(data,function (index,item) {
            //data-time：设置一个自定义属性存储代表的时间，以后点击这个A
            str+='<li><a href="javascript:;">';
            str+='<span class="week">'+item.weekday+'</span>';
            str+='<span class="date">'+item.date/*.myformatTime('{1}-{2}')*/+'</span>';
            str+='</a></li>';
        });
        $wrapper.html(str).css("width",data.length*110);
        //数据绑定完之后获取所有的a
        $link=$wrapper.find("a");
        minL=data.length-7*110;

    });
    //定位到今天日期的位置
    $calendarPlan.add(function (today,data,columnId) {
        /*
        * 1、首先在所有的A中筛选和今天日期相匹配的一项，但是不一定能获取到，例如今天日期没有比赛，那么在A中是没有今天日期的
        * 2、找到今天日期往后最靠近的那一项做展示（展示在七个中间）：循环所有的A标签，获取每一个A代表的日期，和今天的日期进行比较，直到遇到一个比今天日期大的
        * 3、上面操作完成，如果发现一个比today大的都没有，我们直接选中最后 一个A即可
        * 4、让当前选中的A在中间展示
        * */
        var $tar=$link.filter('[data-time="'+today+'"]');
        if($tar.length==0){
            var todayTime=today.replace(/-/g,"");
            $link.each(function (index,item) {
                var itemTime=$(item).attr("data-time");
                itemTime=itemTime.replace(/-/g,"");
                if(itemTime>todayTime){
                    $tar=$(item);
                    return false;
                }
            });
        }
        if($tar.length==0){
            $tar=$link.eq($link.length-1);
        }
        var index=$tar.parent().index(),
            curL=-index*110+330;
        curL=curL<minL?curL:(curL>maxL?maxL:curL);
        $tar.addClass("cur");
        $wrapper.css("left",curL);
        //控制match区域的数据
        var startIndex=Math.abs(curL)/100,
            endIndex=startIndex+6,
            startTime=$link.eq(startIndex).attr("data-time"),
            endTime=$link.eq(endIndex).attr("data-time");
        matchRender.init(columnId,startTime,endTime);
    });

    //左右切换
    $calendarPlan.add(function (today,data,columnId) {
        $btn.on("click",function () {
            var curL=parseFloat($wrapper.left());
            if(curL%110!==0){
                curL=Math.round(curL/110)*110;
            }
            $(this).hasClass("prev")?curL+=770:curL-=770;
            curL=curL<minL?curL:(curL>maxL?maxL:curL);
            $wrapper.stop().animate({left:curL},300,function () {
                var startIndex=Math.abs(curL)/110;
                $link.eq(startIndex).addClass("cur").parent().siblings().children("a").removeClass("a");
            });
            //控制match区域的数据
            matchRender.init();
        });
    });
    return {
        init:function (columnId) {
            /*
            * columnId:赛事类型ID，每一场不同的赛事有不同的唯一的ID，例如NBA->10000 CBA->100008...我们每一次获取数据都是把传递进来的ID发送给服务器，服务器返回给我们对应赛事的日历信息
            * 1、从腾讯服务器上获取数据(地址：http://matchweb.sports.qq.com/kbs/calendar?columnId=100000),解析成为我们需要的
            * 2、把数据绑定到页面中（数据绑定）
            * 3、定位到今天日期的位置
            * 4、实现左右切换
            * 5、给每一项绑定点击事件
            * */
            $.ajax({
                url:"http://matchweb.sports.qq.com/kbs/calendar?columnId="+columnId,
                type:"get",
                dataType:"jsonp",
                cache:false,
                success:function (result) {
                    if(result&&result.code==0){
                        result=result["data"];
                        var today=result["today"],
                            data=result["data"];
                        //数据获取成功后，通知计划表中的方法执行
                        $calendarPlan.fire(today,data);
                    }
                }
            });
        }
    }
})();
calendarRender.init();
menuRender.init();

/*match区域的操作*/
var matchRender=(function () {
    return {
        init:function (columnId,startTime,endTime) {
            
        }
    }
})();
