/**
 * Created by Administrator on 2016/12/9.
 */
//1、获取元素
var banner=document.getElementById("banner");
var bannerInner=utils.getElesByClass("bannerInner",banner)[0];
var focusList=utils.getElesByClass("focusList",banner)[0];
var left=utils.children(banner,"a")[0];
var right=utils.children(banner,"a")[1];
var lis=banner.getElementsByTagName("li");
var imgs=banner.getElementsByTagName("img");
var data=null;
var isClickOk=true;

//2、获取数据
(function getData() {
    var xhr=new XMLHttpRequest();
    xhr.open("get","data/data.txt?_="+new Date().getTime(),false);
    xhr.onreadystatechange=function () {
        if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
            data=utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();

//3、绑定数据
(function bindData() {
    if(data&&data.length>0){
        var str="",strLi="";
        for(var i=0;i<data.length;i++){
            var curDataObj=data[i];
            str+="<div><img src='' tempSrc='"+curDataObj.src+"'/></div>";
            strLi+=i==0?"<li class='selected'></li>":"<li></li>";
        }
        bannerInner.innerHTML=str;
        focusList.innerHTML=strLi;
    }
})();

//4、图片有效性验证
(function imgDelayLoad() {
    for(var i=0;i<imgs.length;i++){
        var curImg=imgs[i];
        if(curImg.isLoaded){
            continue;
        }
        var tempImg=new Image();
        tempImg.src=curImg.getAttribute("tempSrc");
        tempImg.index=i;
        tempImg.onload=function () {
            imgs[this.index].src=this.src;
        };
        if(i==0){
            utils.css(curImg.parentNode,"zIndex",1);
            animate({ele:curImg.parentNode,target:{"opacity":1},duration:500});
        }
        curImg.isLoaded=true;
    }
})();

//5、轮播
var step=0;
var timer=window.setInterval(autoMove,2000);
function autoMove() {
    step++;
    if(step==data.length){
        step=0;
    }
    setBanner();
}
function setBanner() {
    for(var i=0;i<imgs.length;i++){
        var curImg=imgs[i];
        if(i==step){
            utils.css(curImg.parentNode,"zIndex",1);
            animate({ele:curImg.parentNode,target:{opacity:1},duration:500,callback:function () {
                var otherDivs=utils.siblings(this);
                for(var j=0;j<otherDivs.length;j++){
                    utils.css(otherDivs[j],"opacity",0);
                }
                isClickOk=true;
            }});
        }else{
            utils.css(curImg.parentNode,"zIndex",0);
        }
    }
    //焦点对齐
    for(var i=0;i<lis.length;i++){
        lis[i].className=i==step?"selected":"";
    }
}
//鼠标悬停和离开
banner.onmouseover=function () {
    window.clearInterval(timer);
    utils.css(left,"display","block");
    utils.css(right,"display","block");
};
banner.onmouseout=function () {
    timer=window.setInterval(autoMove,2000);
    utils.css(left,"display","none");
    utils.css(right,"display","none");
};
//左右按钮点击切换
right.onclick=function () {
    if(isClickOk){
        autoMove();
        isClickOk=false;
    }
};
left.onclick=function () {
    if(isClickOk){
        step--;
        if(step==-1){
            step=data.length-1;
        }
        setBanner();
        isClickOk=false;
    }
};
//点击焦点切换
for(var i=0;i<lis.length;i++){
    lis[i].index=i;
    lis[i].onclick=function () {
        step=this.index;
        setBanner();
    }
}