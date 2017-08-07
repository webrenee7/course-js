/**
 * Created by Administrator on 2016/11/29.
 */
var utils={
    //jsonParse：将json字符串转化为json对象
    jsonParse:function (jsonStr) {
        return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
    },
    //用法：utils.jsonParse(jsonStr);


    //listToArray：将类数组转化为数组
    listToArray:function (likeAry) {
        var val=[];
        try{
            ary=Array.prototype.slice.call(likeAry);
        }catch(e){
            for(var i=0;i<likeAry.length;i++){
                ary.push(likeAry[i]);
            }
        }
        return ary;
    },
    //用法：utils.listToArray(likeAry);


    //offset:获取元素距离body的偏移量
    offset:function (ele) {
        var totalLeft=null;
        var totalTop=null;
        var par=ele.offsetParent;//这个值有可能是body，有可能是已经定位的祖先元素
        //先累加ele本身的偏移
        totalLeft+=ele.offsetLeft;
        totalTop+=ele.offsetTop;
        while(par){//parent:outer==>body
            //if(!(/MSIE 8/.test(window.navigator.userAgent))){
            if(window.navigator.userAgent.indexOf("MSIE 8")===-1){//不是IE8
                //IE8会自己加元素的边框，所以不是IE8的情况才累加父元素的边框
                totalLeft+=par.clientLeft;
                totalTop+=par.clientTop;
            }
            //累加父元素的偏移量
            totalLeft+=par.offsetLeft;
            totalTop+=par.offsetTop;
            par=par.offsetParent;//重要代码，保证能一直获取到body的
        }
        return{left:totalLeft,top:totalTop};
    },
    //用法：utils.offset(ele).top;


    //win：获取/设置浏览器的属性
    win:function (attr,val) {// val：scrollTop/scrollLeft
        if(typeof val==="undefined"){//val没有传值,获取值
            return document.documentElement[attr]||document.body[attr];
        }else{//val传值了，设置值
            document.documentElement[attr]=val;
            document.body[attr]=val;
        }
    },
    //用法：utils.win(attr);//获取值    utils.win(attr,val);//得到值


    //getRandom：获取n-m之间的随机数
    getRandom:function (n,m) {
        n=Number(n);
        m=Number(m);
        if(isNaN(n)||isNaN(m)){//判断是否为数字
            return Math.random();
        }
        if(n>m){//如果n>m，交换n和m的位置。
            var temp=m;//利用中间变量法
            m=n;
            n=temp;
            temp=null;
        }
        return Math.round(Math.random()*(m-n)+n);
    },
    //用法：utils.getRandom(n,m);


    //getCss:获取元素的样式
    getCss:function (ele,attr) {
        var val=null;
        if(window.getComputedStyle){
            val=window.getComputedStyle(ele)[attr];
        }else{
            if(attr=="opacity"){
                val=ele.currentStyle.filter;
                //alpha(opacity=50)
                var reg=/^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val=reg.test(val)?reg.exec(val)[1]/100:1;
            }
            val=ele.currentStyle[attr];
        }
        //-123.1232px
        var reg=/^-?(?:\d+)(?:\.\d+)?(?:px|pt|em|rem|deg)?$/;
        if(reg.test(val)){
            val=parseFloat(val);
        }
        return val;
    },
    //用法：utils.getCss(ele,attr);


    //设置元素样式
    setCss:function (ele,attr,val) {
            if(attr=="opacity"){
                ele.style.opacity=val;
                ele.style.filter='alpha(opacity='+val*100+')';
                return;
            }
            if(attr=="float"){
                ele.style.cssFloat=val;//标准浏览器
                ele.style.styleFloat=val;//ie6-8浏览器
                return;
            }
            var reg=/^(width|height|left|top|right|bottom|(margin|padding)(Left|Right|Bottom|Top))$/;
            if(reg.test(attr)){
                if(!isNaN(val)){
                    val+="px";
                }
            }
            ele.style[attr]=val;
        }
    //用法：utils.setCss(ele,attr,val);

}