/**
 * Created by Administrator on 2016/12/5.
 */
//1、获取元素
var oUl=utils.getElesByClass("newsList")[0];
var imgs=oUl.getElementsByTagName("img");
var data=null;

//2、获取数据
(function getData() {
    var xhr=new XMLHttpRequest();
    xhr.open("get","data.txt",false);
    xhr.onreadystatechange=function () {
        if(xhr.readyState==4&&xhr.status==200){
            var jsonStr=xhr.responseText;
            data=JSON.parse(jsonStr);
        }
    }
    xhr.send(null);
})();

//3、绑定数据
(function bindData() {
    if(data&&data.length>0){
        var str="";
        for(var i=0;i<data.length;i++){
            var curDataObj=data[i];
            str+="<li><div><img src='' tempSrc='"+curDataObj.src+"'/></div><div><h3>"+curDataObj.title+"</h3><p>"+curDataObj.desc+"</p></div></li>";
        }
        oUl.innerHTML=str;
    }
})();

//4、图片延迟加载
function allImgDelayLoad() {
    for(var i=0;i<imgs.length;i++){
        var curImg=imgs[i];
        if(curImg.isLoaded){
            continue;
        }
        var a=utils.win("clientHeight")+utils.win("scrollTop");
        var b=curImg.parentNode.offsetHeight+utils.offset(curImg.parentNode).top;
        if(a>b){
            singleImgLoad(curImg);
            fadeIn(curImg);
        }
    }
}
function singleImgLoad(curImg) {
    var tempImg=new Image();
    tempImg.src=curImg.getAttribute("tempSrc");
    tempImg.onload=function () {
        curImg.src=this.src;
    }
    curImg.isLoaded=true;
}
function fadeIn(curImg) {
    var opacity=window.getComputedStyle(curImg).opacity/1,_this=this;
    curImg.timer=window.setInterval(function () {
        if(opacity>=1){
            window.clearInterval(_this.timer);
        }
        opacity+=0.01;
        curImg.style.opacity=opacity;
    },10);
}
allImgDelayLoad();
window.onscroll=allImgDelayLoad;