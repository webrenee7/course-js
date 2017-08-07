/**
 * Created by Administrator on 2016/12/12.
 */
function BannerFadeIn(container,url,interval){
    this.banner=container;
    this.url=url;
    this.interval=interval||2000;
    this.bannerInner=utils.getElesByClass("bannerInner",this.banner)[0];
    this.focusList=utils.getElesByClass("focusList",this.banner)[0];
    this.infoList=utils.getElesByClass("infoList",this.banner)[0];
    this.lis=this.focusList.getElementsByTagName("li");
    this.imgs=this.bannerInner.getElementsByTagName("a");
    this.smallImgs=this.focusList.getElementsByTagName("img");
    this.divList=this.infoList.getElementsByTagName("div");
    this.data=null;
    this.step=0;
    this.init();
}
BannerFadeIn.prototype={
    constructor:BannerFadeIn,
    //1、获取数据
    getData:function () {
        var _this=this;
        var xhr=new XMLHttpRequest()
        xhr.open("get",this.url+"?_="+new Date().getTime(),false);
        xhr.onreadystatechange=function () {
            if(xhr.readyState==4&&xhr.status==200){
                _this.data=utils.jsonParse(xhr.responseText);
            }
        };
        xhr.send(null);
    },
    //2、绑定数据
    bindData:function () {
        if(this.data&&this.data.length>0){
            var str="",strUl="",strDiv="";
            strUl+="<ul>";
            for(var i=0;i<this.data.length;i++){
                var curDataObj=this.data[i];
                str+="<div><a href='' tempSrc='"+curDataObj.src+"'></a></div>";
                strUl+=i==0?"<li class='selected'><img src=''/></li>":"<li><img src=''/></li>";
                strDiv+="<div><h3><a href=''>"+curDataObj.title+"</a></h3></div>";
            }
            strUl+="</ul>";
            this.bannerInner.innerHTML=str;
            this.focusList.innerHTML=strUl;
            this.infoList.innerHTML=strDiv;
        }
    },
    //3、图片有效性验证
    imgDelayLoad:function () {
        var _this=this;
        for(var i=0;i<this.imgs.length;i++){
            var curImg=this.imgs[i];
            if(curImg.isLoaded){
                continue;
            }
            var tempImg=new Image();
            tempImg.src=curImg.getAttribute("tempSrc");
            tempImg.index=i;
            tempImg.onload=function () {
                var src=this.getAttribute("src");
                _this.imgs[this.index].style.background="url("+src+") no-repeat top center";
                _this.smallImgs[this.index].src=this.src;
            };
            if(i==0){
                utils.css(this.divList[i],"display","block");
                utils.css(curImg.parentNode,"zIndex",1);
                animate({ele:curImg.parentNode,target:{"opacity":1},duration:500});
            }
            curImg.isLoaded=true;
        }
    },
    //4、轮播
    autoMove:function () {
        this.step++;
        if(this.step==this.data.length){
            this.step=0;
        }
        this.setBanner();
    },
    setBanner:function () {
        var _this=this;
        for(var i=0;i<this.imgs.length;i++){
            var curImg=this.imgs[i];
            if(i==this.step){
                utils.css(curImg.parentNode,"zIndex",1);
                animate({ele:curImg.parentNode,target:{opacity:1},duration:500,callback:function () {
                    var otherDivs=utils.siblings(this);
                    for(var j=0;j<otherDivs.length;j++){
                        utils.css(otherDivs[j],"opacity",0);
                    }
                }});
            }else{
                utils.css(curImg.parentNode,"zIndex",0);
            }
        }
        //焦点对齐
        for(var i=0;i<this.lis.length;i++){
            i==this.step?utils.css(this.lis[i],"bottom",0):utils.css(this.lis[i],"bottom",-15);
        }
        for(var i=0;i<this.divList.length;i++){
            utils.css(this.divList[i],"display","none");
        }
        utils.css(this.divList[this.step],"display","block");
    },
    //鼠标悬停和离开
    mouseEvent:function () {
        var _this=this;
        this.focusList.onmouseover=function () {
            window.clearInterval(_this.timer);
        };
        this.focusList.onmouseout=function () {
            _this.timer=window.setInterval(function(){
                _this.autoMove();
            },_this.interval);
        };
    },
    //点击焦点切换
    focusMouseover:function () {
        var _this=this;
        for(var i=0;i<this.lis.length;i++){
            this.lis[i].index=i;
            this.lis[i].onmouseover=function () {
                _this.step=this.index;
                _this.setBanner();
            }
        }
    },
    //依次执行函数
    init:function () {
        var _this=this;
        this.getData();
        this.bindData();
        this.imgDelayLoad();
        this.timer=window.setInterval(function () {
            _this.autoMove();
        },_this.interval);
        this.mouseEvent();
        this.focusMouseover();
    }
};
