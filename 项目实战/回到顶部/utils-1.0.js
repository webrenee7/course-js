/**
 * Created by Administrator on 2016/12/2.
 */
var utils={
    //getRandom：获取n-m之间的随机数
    getRandom:function (n,m) {
        n=Number(n);
        m=Number(m);
        if(isNaN(n)||isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var temp=m;
            m=n;
            n=temp;
            temp=null;
        }
        return Math.round(Math.random()*(m-n)+n);
    },


    //jsonParse：将json字符串转化为json对象
    jsonParse:function (jsonStr) {
        return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
    },


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


    //offset:获取元素距离body的偏移量
    offset:function (ele) {
        var totalLeft=null,totalTop=null,par=ele.offsetParent;
        totalLeft+=ele.offsetLeft;
        totalTop+=ele.offsetTop;
        while(par){
            if(window.navigator.userAgent.indexOf("MSIE 8")===-1){
                totalLeft+=par.clientLeft;
                totalTop+=par.clientTop;
            }
            totalLeft+=par.offsetLeft;
            totalTop+=par.offsetTop;
            par=par.offsetParent;
        }
        return{left:totalLeft,top:totalTop};
    },


    //win：获取/设置浏览器的属性
    win:function (attr,val) {
        if(typeof val==="undefined"){
            return document.documentElement[attr]||document.body[attr];
        }else{
            document.documentElement[attr]=val;
            document.body[attr]=val;
        }
    },


    //getCss:获取元素的样式
    getCss:function (ele,attr) {
        var val=null;
        if(window.getComputedStyle){
            val=window.getComputedStyle(ele)[attr];
        }else{
            if(attr=="opacity"){
                val=ele.currentStyle.filter;
                var reg=/^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val=reg.test(val)?reg.exec(val)[1]/100:1;
            }
            val=ele.currentStyle[attr];
        }
        var reg=/^-?(?:\d+)(?:\.\d+)?(?:px|pt|em|rem|deg)?$/;
        if(reg.test(val)){
            val=parseFloat(val);
        }
        return val;
    },


    //setCss：设置元素的样式
    setCss:function (ele,attr,val) {
        if(attr=="opacity"){
            ele.style.opacity=val;
            ele.style.filter='alpha(opacity='+val*100+')';
            return;
        }
        if(attr=="float"){
            ele.style.cssFloat=val;
            ele.style.styleFloat=val;
            return;
        }
        var reg=/^(width|height|left|top|right|bottom|(margin|padding)(Left|Right|Bottom|Top))$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val+="px";
            }
        }
        ele.style[attr]=val;
    },


    //children:获取ele下所有的元素子节点
    children:function (ele,tagName) {
        var ary=[],nodeList=ele.childNodes;
        if(/MSIE (6|7|8)/i.test(navigator.userAgent)){
            for(var i=0;i<nodeList.length;i++){
                var curNode=nodeList[i];
                curNode.nodeType==1?ary[ary.length]=curNode:null;
                nodeList=null;
            }
        }else{
            ary=Array.prototype.slice.call(ele.children);
        }
        if(typeof tagName=="string"){
            for(var k=0;k<ary.length;k++){
                var curEleNode=ary[k];
                if(curEleNode.nodeName.toUpperCase()==tagName.toUpperCase()){
                    ary.splice(k,1);
                    k--;
                }
            }
        }
        return ary;
    }
}