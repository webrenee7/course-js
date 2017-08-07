/**
 * Created by Administrator on 2016/12/9.
 */
/*
* 选项卡插件化封装
* 只要大结构保持统一，以后实现选项卡的功能，只需要调用这个方法执行即可实现
* container:当前要实现选项卡的这个容器
* defaultIndex:默认选中项的索引
* */
;(function () {
    function tabChange(container,defaultIndex) {
        var tabFirst=utils.firstChild(container),oLis=utils.children(tabFirst),divList=utils.children(container,"div");
        //让defaultIndex对应的页卡有选中的样式
        defaultIndex=defaultIndex||0;
        utils.addClass(oLis[defaultIndex],"selected")
        utils.addClass(divList[defaultIndex],"selected");
        //实现具体的切换
        for(var i=0;i<oLis.length;i++){
            oLis[i].onclick=function () {
                var curSiblings=utils.siblings(this);
                for(var i=0;i<curSiblings.length;i++){
                    utils.removeClass(curSiblings[i],"selected");
                }
                utils.addClass(this,"selected");
                var index=utils.index(this);
                for(var i=0;i<divList.length;i++){
                    i===index?utils.addClass(divList[i],"selected"):utils.removeClass(divList[i],"selected");
                }
            }
        }
    }
    window.tab=tabChange;
})();

