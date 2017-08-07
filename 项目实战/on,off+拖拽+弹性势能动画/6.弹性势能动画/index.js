/**
 * Created by Administrator on 2016/12/23.
 */
var box=document.getElementById("box");
box.onmousedown=function (e) {
    e=e||window.event;
    e.pageX=e.pageX||(e.clientX+document.documentElement.scrollLeft||document.body.scrollLeft);
    e.pageY=e.pageY||(e.clientY+document.documentElement.scrollTop||document.body.scrollTop);
    this.l=e.pageX-this.offsetLeft;
    this.t=e.pageY-this.offsetTop;
    if(this.setCapture){//ie和火狐
        this.setCapture();//把鼠标和盒子绑定在一起，防止鼠标移动过快而丢失
        this.onmousemove=move;
        this.onmouseup=up;
    }else{//谷歌
        var _this=this;
        // document.onmousemove=move;//如果这样执行，move中的this是document
        document.onmousemove=function (e) {//e存在于真正绑定的函数中
            move.call(_this,e);
        };
        document.onmouseup=function (e) {
            up.call(_this,e);
        };
    }
};
function move(e) {
    e=e||window.event;
    e.pageX=e.pageX||(e.clientX+document.documentElement.scrollLeft||document.body.scrollLeft);
    e.pageY=e.pageY||(e.clientY+document.documentElement.scrollTop||document.body.scrollTop);
    var left=e.pageX-this.l;
    var top=e.pageY-this.t;
    //边界判断
    var minL=0,minT=0,maxL=(document.documentElement.clientWidth||document.body.clientWidth)-this.offsetWidth,maxT=(document.documentElement.clientHeight||document.body.clientHeight)-this.offsetHeight;
    left=left<minL?minL:(left>maxL?maxL:left);
    top=top<minT?minT:(top>maxT?maxT:top);
    this.style.left=left+"px";
    this.style.top=top+"px";
    //防止盒子中有图片时，图片拖动的默认行为
    e.preventDefault?e.preventDefault():e.returnValue=false;
    //鼠标移动时，计算盒子运动的速度(最后一次的)
    if(this.prev){//如果上一次存在，当前offsetLeft减去上一次offsetLeft就是当前速度
        this.speed=this.offsetLeft-this.prev;
    }
    this.prev=this.offsetLeft;//刚开始上一次不存在，直接让当前的offsetLeft作为上一次
}
function up() {
    if(this.releaseCapture){//ie和火狐
        this.releaseCapture();//解除掉鼠标和盒子的绑定
        this.onmousemove=null;
        this.onmouseup=null;
    }else{//谷歌
        document.onmousemove=null;
        document.onmouseup=null;
    }
    //鼠标松开时，执行fly方法（先匀加速，后匀减速）
    //fly();//这样执行,fly中的this是window
    fly.call(this);
    //鼠标松开时，执行drop方法(自由落体运动，匀减速运动)
    drop.call(this);
}
function fly() {
    var _this=this;
    //当结束拖拽的那一刻，让这个盒子能继续运动起来，需要启动一个定时器，不断驱动位置变化
    window.clearInterval(this.flyTimer);
    this.flyTimer=window.setInterval(function () {
        var curLeft=_this.offsetLeft;
        _this.speed*=0.99;//做匀减速运动
        //当速度小于0.5之后，浏览器已经不再识别，因为浏览器能够识别的最小像素为0.5，所以要做边界判断
        if(Math.abs(_this.speed)<0.5){
            window.clearInterval(_this.flyTimer);
        }
        curLeft+=_this.speed;
        //水平方向边界判断
        var minL=0,maxL=(document.documentElement.clientWidth||document.body.clientWidth)-_this.offsetWidth;
        //盒子到达最右边向左运动，到达最左边向右运动
        if(curLeft>maxL){//盒子到达最右边
            _this.style.left=maxL+"px";
            _this.speed*=-1;//盒子向反方向运动
        }else if(curLeft<minL){//盒子到达最左边
            _this.style.left=minL+"px";
            _this.speed*=-1;//盒子向反方向运动
        }else{
            _this.style.left=curLeft+"px";
        }
    },10);
}
function drop() {
    var _this=this;
    window.clearInterval(this.dropTimer);
    this.dropTimer=window.setInterval(function () {
        if(_this.flag>=2){//如果盒子两次以上都一直在最底下，就清空定时器
            window.clearInterval(_this.dropTimer);
        }
        _this.dropSpeed=!_this.dropSpeed?9.8:_this.dropSpeed+=9.8;
        _this.dropSpeed*=0.99;//匀减速运动
        var curTop=_this.offsetTop;
        curTop+=_this.dropSpeed;
        //边界判断
        var maxT=(document.documentElement.clientHeight||document.body.clientHeight)-_this.offsetHeight;
        if(curTop>maxT){//盒子到达最底部
            _this.style.top=maxT+"px";
            _this.dropSpeed*=-1;
            _this.flag++;//flag累加1
            console.log(_this.flag);
        }else{//盒子不在最底部
            _this.style.top=curTop+"px";
            _this.flag=0;//flag重置为0
        }
    },10);
}
