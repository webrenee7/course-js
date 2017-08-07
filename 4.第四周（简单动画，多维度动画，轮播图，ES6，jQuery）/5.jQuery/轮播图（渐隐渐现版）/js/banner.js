/**
 * Created by xuya on 2016/12/11.
 */
//1、获取元素
var $banner=$("#banner");
var $bannerInner=$banner.children(".bannerInner");
var $focusList=$banner.find(".focusList");
var $left=$banner.find("a:first");
var $right=$banner.find("a:last");
//以上都是存在的
var $imgs=null;
var $lis=null;

//2、获取数据
;(function getData() {
    $.ajax({
        type:"get",
        url:"data/data.txt",
        dataType:"json",
        // data:{},
        async:false,
        // cache:true,
        success:function (data) {
            window.data=data;
        }
    });
})();

//3、绑定数据
;(function bindData() {
    if(data&&data.length>0){
        var str="",strLi="";
        $.each(data,function (index,item) {
            //index:0,1,2,3
            //item:{"src":"images/1.jpg"}....
            str+="<div><img src='' tempSrc='"+item.src+"'/></div>";
            strLi+=index==0?"<li class='selected'></li>":"<li></li>";
        });
        $bannerInner.html(str);
        $focusList.html(strLi);
    }
})();

//4、图片有效性验证
$imgs=$bannerInner.find("img");
$lis=$focusList.find("li");
// console.log($imgs.length);//0===>dom对象有映射关系，jquery对象没有映射关系
//对于使用jquery，获取不存在的dom结构，需要在dom结构发生改变的时候重新获取
;(function imgDelayLoad() {
    $imgs.each(function (index,item) {
        // var tempImg=document.createElement("img");
        //要使用jquery方法得转为jquery对象  $(tempImg)
        //index:0,1,2,3
        //item:{"src":"images/1.jpg"}....
        var $tempImg=$("<img>");
        //each方法中的item和this是同一个
        $tempImg.prop("src",$(this).attr("tempSrc")).on("load",function () {
            $(item).prop("src",$(this).prop("src"));
            index==0?$(item).parent().css("zIndex",1).stop().animate({opacity:1},500):null;
        });
    });
})();

//5、轮播图
var step=0;//用来记录哪张图片应该显示
function autoMove() {
    step++;
    if(step==data.length){
        step=0;
    }
    setBanner();
}
var timer=window.setInterval(autoMove,2000);
function setBanner() {
    $imgs.each(function (index,item) {
        //step和索引值相等的那一张出现
        if(step==index){//让当前显示的zIndex=1，透明度由0-1，其他的透明度立刻变为0
            $(item).parent().css("zIndex",1).animate({opacity:1},500,function () {
                //运动结束后，其他div透明度由1立即变为0
                //回调函数中的this就是当前运动的那个元素
                $(this).siblings().css("opacity",0);/*其实有好几个div，jquery会默认遍历*/
            })
        }else{
            $(item).parent().css("zIndex",0);//其他的zIndex=0
        }
        /*step==index?$(item).parent().css("zIndex",1).animate({opacity:1},500,function () {
            $(this).siblings().css("opacity",0);
        }):$(item).parent().css("zIndex",0);*/
        $lis.each(function (index,item) {
            //之前：索引值和step相等的，className赋值为selected，否则赋为空
            //索引值和step相等的，添加selected样式，不相等的移除selected
            index==step?$(item).addClass("selected"):$(item).removeClass("selected");
        })
    })
}
$banner.on("mouseover",function () {
   $left.css("display","block");
   $right.show();
    window.clearInterval(timer);
}).on("mouseout",function () {
    $left.css("display","none");
    $right.hide();
    timer=window.setInterval(autoMove,2000);
});
$left.on("click",function () {
    step--;
    if(step==-1){
        step=data.length-1;
    }
    setBanner();
});
$right.on("click",autoMove);
$lis.each(function (index,item) {
    item.index=index;//给每个li设置index    自定义属性，相当于之前的lis[i].index=i
    $(this).on("click",function () {
        step=this.index;//点击焦点的时候，修改step的值为当前焦点的索引值
        setBanner();//根据刚刚点击的设置的step值设置当前显示的图片
    })
});


