~function (pro) {
    function myFormatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var _this = this,
            ary = _this.match(/\d+/g);
        template = template.replace(/\{(\d)\}/g, function () {
            return (ary[arguments[1]] || '00').length < 2 ? '0' + ary[arguments[1]] : ary[arguments[1]];
        });
        return template;
    }

    pro.myFormatTime = myFormatTime;
}(String.prototype);

/*
* 头部menu区域的相关操作
*   -点击menu按钮控制nav的显示隐藏
*
* */
var menuRender=(function () {
    var $menu=$("#menu"),
        $nav=$("#nav");

    return {
        init:function () {
            //zepto没有slidedown,slideup...方法
            $menu.tap(function () {
                if($nav.attr("isBlock")==="true"){//通过attr获取的都是字符串
                    //当前是展开的，我们让nav收起
                    $nav.css({
                        padding:0,
                        height:0
                    }).attr("isBlock",false);
                    return;
                }
                //->控制nav展示：改变高度和padding值即可（动画使用transition）
                $nav.css({
                    padding:".1rem 0",
                    height:"2.22rem"
                }).attr("isBlock",true);
            });
        }
    }
})();
menuRender.init();

/*
* match区域的相关操作
*   -通过jsonp从服务器端获取数据（http://matchweb.sports.qq.com/html/matchDetail?mid=8:855375）
* */
var matchRender=(function () {
    var $matchPlan=$.Callbacks(),
        $match=$("#match");
    var $progress=null,
        $supportLeft=null,
        $supportRight=null,
        isTap=false;
    //实现数据绑定
    $matchPlan.add(function (matchInfo) {
        var $matchTemplate=$("#matchTemplate"),
            templete=$matchTemplate.html();
        var res=ejs.render(templete,{
            matchInfo/*模板里假设的数据*/:matchInfo/*传递过来的数据*/
        });
        $match.html(res);

        $progress=$("#progress");
        $supportLeft=$("#supportLeft");
        $supportRight=$("#supportRight");
    });
    //计算支持数的比例
    $matchPlan.add(computed);
    function computed(matchInfo) {
        var n=parseFloat($supportLeft.html()),
            m=parseFloat($supportRight.html());
        $progress.css("width",n/(n+m)*100+'%');
    }
    //支持处理
    $matchPlan.add(function () {
        //验证本地是否有存储的信息，有的话就不能再支持了
        var support=localStorage.getItem("support");
        if(support){
            support=JSON.parse(support);
            support.type==1?$supportLeft.addClass("bg"):$supportRight.addClass("bg");
            return;
        }
        //相当于给$supportLeft和$supportRight分别绑定点击事件
        $supportLeft.add($supportRight).tap(function () {
            if(isTap) return;
            var type=$(this).hasClass("left")?1:2,
                _this=this;
            $.ajax({
                url:"http://matchweb.sports.qq.com/kbs/teamSupport?mid=8:3A855375&type="+type,
                type:"get",
                dataType:"jsonp",
                success:function (result) {
                    console.log(result);
                    if(result&&result.code==0){
                        console.log(1);
                        //->支持成功
                        $(_this).addClass("bg").html($(_this).html()*1+1);
                        isTap=true;
                        computed();
                        //本地存储
                        localStorage.setItem("support",JSON.stringify({
                            isTap:true,
                            type:type
                        }));
                    }
                }
            });
        });
    });
    return {
        init:function () {
            $.ajax({
                url:"http://matchweb.sports.qq.com/html/matchDetail?mid=8:855375",
                type:"get",
                dataType:"jsonp",
                success:function (result) {
                    //真实项目中我们从服务器端获取的数据并不一定是我们想要的格式，我们还需要自己进行进一步加工处理，把其变为自己所需要的===》“数据格式化/数据解析”
                    if(result&&result[0]==0){
                        result=result[1];
                        var matchInfo=result["matchInfo"];
                        matchInfo.leftSupport=result["leftSupport"];
                        matchInfo.rightSupport=result["rightSupport"];
                        //通知计划中的方法执行，而且把获取的数据传递给每一个方法
                        $matchPlan.fire(matchInfo);
                    }
                }
            });
        }
    }
})();
matchRender.init();

/*
* 视频集锦区域的处理
* */
var playRender=(function () {
    var $playPlan=$.Callbacks(),
        $player=$("#player"),
        $wrapper=$player.find(".wrapper");
    //数据绑定
    $playPlan.add(function (playList) {
        var template=$("#playTemplate").html(),
            res=ejs.render(template,{
                playList:playList
            });
        $wrapper.html(res).css("width",playList.length*2.4+0.3+"rem");
    });
    //实现局部滚动
    $playPlan.add(function () {
       new IScroll("#player",{
           scrollX:true,/*变为横向滚动，默认是竖向滚动*/
           scrollY:false
       })
    });
    return {
        init:function () {
            $.ajax({
                url:"http://matchweb.sports.qq.com/html/matchStatV37?mid=8:855375",
                type:"get",
                dataType:"jsonp",
                success:function (result) {
                    if(result&&result[0]==0){
                        result=result[1];
                        result=result["stats"];
                        var playList=null;
                        $.each(result,function (index,item) {
                            if(item.type==9){
                                playList=item.list;
                                return false;
                            }
                        });
                        $playPlan.fire(playList);
                    }
                }
            });
        }
    }
})();
playRender.init();