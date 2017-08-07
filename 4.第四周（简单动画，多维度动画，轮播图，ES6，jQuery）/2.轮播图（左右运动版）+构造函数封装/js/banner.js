/**
 * Created by Administrator on 2016/12/7.
 */
//1、获取元素
var banner=document.getElementById("banner");
var bannerInner=utils.getElesByClass("bannerInner",banner)[0];
var focusList=utils.getElesByClass("focusList",banner)[0];
var left=utils.getElesByClass("left",banner)[0];
var right=utils.getElesByClass("right",banner)[0];
var imgs=document.getElementsByTagName("img");
var lis=focusList.getElementsByTagName("li");
var data=null;

//2、获取数据
;(function getData() {
    var xhr=new XMLHttpRequest();
    xhr.open("get","data/data.txt?_="+new Date().getTime(),false);
    xhr.onreadystatechange=function () {
        if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
            data=utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();

//3、绑定数据到页面
;(function bindData() {
    var str="",strLi="";
    if(data&&data.length>0){
        for(var i=0;i<data.length;i++){
            var curDataObj=data[i];
            str+="<div><img src='' tempSrc='"+curDataObj.src+"'/></div>";
            strLi+=i==0?"<li class='selected'></li>":"<li></li>";
        }
        //为了保证图片是无缝滚动
        str+="<div><img src='' tempSrc='"+data[0].src+"'/>";
    }
    bannerInner.innerHTML=str;
    focusList.innerHTML=strLi;
    //保证bannerInner的宽度足够排列这些图片
    utils.css(bannerInner,"width",(data.length+1)*500);
})();

//4、验证图片有效性
/*//自定义属性方式
(function imgsDelayLoad() {
    for(var i=0;i<imgs.length;i++){//for循环是同步编程
        var curImg=imgs[i];
        if(curImg.isLoaded){
            continue;
        }
        var tempImg=document.createElement("img");
        tempImg.src=curImg.getAttribute("tempSrc");
        tempImg.index=i;
        tempImg.onload=function () {//事件绑定是异步编程
            imgs[this.index].src=this.src;
        }
        curImg.isLoaded=true;
        animate({
            ele:curImg,
            target:{opacity:1}
        });
    }
})();*/
//闭包方式
(function imgsDelayLoad() {
    for(var i=0;i<imgs.length;i++){//for循环是同步编程     循环里面嵌套事件，需要使用自定义属性或者闭包的方式处理i的问题
        (function (i) {
            var curImg=imgs[i];
            if(curImg.isLoaded){
                return;
            }
            var tempImg=document.createElement("img");
            tempImg.src=curImg.getAttribute("tempSrc");
            tempImg.onload=function () {//事件绑定是异步编程
                curImg.src=this.src;
            }
            curImg.isLoaded=true;
            animate({
                ele:curImg,
                target:{opacity:1}
            });
        })(i);
    }
})();

//5、自动轮播
/*(function () {
    var step=0;
    function autoMove() {
        animate({ele:bannerInner,target:{left:-step*500},duration:500});
        var timer=window.setTimeout(function () {
            autoMove();
        },2000);
        step++;
        if(step>=5){
            utils.css(bannerInner,"left",2000);
            step=1;
        }
    }
    autoMove();
})();*/

var step=0;
function autoMove() {
    if(step==data.length){
        step=0;
        utils.css(bannerInner,"left",-step*500);
    }
    step++;
    animate({ele:bannerInner,target:{left:-step*500},duration:500});
    focusAlign();
}
var timer=window.setInterval(function () {
    autoMove();
},2000);

//6、焦点对齐
function focusAlign() {
    //如果step==4，li，没有4这个索引，li只能等于0
    var tempstep=step==data.length?0:step;
    for(var i=0;i<lis.length;i++){
        lis[i].className=i==tempstep?"selected":null;
    }
}

//7、鼠标经过和离开
//鼠标悬停，停止定时器，左右按钮出现
banner.onmouseover=function () {
    clearInterval(timer);
    left.style.display=right.style.display="block";
}
//鼠标离开后，继续启动定时器，左右按钮消失
banner.onmouseout=function () {
    timer=window.setInterval(function () {
        autoMove();
    },2000);
    left.style.display=right.style.display="none";
}

//8、点击左右按钮
left.onclick=function () {
    if(step==0){
        step=data.length;
        utils.css(bannerInner,"left",-step*500);
    }
    step--;
    animate({ele:bannerInner,target:{left:-step*500},duration:500});
    focusAlign();
}
//点击右按钮和自动轮播是同一个效果
right.onclick=autoMove;

//9、点击焦点轮播
for(var i=0;i<lis.length;i++){
    lis[i].index=i;
    lis[i].onclick=function () {
        step=this.index;
        animate({ele:bannerInner,target:{left:-step*500},duration:500});
        focusAlign();
    }
}
