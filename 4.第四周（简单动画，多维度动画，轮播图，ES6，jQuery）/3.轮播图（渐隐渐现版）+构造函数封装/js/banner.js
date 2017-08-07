/**
 * Created by Administrator on 2016/12/8.
 */
//1、获取元素
var banner=document.getElementById("banner");
var bannerInner=utils.getElesByClass("bannerInner",banner)[0];
var divList=bannerInner.getElementsByTagName("div");
var focusList=utils.getElesByClass("focusList",banner)[0];
var left=utils.getElesByClass("left",banner)[0];
var right=utils.getElesByClass("right",banner)[0];
var lis=document.getElementsByTagName("li");
var imgs=document.getElementsByTagName("img");
var data=null;

//2、获取数据
(function getData() {
    var xhr=new XMLHttpRequest();
    xhr.open("get","data/data.txt?_="+new Date().getTime(),false);
    xhr.onreadystatechange=function () {
        if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
            data=utils.jsonParse(xhr.responseText);
        }
    };
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
        (function (i) {
            var curImg=imgs[i];
            if(curImg.isLoaded){
                return;
            }
            var tempImg=document.createElement("img");
            tempImg.src=curImg.getAttribute("tempSrc");
            tempImg.onload=function () {
                curImg.src=this.src;
                if(i==0){
                    var curDiv=curImg.parentNode;
                    curDiv.style.zIndex=1;
                    animate({ele:curDiv,target:{opacity:1},duration:500});
                }
            }
            curImg.isLoaded=true;
        })(i);
    }
})();

//5、轮播
var step=0;//记录当前图片的索引值
var timer=window.setInterval(autoMove,2000);
function autoMove() {
    if(step==data.length-1){
        step=-1;
    }
    step++;
    setBanner();
}
//1>.负责循环所有的图片，然后比对哪一张图片的索引值和step的值相等，索引和step相等的那一张图片的zIndex的值提高，除了这一张的其他图片的zIndex设置成初始状态0
//2>.设置图片的zIndex之后，虽然层级提高，但是还需要把它的透明度从0变化到1，并且透明度变化到1之后，把其他图片的透明度立即设置成0
function setBanner() {
    for(var i=0;i<imgs.length;i++){
        if(i===step){
            utils.css(imgs[i].parentNode,"zIndex",1);
            animate({ele:imgs[i].parentNode,target:{opacity:1},duration:500,callback:function () {
                var otherDivs=utils.siblings(this);
                for(var i=0;i<otherDivs.length;i++){
                    utils.css(otherDivs[i],"opacity",0);
                }
                isOkClick=true;/*必须要写在这里*/
            }});
        }else{
            utils.css(imgs[i].parentNode,"zIndex",0);
        }
    }
    //焦点对齐
    for(var i=0;i<lis.length;i++){
        lis[i].className=i===step?"selected":"";
    }
}
//鼠标悬停和离开
banner.onmouseover=function () {
    window.clearInterval(timer);
    left.style.display=right.style.display="block";
};
banner.onmouseout=function () {
    timer=window.setInterval(autoMove,1000);
    left.style.display=right.style.display="none";
};


//左右按钮切换
//**************如何处理连续点击出现的图片闪动现象：
// 在点击之前设置一个标志，为了防止用户多次点击出现图片闪动，闪动是因为一个定时器没有执行完又开启了另个一个定时器导致
var isOkClick=true;
right.onclick=function(){
    if(isOkClick){
        autoMove();/*如果autoMove没有执行完，isOkClick就是false，那么就不能进入这个条件，不能继续执行autoMove*/
        isOkClick=false;
    }
};
left.onclick=function () {
    /*if(step==0){
        step=data.length;
    }
    step--;*/
    if(isOkClick){
        step--;
        if(step==-1){
            step=data.length-1;
        }
        setBanner();
        isOkClick=false;
    }
};
//焦点点击
for(var i=0;i<lis.length;i++){
    lis[i].index=i;
    lis[i].onclick=function () {
        step=this.index;
        setBanner();
    }
}