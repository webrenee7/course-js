/**
 * Created by Administrator on 2016/12/1.
 */
//1、获取要操作的元素
var oUl=document.querySelector(".news");//移动端不用考虑兼容性
var imgs=oUl.getElementsByTagName("img");

var data=null;

//2、获取数据
(function getData() {
    var xhr=new XMLHttpRequest();
    xhr.open("get","data.txt?_="+new Date().getTime(),false);
    //只有时间戳永远会变  new Date().getTime()
    //Math.random()有可能重复
    xhr.onreadystatechange=function () {
        if(xhr.readyState==4&&xhr.status==200){
            var jsonStr=xhr.responseText;
            data=utils.jsonParse(jsonStr);
        }
    }
    xhr.send(null);
})();

//3、绑定数据
(function bindData() {
    var str="";
    if(data&&data.length>0){
        for(var i=0;i<data.length;i++){
            var curDataObj=data[i];
            str+="<li>";
            str+="<div><img src='' trueImg='"+curDataObj.imgSrc+"'/></div>"
            str+="<div><h3>"+curDataObj.title+"</h3><p>"+curDataObj.article+"</p></div>";
            str+="</li>";
        }
        oUl.innerHTML+=str;
    }
})();

//4、图片延迟加载
function allImgsDelayLoad() {
    for(var i=0;i<imgs.length;i++){
        var curImg=imgs[i];
        if(curImg.isLoaded){
            continue;//如果当前这张图片加载过，那么就不用再加载了，但是还要加载下面的图片，所以用continue，而不是return
        }
        var a=utils.win("clientHeight")+utils.win("scrollTop");
        var b=curImg.parentNode.offsetHeight/2+utils.offset(curImg.parentNode).top;
        if(a>b){//当前图片完全进入到浏览器窗口内
            //执行单张图片延迟加载
            singleImgLoad(curImg);//把符合条件的图片做延迟加载有效性验证
            fadeIn(curImg);//图片淡出效果
        }
    }
}
function singleImgLoad(curImg){
    var tempImg=new Image();//创建一个临时图片
    tempImg.src=curImg.getAttribute("trueImg");//让tempImg去加载参数img的图片资源
    tempImg.onload=function () {
        curImg.src=this.src;//加载成功之后，真实图片再去加载，由于tempImg已经加载过这个图片资源，真实图片再去加载的时候，从本地缓存304获取
    }
    curImg.isLoaded=true;//只要加载过，就添加一个自定义属性
}
allImgsDelayLoad();
window.onscroll=allImgsDelayLoad;
function fadeIn(curImg) {
    var op=utils.getCss(curImg,"opacity");//getCss获取到的值是字符串
    curImg.timer=window.setInterval(function () {
        if(op>=1){
            window.clearInterval(this.timer);
            return;
        }
        op=op+0.01;
        utils.setCss(curImg,"opacity",op);
    },10);
}