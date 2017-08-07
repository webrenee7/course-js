/**
 * Created by Administrator on 2016/12/12.
 */
/*该插件用来实现渐隐渐现版的轮播图效果
 * 1、容器结构如下：
     <div class="banner" id="banner">
         <div class="bannerInner"></div>
         <ul class="focusList"></ul>
         <a href="javascript:;"></a>
         <a href="javascript:;"></a>
     </div>
 * 2、参数说明：
 * @param container：要轮播的容器（必选）
 * @param url：数据接口（必选）
 * @param interval：轮播速度（可选，如果不传递，默认为2000）
 * @constructor
 */
function BannerFadeIn(container,url,interval){
    this.banner=container;
    this.url=url;
    this.interval=interval||2000;
    this.bannerInner=utils.getElesByClass("bannerInner",this.banner)[0];
    this.focusList=utils.getElesByClass("focusList",this.banner)[0];
    this.left=utils.children(this.banner,"a")[0];
    this.right=utils.children(this.banner,"a")[1];
    this.lis=this.banner.getElementsByTagName("li");
    this.imgs=this.banner.getElementsByTagName("img");
    this.data=null;
    this.isClickOk=true;
    this.step=0;
    this.init();
}
BannerFadeIn.prototype={
    constructor:BannerFadeIn,
    //1、获取数据
    getData:function () {
        var _this=this;
        var xhr=new XMLHttpRequest();
        xhr.open("get",this.url+"?_="+new Date().getTime(),false);
        xhr.onreadystatechange=function () {
            if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
                _this.data=utils.jsonParse(xhr.responseText);
            }
        };
        xhr.send(null);
    },
    //2、绑定数据
    bindData:function () {
        if(this.data&&this.data.length>0){
            var str="",strLi="";
            for(var i=0;i<this.data.length;i++){
                var curDataObj=this.data[i];
                str+="<div><img src='' tempSrc='"+curDataObj.src+"'/></div>";
                strLi+=i==0?"<li class='selected'></li>":"<li></li>";
            }
            this.bannerInner.innerHTML=str;
            this.focusList.innerHTML=strLi;
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
                _this.imgs[this.index].src=this.src;
            };
            if(i==0){
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
                    _this.isClickOk=true;
                }});
            }else{
                utils.css(curImg.parentNode,"zIndex",0);
            }
        }
        //焦点对齐
        for(var i=0;i<this.lis.length;i++){
            this.lis[i].className=i==this.step?"selected":"";
        }
    },
    //鼠标悬停和离开
    mouseEvent:function () {
        var _this=this;
        this.banner.onmouseover=function () {
            window.clearInterval(_this.timer);
            utils.css(_this.left,"display","block");
            utils.css(_this.right,"display","block");
        };
        this.banner.onmouseout=function () {
            _this.timer=window.setInterval(function(){
                _this.autoMove();
            },_this.interval);
            utils.css(_this.left,"display","none");
            utils.css(_this.right,"display","none");
        };
    },
    //左右按钮点击切换
    btnClick:function () {
        var _this=this;
        this.right.onclick=function () {
            if(_this.isClickOk){
                _this.autoMove();
                _this.isClickOk=false;
            }
        };
        this.left.onclick=function () {
            if(_this.isClickOk){
                _this.step--;
                if(_this.step==-1){
                    _this.step=_this.data.length-1;
                }
                _this.setBanner();
                _this.isClickOk=false;
            }
        };
    },
    //点击焦点切换
    focusClick:function () {
        var _this=this;
        for(var i=0;i<this.lis.length;i++){
            this.lis[i].index=i;
            this.lis[i].onclick=function () {
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
        this.btnClick();
        this.focusClick();
    }
};
