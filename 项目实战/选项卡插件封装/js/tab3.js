/**
 * Created by Administrator on 2016/12/9.
 */
function TabChange(container,defaultIndex) {
    return this.init(container,defaultIndex);
}
TabChange.prototype={
    constructor:TabChange,
    //按照索引设置默认选中的样式
    defaultIndexEvent:function () {
        utils.addClass(this.oLis[this.defaultIndex],"selected")
        utils.addClass(this.divList[this.defaultIndex],"selected");
    },
    //事件委托，实现绑定切换
    liveClick:function () {
        var _this=this;
        this.tabFirst.onclick=function (e) {
            e=e||window.event;
            e.target=e.target||e.srcElement;
            if(e.target.tagName.toLowerCase()==="li"){//说明我当前点击的是li标签
                _this.detailFn(e.target);
            }
        }
    },
    detailFn:function (curEle) {
        var index=utils.index(curEle);
        utils.addClass(curEle,"selected");
        for(var i=0;i<this.oLis.length;i++){
            i===index?utils.addClass(this.divList[i],"selected"):(utils.removeClass(this.divList[i],"selected"),utils.removeClass(this.oLis[i],"selected"));
        }
    },
    //初始化，也是当前插件的唯一入口
    init:function (container,defaultIndex) {
        this.container=container||null;
        this.defaultIndex=defaultIndex||0;
        this.tabFirst=utils.firstChild(this.container);
        this.oLis=utils.children(this.tabFirst);
        this.divList=utils.children(this.container,"div");
        this.defaultIndexEvent();
        this.liveClick();
        return this;
    }
}