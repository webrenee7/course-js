/**
 * Created by Administrator on 2016/12/5.
 */
var utils={
    win:function (attr,val) {
        if(typeof val==="undefined"){
            return document.documentElement[attr]||document.body[attr];
        }else{
            document.documentElement[attr]=val;
            document.body[attr]=val;
        }
    },
    offset:function (ele) {
        var totalLeft=null,totalTop=null,par=ele.offsetParent;
        totalLeft+=ele.offsetLeft;
        totalTop+=ele.offsetTop;
        if(par){
            if(window.navigator.userAgent.indexOf("MSIE 8")===-1){
                totalLeft+=par.clientLeft;
                totalTop+=par.clientTop;
            }
            totalLeft+=par.offsetLeft;
            totalTop+=par.offsetTop;
            par=par.offsetParent;
        }
        return {left:totalLeft,top:totalTop};
    },
    getElesByClass:function (className,context) {
        context=context||document;
        var eles=context.getElementsByTagName("*");
        var classNameAry=className.replace(/(^ +| +$)/g,"").split(/ +/);
        var ary=[];
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
}