/**
 * Created by xuya on 2016/12/9.
 */
/*该插件用来实现左右运动版的轮播图效果
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
 * @param oneWidth：每次平移的宽度（必选）
 * @param interval：轮播速度（可选，如果不传递，默认为2000）
 * @constructor
 */
function BannerMove(container,url,oneWidth,interval) {//container url interval
    this.banner=container;
    this.url=url;
    this.oneWidth=oneWidth;
    this.interval=interval||2000;
    this.bannerInner=utils.getElesByClass("bannerInner",this.banner)[0];
    this.focusList=utils.getElesByClass("focusList",this.banner)[0];
    this.left=utils.children(this.banner,"a")[0];
    this.right=utils.children(this.banner,"a")[1];
    this.lis=this.banner.getElementsByTagName("li");
    this.imgs=this.banner.getElementsByTagName("img");
    this.data=null;
    this.step=0;
    this.timer=null;
    this.init();
}
BannerMove.prototype={
    constructor:BannerMove,
    //1、获取数据
    getData:function () {
        var _this=this;
        var xhr=new XMLHttpRequest();
        xhr.open("get",this.url+"?_="+new Date().getTime(),false);
        xhr.onreadystatechange=function () {
            if(xhr.readyState&&/^2\d{2}$/.test(xhr.status)){
                _this.data=utils.jsonParse(xhr.responseText);
            }
        };
        xhr.send(null);
    },
    //2、绑定数据到页面
    bindData:function () {
        if(this.data&&this.data.length>0){
            var str="",strLi="";
            for(var i=0;i<this.data.length;i++){
                var curDataObj=this.data[i];
                str+="<div><img src='' tempSrc='"+curDataObj.src+"'/></div>";
                strLi+=i==0?"<li class='selected'></li>":"<li></li>";
            }
            str+="<div><img src='' tempSrc='"+this.data[0].src+"'/></div>";
            utils.css(this.bannerInner,"width",(this.data.length+1)*this.oneWidth);
            this.bannerInner.innerHTML=str;
            this.focusList.innerHTML=strLi;
        }
    },
    //3、图片有效性验证
    imgDelayLoad:function () {
        var _this=this;
        for(var i=0;i<this.imgs.length;i++){
            (function (i) {
                var curImg=_this.imgs[i];
                if(curImg.isLoaded){
                    return;
                }
                var tempImg=document.createElement("img");
                tempImg.src=curImg.getAttribute("tempSrc");
                tempImg.onload=function () {
                    curImg.src=this.src;
                    animate({ele:curImg,target:{opacity:1},duration:500});
                };
                curImg.isLoaded=true;
            })(i);
        }
    },
    //4、轮播
    autoMove:function () {
        if(this.step==this.data.length){
            this.step=0;
            utils.css(this.bannerInner,"left",-this.step*this.oneWidth);
        }
        this.step++;
        animate({ele:this.bannerInner,target:{left:-this.step*this.oneWidth},duration:500});
        this.focusAlign();
    },
    //焦点对齐
    focusAlign:function () {
        var tempStep=this.step==this.data.length?0:this.step;
        for(var i=0;i<this.lis.length;i++){
            this.lis[i].className=i==tempStep?"selected":null;
        }
    },
    //5、鼠标悬停和离开
    mouseEvent:function () {
        var _this=this;
        this.banner.onmouseover=function () {
            window.clearInterval(_this.timer);
            _this.left.style.display=_this.right.style.display="block";
        };
        this.banner.onmouseout=function () {
            _this.timer=window.setInterval(function(){
                _this.autoMove();
            },_this.interval);
            _this.left.style.display = _this.right.style.display = "none";
        };
    },
    //6、左右按钮切换
    btnClick:function () {
        var _this=this;
        this.left.onclick=function () {
            if(_this.step==0){
                _this.step=_this.data.length;
                utils.css(_this.bannerInner,"left",-_this.step*_this.oneWidth);
            }
            _this.step--;
            animate({ele:_this.bannerInner,target:{left:-_this.step*_this.oneWidth},duration:500});
            _this.focusAlign();
        };
        this.right.onclick=function(){
            _this.autoMove();
        };
    },
    //7、点击焦点切换
    focusClick:function () {
        var _this=this;
        for(var i=0;i<this.lis.length;i++){
            this.lis[i].index=i;
            this.lis[i].onclick=function () {
                _this.step=this.index;
                animate({ele:_this.bannerInner,target:{left:-_this.step*_this.oneWidth},duration:500});
                _this.focusAlign();
            }
        }
    },
    //依次执行函数
    init:function () {
        var _this=this;
        this.getData();
        this.bindData();
        this.imgDelayLoad();
        this.timer=window.setInterval(function(){
            _this.autoMove();
        },this.interval);
        this.mouseEvent();
        this.btnClick();
        this.focusClick();
    }
};






