/**
 * Created by Administrator on 2016/12/8.
 */
//构造函数封装思路：
/*
*  1.哪些应该放在原型上
*  2.哪些应该放在私有构造函数中
*  3.利用原型的公有方法操作私有属性
*  4.哪些应该是从外部传参进入的
*  5.实例在这里就是一个中间人的角色，既能找到原型的公有方法，还能获取到私有属性
* */
function BannerFadeIn(container,url,interval){
    this.banner=container;
    this.bannerInner=utils.getElesByClass("bannerInner",this.banner)[0];
    this.focusList=utils.getElesByClass("focusList",this.banner)[0];
    this.left=utils.getElesByClass("left",this.banner)[0];
    this.right=utils.getElesByClass("right",this.banner)[0];
    this.lis=this.banner.getElementsByTagName("li");
    this.imgs=this.banner.getElementsByTagName("img");
    this.url=url;
    this.data=null;
    this.step=0;
    this.timer=null;
    this.isOkClick=true;
    this.interval=interval||2000;
    this.init();
}
BannerFadeIn.prototype={
    constructor:BannerFadeIn,
    //获取数据
    getData:function () {
        var xhr=new XMLHttpRequest();
        xhr.open("get",this.url+"?_="+new Date().getTime(),false);//this==>实例
        var _this=this;
        xhr.onreadystatechange=function () {
            if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
                _this.data=utils.jsonParse(xhr.responseText);
            }
        };
        xhr.send(null);
    },
    //绑定数据
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
    //图片有效性验证
    imgDelayLoad:function () {
        for(var i=0;i<this.imgs.length;i++){
            var _this=this;
            (function (i) {
                var curImg=_this.imgs[i];
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
                };
                curImg.isLoaded=true;
            })(i);
        }
    },
    //轮播
    autoMove:function () {
        if(this.step==this.data.length-1){
            this.step=-1;
        }
        this.step++;
        this.setBanner();
    },
    //轮播方法
    setBanner:function () {
        for(var i=0;i<this.imgs.length;i++){
            var _this=this;
            if(i===this.step){
                utils.css(this.imgs[i].parentNode,"zIndex",1);
                animate({ele:this.imgs[i].parentNode,target:{opacity:1},duration:500,callback:function () {
                    var otherDivs=utils.siblings(this);
                    for(var i=0;i<otherDivs.length;i++){
                        utils.css(otherDivs[i],"opacity",0);
                    }
                    _this.isOkClick=true;
                }});
            }else{
                utils.css(this.imgs[i].parentNode,"zIndex",0);
            }
        }
        //焦点对齐
        for(var i=0;i<this.lis.length;i++){
            this.lis[i].className=i===this.step?"selected":"";
        }
    },
    //鼠标悬停和离开
    mouseEvent:function () {
        var _this=this;
        this.banner.onmouseover=function () {
            window.clearInterval(_this.timer);
            _this.left.style.display=_this.right.style.display="block";
        };
        this.banner.onmouseout=function () {
            /*_this.timer=window.setInterval(_this.autoMove,1000);*/
            //这个定时器中的this是window，我们要保证autoMove方法中的this是实例
            //所以给autoMove方法包装了一个匿名函数，然后匿名函数中的this是window，但是在匿名函数中执行实例autoMove，autoMove方法中的this就是实例
            _this.timer=window.setInterval(function(){
                _this.autoMove();
            },_this.interval);
            _this.left.style.display=_this.right.style.display="none";
        }
    },
    //左右按钮点击切换
    btnClick:function () {
        var _this=this;
        this.right.onclick=function(){
            if(_this.isOkClick){
                _this.autoMove();
                _this.isOkClick=false;
            }
        };
        this.left.onclick=function () {
            if(_this.isOkClick){
                _this.step--;
                if(_this.step==-1){
                    _this.step=_this.data.length-1;
                }
                _this.setBanner();
                _this.isOkClick=false;
            }
        };
    },
    //焦点点击
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
        this.timer=window.setInterval(function(){
            _this.autoMove();
        },this.interval);
        this.mouseEvent();
        this.btnClick();
        this.focusClick();
    }
};

