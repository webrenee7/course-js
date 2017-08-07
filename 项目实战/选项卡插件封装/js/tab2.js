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

        //使用事件委托来优化点击操作
        tabFirst.onclick=function (e) {
            e=e||window.event;
            e.target=e.target||e.srcElement;
            if(e.target.tagName.toLowerCase()==="li"){//说明我当前点击的是li标签
                detailFn.call(e.target,oLis,divList);
            }
        }
        function detailFn(oLis,divList) {
            var index=utils.index(this);
            utils.addClass(this,"selected");
            for(var i=0;i<oLis.length;i++){
                i===index?utils.addClass(divList[i],"selected"):(utils.removeClass(divList[i],"selected"),utils.removeClass(oLis[i],"selected"));
            }
        }
    }
    window.tab=tabChange;
})();

