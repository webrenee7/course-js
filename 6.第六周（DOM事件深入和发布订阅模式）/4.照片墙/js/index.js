/**
 * Created by Administrator on 2016/12/25.
 */
//1、给每个li绝对定位
//由于这些li都可以被拖拽，每一个li必须是绝对定位的，每一个li的left的值和top的值都是在offsetLeft的基础上减去一个边距(5px)
var ul=document.getElementById("list");
var lis=ul.getElementsByTagName("li");
for(var i=lis.length-1;i>=0;i--){
    //循环反过来是为了处理定位的问题，防止每次由于绝对定位导致的offsetLeft的值变化
    var li=lis[i];
    //offsetLeft与left的区别
    /*offsetLeft是从外边距开始算起
     left是从外边框开始算起*/
    // var l=li.offsetLeft-5;
    // var t=li.offsetTop-5;

    li.style.margin=0;
    //每一个li都保存着自定的位置，当交换位置的时刻，这个就是当前拖拽的li运动的终点
    var l=li.offsetLeft;
    var t=li.offsetTop;

    li.originLeft=l;
    li.originTop=t;
    li.style.left=l+"px";
    li.style.top=t+"px";
    li.style.position="absolute";
    //2、让每一个li都可以拖拽，拖拽开始，li变色，拖拽结束li恢复原来颜色
    new Drag(li);
    //拖拽开始
    //让当前拖拽的li层级提高，其他的li层级为0
    on(li,"selfdragstart",increaseZIndex);
    //改变当前li的背景色
    on(li,"selfdragstart",changeBg);

    //拖拽中
    //把碰撞到的li获取到，再改变一下颜色
    on(li,"selfdraging",checkLis);

    //拖拽结束
    //恢复当前li的背景色
    on(li,"selfdragend",resetBg);
    //在所有碰撞的li中挑出和当前的li的距离最短的交换位置
    on(li,"selfdragend",changePosi);
}
function increaseZIndex() {
    for(var i=0;i<lis.length;i++){
        // console.log(lis[i].style.zIndex);
        //循环所有li，只要和我正在拖拽的这个li是同一个，那么就让这个li的层级提高，其他的层级全部为0
        // lis[i].style.zIndex=0;
        lis[i].style.zIndex=lis[i]===this?1:0;
    }
    // this.style.zIndex=1;
}
function changeBg() {
    this.style.backgroundColor="blue";
}
function resetBg() {
    this.style.backgroundColor="";
}
function checkLis() {
    this["hitedLi"]=[];//在拖拽的这个元素li上添加一个自定义属性用来保存跟this碰撞上的li==》因为当拖拽结束的时候还要在这几个中挑和this距离最短的那个li交换位置
    var ary=this["hitedLi"];
    for(var i=0;i<lis.length;i++){
        var li=lis[i];
        if(li===this){
            continue;//和this相等必然就是正在拖拽的那个盒子，那么就不用做检测了
        }
        //接下来要做的事就是检测每个li是否和当前这个正在拖拽的this碰撞
        li.style.backgroundColor="";//在没有做碰撞检测之前，给每个li的背景色去掉
        if(isHited(li,this)){//这个条件为真，都是和正在拖拽的li(this)撞上了
            li.style.backgroundColor="orange";
            ary.push(li);//把撞上的li添加到正在拖拽的这个li(this)的自定义属性数组中
        }
    }
}
function isHited(staticLi,dragingLi) {
    // return staticLi.offsetLeft+staticLi.offsetWidth<dragingLi.offsetLeft||staticLi.offsetTop+staticLi.offsetHeight<dragingLi.offsetTop||dragingLi.offsetLeft+dragingLi.offsetWidth<staticLi.offsetLeft||dragingLi.offsetTop+dragingLi.offsetHeight<staticLi.offsetTop;
    //碰到了返回true，没碰到返回false
    if(staticLi.offsetLeft+staticLi.offsetWidth<dragingLi.offsetLeft||staticLi.offsetTop+staticLi.offsetHeight<dragingLi.offsetTop||dragingLi.offsetLeft+dragingLi.offsetWidth<staticLi.offsetLeft||dragingLi.offsetTop+dragingLi.offsetHeight<staticLi.offsetTop){
        return false;
    }else{
        return true;
    }
}
function changePosi() {
    var ary=this["hitedLi"];
    if(ary&&ary.length){//至少存在一个撞上的li
        for(var i=0;i<ary.length;i++){
            var hitedLi=ary[i];
            //分别求this和每一个hitedLi的距离,我们要把这个距离添加到每一个自定义属性上，为了一会按照这个属性去排序
            var x=this.offsetLeft-hitedLi.offsetLeft;//直角边
            var y=this.offsetTop-hitedLi.offsetTop;//直角边
            hitedLi.distance=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
            hitedLi.style.backgroundColor="";
        }
        //这个循环结束后，数组中每一个碰撞上的li都保存着一个距离this的长度，按照这个属性排序，然后获取距离最短的那个
        ary.sort(function (a,b) {
            return a.distance-b.distance;
        });
        var shortHitedLi=ary[0];//距离当前拖拽元素距离最短的那个li
        //代码执行到这里，找到了当前拖拽的li和哪个li换位置
        //每一个li.originLeft,li.originTop保存着自己的位置
        //用this和shortHitedLi交换位置（动画方式交换）
        animate({ele:this,target:{left:shortHitedLi.originLeft,top:shortHitedLi.originTop},duration:100});
        animate({ele:shortHitedLi,target:{left:this.originLeft,top:this.originTop},duration:100});
        //动画交换位置之后，还需要把自定义属性保存原始位置的值也需要交换(借鉴冒泡排序的交换思想)
        var tempObj={
            left:this.originLeft,
            top:this.originTop
        };
        this.originLeft=shortHitedLi.originLeft;
        this.originTop=shortHitedLi.originTop;
        shortHitedLi.originLeft=tempObj.left;
        shortHitedLi.originTop=tempObj.top;
        /*shortHitedLi.originLeft=this.originLeft;
        shortHitedLi.originTop=this.originTop;*/
        this["hitedLi"]=null;
        tempObj=null;
    }else{//没有撞上的li，当前的li回到原位置
        animate({ele:this,target:{left:this.originLeft,top:this.originTop},duration:100});
    }
}

