/**
 * Created by Administrator on 2016/12/9.
 */
//1、获取元素
var banner=document.getElementById("banner");
var bannerInner=utils.getElesByClass("bannerInner",banner)[0];
var focusList=utils.getElesByClass("focusList",banner)[0];
var left=utils.children(banner,"a")[0];
var right=utils.children(banner,"a")[1];
var lis=document.getElementsByTagName("li");
var imgs=document.getElementsByTagName("img");
var oneWidth=utils.css(banner,"width");
var data=null;

//2、获取数据
(function getData() {
    var xhr=new XMLHttpRequest();
    xhr.open("get","data/data.txt?_="+new Date().getTime(),false);
    xhr.onreadystatechange=function () {
        if(xhr.readyState&&/^2\d{2}$/.test(xhr.status)){
            data=utils.jsonParse(xhr.responseText);
        }
    };
    xhr.send(null);
})();

//3、绑定数据到页面
(function bindData() {
    if(data&&data.length>0){
        var str="",strLi="";
        for(var i=0;i<data.length;i++){
            var curDataObj=data[i];
            str+="<div><img src='' tempSrc='"+curDataObj.src+"'/></div>";
            strLi+=i==0?"<li class='selected'></li>":"<li></li>";
        }
        str+="<div><img src='' tempSrc='"+data[0].src+"'/></div>";
        utils.css(bannerInner,"width",(data.length+1)*oneWidth);
        bannerInner.innerHTML=str;
        focusList.innerHTML=strLi;
    }
})();

//3、图片有效性验证
(function imgDelayLoad() {
    for(var i=0;i<imgs.length;i++){
        (function (i) {
            var curImg=imgs[i];
            if(curImg.isLoaded){
                return;
            }
            var tempImg=document.createElement("img");
            tempImg.src=curImg.getAttribute("tempSrc");
            tempImg.onload=function () {
                curImg.src=this.src;
                animate({ele:curImg,target:{opacity:1},duration:500});
            }
            curImg.isLoaded=true;
        })(i);
    }
})();

//4、轮播
var step=0;
var timer=window.setInterval(autoMove,2000);
function autoMove() {
    if(step==data.length){
        step=0;
        utils.css(bannerInner,"left",-step*oneWidth);
    }
    step++;
    animate({ele:bannerInner,target:{left:-step*oneWidth},duration:500});
    focusAlign();
}
//焦点对齐
function focusAlign() {
    var tempStep=step==data.length?0:step;
    for(var i=0;i<lis.length;i++){
        lis[i].className=i==tempStep?"selected":null;
    }
}
//鼠标悬停和离开
banner.onmouseover=function () {
    window.clearInterval(timer);
    left.style.display=right.style.display="block";
};
banner.onmouseout=function () {
    timer=window.setInterval(autoMove,2000);
    left.style.display = right.style.display = "none";
};

//左右按钮切换
left.onclick=function () {
    if(step==0){
        step=data.length;
        utils.css(bannerInner,"left",-step*oneWidth);
    }
    step--;
    animate({ele:bannerInner,target:{left:-step*oneWidth},duration:500});
    focusAlign();
}
right.onclick=autoMove;

//点击焦点切换
for(var i=0;i<lis.length;i++){
    lis[i].index=i;
    lis[i].onclick=function () {
        step=this.index;
        animate({ele:bannerInner,target:{left:-step*oneWidth},duration:500});
        focusAlign();
    }
}