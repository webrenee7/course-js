/**
 * Created by xuya on 2016/12/8  最终版.
 */
var utils=(function () {
    //getRandom   获取n-m之间的随机数
    function getRandom(n,m) {
        n=Number(n);
        m=Number(m);
        if(isNaN(n)||isNaN(m)){
            return Math.random();
        }
        if(n>m){
            var temp=n;
            n=m;
            m=temp;
        }
        return Math.round(Math.random()*(m-n)+n);
    }

    //jsonParse   将json字符串转化为json对象
    function jsonParse(jsonStr) {
        return "JSON" in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
    }

    //listToArray   将类数组转化为数组
    function listToArray(likeAry) {
        var ary=[];
        try{
            ary=Array.prototype.slice.call(likeAry);
        }catch (e){
            for(var i=0;i<likeAry.length;i++){
                ary.push(likeAry[i]);
            }
        }
        return ary;
    }

    //offset   获取元素距离body的偏移量（上偏移量/左偏移量）
    function offset(ele) {
        var totalLeft=null,totalTop=null,par=ele.offsetParent;
        totalLeft+=ele.offsetLeft;
        totalTop+=ele.offsetTop;
        if(par){
            if(window.navigator.userAgent.indexOf("MSIE 8")){
                totalLeft+=par.clientLeft;
                totalTop+=par.clientTop;
            }
            totalLeft+=par.offsetLeft;
            totalTop+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:totalLeft,top:totalTop};
    }

    //win   获取浏览器的属性  clientWidth/clientHeight.scrollLeft/scrollTop
    function win(attr,val) {
        if(typeof val==="undefined"){
            return document.documentElement[attr]||document.body[attr];
        }
        document.documentElement[attr]=val;
        document.body[attr]=val;
    }

    //getCss  获取元素的样式
    function getCss(/*ele,*/attr) {
        var val=null;
        if(window.getComputedStyle){//标准浏览器下getComputedStyle是一个方法，
            val=window.getComputedStyle(/*ele*/this)[attr];
        }else{
            if(attr=="opacity"){
                val=/*ele*/this.currentStyle.filter;
                var reg=/^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val=reg.test(val)?reg.exec(val)[1]/100:1;
            }
            val=/*ele*/this.currentStyle[attr];//ie6-8下currentStyle是元素的属性
        }
        var reg=/^-?\d+(?:\.\d+)?(?:px|pt|em|rem|deg)?$/;
        if(reg.test(val)){
            val=parseFloat(val);
        }
        return val;
    }
    //setCss    单独设置元素的样式
    function setCss(/*ele,*/attr,val) {
        if(attr=="opacity"){
            /*ele*/this.style.opacity=val;
            /*ele*/this.style.filter="alpha(opacity="+100*val+")";
            return;
        }
        if(attr=="float"){
            /*ele*/this.style.cssFloat=val;
            /*ele*/this.style.styleFloat=val;
            return;
        }
        var reg=/^(width|height|left|right|top|bottom|(margin|padding)(Left|Right|Top|Bottom)?)$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val+="px";
            }
        }
        /*ele*/this.style[attr]=val;
    }
    //setGroupCss    批量设置元素的样式
    function setGroupCss(/*ele,*/obj) {
        obj=obj||0;//设置obj的默认值，保证后面的代码不报错
        if(obj.toString()==="[object Object]"){
            for(var key in obj){
                setCss.call(/*ele*/this,key,obj[key]);
            }
        }
    }
    //css    获取/设置（单独/批量）元素的样式
    function css(ele) {
        var secondParamer=arguments[1];
        var thirdParamer=arguments[2];
        var argumentsAry=utils.listToArray(arguments).splice(1);
        if(typeof secondParamer==="string"){//第二个参数为字符串
            if(typeof thirdParamer==="undefined"){//第三个参数没传
                return getCss.apply(ele,argumentsAry);//获取元素的样式
            }
            setCss.apply(ele,argumentsAry);//第三个参数传了，设置一个样式
        }

        thirdParamer=thirdParamer||0;//设置默认值，保证第三个参数不传值时不报错
        if(secondParamer.toString()=="[object Object]"){//第三个参数是对象
            setGroupCss.apply(ele,argumentsAry);//设置一组样式
        }
    }

    //getElesByClass    获取指定类名的元素
    function getElesByClass(className,context) {
        context=context||document;
        var eles=context.getElementsByTagName("*");
        var classNameAry=className.replace(/(^ +| +$)/g,"").split(/ +/);
        var ary=[];
        //遍历所有元素，如果当前元素的类名中，指定的类名都有，就把当前元素加入空数组中
        for(var i=0;i<eles.length;i++){
            var curEle=eles[i];
            var isPass=true;
            for(var j=0;j<classNameAry.length;j++){
                var curClass=classNameAry[j];
                var reg=new RegExp("(^| +)"+curClass+"( +|$)");
                if(!reg.test(curEle.className)){
                    isPass=false;
                    break;
                }
            }
            if(isPass){
                ary.push(curEle);
            }
        }
        return ary;
    }

    //children    获取所有的元素子节点
    function children(ele,tagName) {
        var ary=[],nodeList=ele.childNodes;
        if(!/MSIE (6|7|8)/.test(window.navigator.userAgent)){
            ary=Array.prototype.slice.call(ele.children);
        }else{
            for(var i=0;i<nodeList.length;i++){
                var curNode=nodeList[i];
                ary[ary.length]=curNode.nodeType==1?curNode:null;
            }
        }
        if(typeof tagName=="string"){
            for(var j=0;j<ary.length;j++){
                var curEleNode=ary[j];
                if(curEleNode.nodeName.toUpperCase()!==tagName.toUpperCase()){
                    ary.splice(j,1);
                    j--;
                }
            }
        }
        return ary;
    }

    //prev    获取上一个哥哥元素节点
    function prev(ele) {
        if(ele.previousElementSibling){
            return ele.previousElementSibling;
        }
        var pre=ele.previousSibling;
        while(pre&&pre.nodeType!=1){//只要哥哥节点存在，并且不是元素节点就继续查找
            pre=pre.previousSibling;
        }
        return pre;
    }

    //next    获取下一个弟弟元素节点
    function next(ele) {
        if(ele.nextElementSibling){
            return ele.nextElementSibling;
        }
        var nex=ele.nextSibling;
        while(nex&&nex.nodeType!=1){
            nex=nex.nextSibling;
        }
        return nex;
    }

    //prevAll    获取所有的哥哥元素节点
    function prevAll(ele) {
        var ary=[];
        var pre=prev(ele);
        while(pre){//只要哥哥节点存在，就把找到的哥哥节点放到数组开头，并且继续查找上一个哥哥节点
            ary.unshift(pre);
            pre=prev(pre);
        }
        return ary;
    }

    //nextAll    获取所有的弟弟元素节点
    function nextAll(ele) {
        var ary=[];
        var nex=next(ele);
        while(nex){//只要弟弟节点存在，就把找到的弟弟节点放到数组末尾，并且继续查找下一个弟弟节点
            ary.push(nex);
            nex=next(nex);
        }
        return ary;
    }

    //sibling    获取与当前元素相邻的两个元素节点
    function sibling(ele) {
        var ary=[];
        var pre=prev(ele);
        var nex=next(ele);
        pre?ary.push(pre):null;
        nex?ary.push(nex):null;
        return ary;
    }

    //siblings    获取所有的兄弟元素节点
    function siblings(ele) {
        return prevAll(ele).concat(nextAll(ele));
    }

    //index    获取当前元素的索引
    function index(ele) {
        return prevAll(ele).length;
    }

    //firstChild    获取第一个元素子节点
    function firstChild(ele) {
        var chs=children(ele);
        return chs.length>0?chs[0]:null;
    }

    //lastChild    获取最后一个元素子节点
    function lastChild(ele) {
        var chs=children(ele);
        return chs.length>0?chs[chs.length-1]:null;
    }

    //append    向指定容器末尾追加元素
    function append(ele,container) {
        container.appendChild(ele);
    }

    //prepend    向指定容器开头追加元素
    function prepend(ele,container) {
        var fir=firstChild(container);
        if(fir){
            container.insertBefore(ele,fir);
            return;
        }
        container.appendChild(ele);
    }

    //insertBefore  向容器中指定元素开头追加
    function insertBefore(oldEle,newEle) {
        oldEle.parentNode.insertBefore(newEle,oldEle);
    }

    //insertAfter    向容器中指定元素末尾追加
    function insertAfter(oldEle,newEle) {
        var nex=next(oldEle);
        if(nex){
            oldEle.parentNode.insertBefore(newEle,nex);
            return;
        }else{
            oldEle.parentNode.appendChild(newEle);
        }
    }

    //hasClass    判断元素是否存在某个样式类名
    function hasClass(ele,className) {
        var reg=new RegExp("(^| +)"+className+"( +|$)");
        return reg.test(ele.className);
    }

    //addClass    给元素添加类名(可以添加多个)
    function addClass(ele,className) {
        var ary=className.replace(/(^ +| +$)/g,"").split(/ +/);
        for(var i=0;i<ary.length;i++){
            var curName=ary[i];
            if(!hasClass(ele,curName)){//如果类名不存在，才添加
                ele.className+=" "+curName;
            }
        }
    }

    //removeClass  删除元素的类名(可以删除多个)
    function removeClass(ele,className) {
        var ary=className.replace(/(^ +| +$)/g,"").split(/ +/);
        for(var i=0;i<ary.length;i++){
            var curName=ary[i];
            if(hasClass(ele,curName)){//如果类名存在，才删除
                var reg=new RegExp("(^| +)"+curName+"( +|$)","g");
                ele.className=ele.className.replace(reg," ");
            }
        }
    }

    return{
        getRandom:getRandom,
        jsonParse:jsonParse,
        listToArray:listToArray,
        offset:offset,
        win:win,
        /*getCss:getCss,
         setCss:setCss,
         setGroupCss:setGroupCss,*/
        css:css,
        getElesByClass:getElesByClass,
        children:children,
        prev:prev,
        next:next,
        prevAll:prevAll,
        nextAll:nextAll,
        sibling:sibling,
        siblings:siblings,
        index:index,
        firstChild:firstChild,
        lastChild:lastChild,
        append:append,
        prepend:prepend,
        insertBefore:insertBefore,
        insertAfter:insertAfter,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass
    }
})();
