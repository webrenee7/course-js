/**
 * Created by Administrator on 2016/12/13.
 */
/*原生js版*/

/*---nav部分---*/
var topLogo=utils.getElesByClass("top_logo")[0];
var navActive=utils.getElesByClass("nav_active")[0];
var topNav=utils.getElesByClass("top_nav")[0];
var navList=utils.getElesByClass("nav_list")[0];
var navDropMenu=utils.getElesByClass("nav_drop_menu")[0];
var aLis=navList.getElementsByTagName("a");
var oUls=navDropMenu.getElementsByTagName("ul");
var letvLogo=utils.getElesByClass("letv_logo")[0];
var webList=utils.getElesByClass("web_list")[0];
function navChange(curLi) {
    var left=utils.offset(curLi).left;
    var width=utils.css(curLi,"width");
    utils.css(navActive,"width",width+34);//黑色滑块navActive的宽度改变
    animate({ele:navActive,target:{"left":left-15},duration:200});//黑色滑块navActive的left值改变
    animate({ele:topLogo,target:{"width":left+19},duration:200});//红色topLogo的宽度改变
}
//默认黑色滑块在首页位置
var curLi=aLis[0].parentNode;
navChange(curLi);
for(var i=0;i<aLis.length;i++){
    aLis[i].index=i;
    aLis[i].onmouseenter=function () {
        /*鼠标经过a链接的动画*/
        var curLi=this.parentNode;
        navChange(curLi);
        if(this.index!=0){
            aLis[0].parentNode.className="home";
        }
        //*下拉菜单显示和隐藏*/
        animate({ele:navDropMenu,target:{"height":0},duration:100});
        for(var j=0;j<oUls.length;j++){
            utils.css(oUls[j],"display","none");
            if(oUls[j].getAttribute("data-uid")==this.index){//如果ul的"data-uid"值和当前a标签的索引相等
                animate({ele:navDropMenu,target:{"height":44},duration:100});//黑色下拉框向下展开
                utils.css(oUls[j],"display","block");//当前a标签的子菜单内容显示
            }
        }
    }
}
//离开topNav时，下拉菜单隐藏，并且让黑色滑块滑动到首页的位置
topNav.onmouseleave=function (e) {
    animate({ele:navDropMenu,target:{"height":0},duration:100});
    for(var j=0;j<oUls.length;j++){
        utils.css(oUls[j],"display","none");
    }
     var curLi=aLis[0].parentNode;
     navChange(curLi);
    aLis[0].parentNode.className="";
};
//经过乐视logo，显示下拉菜单，离开时下拉菜单隐藏
letvLogo.onmouseover=function () {
    animate({ele:webList,target:{"height":44},duration:100});
};
letvLogo.onmouseout=function () {
    animate({ele:webList,target:{"height":0},duration:100});
};

/*--轮播图部分--*/
var bannerList=utils.getElesByClass("banner");
for(var i=0;i<bannerList.length;i++){
    new BannerFadeIn(bannerList[i],"res/data/s"+(i+1)+"_banner.txt",2000);
}

/*--体育新闻切换--*/
var sportNews=document.getElementById("sportNews");
var newsBox=utils.getElesByClass("newsBox",sportNews)[0];
var left=utils.getElesByClass("left")[0];
var right=utils.getElesByClass("right")[0];
var step=0;
left.onclick=leftMove;
right.onclick=rightMove;
function leftMove() {
    step--;
    if(step==0){
        utils.addClass(left,"left_disabled");
        utils.removeClass(right,"right_disabled");
    }
    if(step==-1){
        step=0;
        left.onclick=null;
    }
    right.onclick=rightMove;
    animate({ele:newsBox,target:{"left":step*805},duration:200});
}
function rightMove() {
    step++;
    if(step==1){
        utils.addClass(right,"right_disabled");
        utils.removeClass(left,"left_disabled");
    }
    if(step==2){
        step=1;
        right.onclick=null;
    }
    left.onclick=leftMove;
    animate({ele:newsBox,target:{"left":-step*805},duration:200});
}

/*--体育新闻收起和展开效果--*/
var closeWrapper=utils.getElesByClass("close_wrapper");
var openWrapper=utils.getElesByClass("open_wrapper");
var sportNews=utils.getElesByClass("sportNews");
var infoList=utils.getElesByClass("infoList");
for(var i=0;i<closeWrapper.length;i++){
    closeWrapper[i].index=openWrapper[i].index=i;
    closeWrapper[i].onclick=function () {
        var _this=this;
        utils.removeClass(sportNews[this.index],"sportNews_open");
        utils.addClass(sportNews[this.index],"sportNews_close");
        animate({ele:infoList[this.index],target:{bottom:10+"%"},duration:100,callback:function () {
            window.setTimeout(function () {
                utils.css(openWrapper[_this.index],"display","block");
            },200);
        }});
    };
    openWrapper[i].onclick=function () {
        animate({ele:infoList[this.index],target:{bottom:286},duration:100});
        utils.removeClass(sportNews[this.index],"sportNews_close");
        utils.addClass(sportNews[this.index],"sportNews_open");
        utils.css(openWrapper[this.index],"display","none");
    };
}