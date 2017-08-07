/**
 * Created by Administrator on 2016/12/25.
 */
var sportMain = utils.getElesByClass("sport_main")[0];
var anchor_box = utils.getElesByClass("anchor_box")[0];
var lis = anchor_box.getElementsByTagName("li");
var screenH = utils.win("clientHeight");
var step2 = 0;
var isOkWheel = true;
addWheelEventListener(sportMain, function (isDown, e) {
    var target=null;
    if (isOkWheel) {
        if (isDown) {
            step2++;
            if (step2 >= (lis.length - 1)) {
                step2 = 11;
                target={top: -10 * screenH - 206};
                return;
            }
            target={top:-step2 * screenH};
        } else {
            if (step2 == 0) {
                return;
            }
            if (step2 >= (lis.length - 1)) {
                step2--;
                target={top: -10 * screenH};
                return;
            }
            step2--;
            target={top: -step2 * screenH};
        }
        animate({
            ele: sportMain, target: target, callback: function () {
                isOkWheel = true;
            }, duration: 200
        });
        isOkWheel = false;
        anchorAlign();
    }
});
function anchorAlign() {
    for (var i = 0; i < lis.length; i++) {
        lis[i].className = i == step2 ? "cur" : "";
    }
}
for (var i = 0; i < lis.length - 1; i++) {
    lis[i].index = i;
    lis[i].onclick = function () {
        step2 = this.index;
        animate({ele: sportMain, target: {top: -step2 * screenH}, duration: 200});
        anchorAlign();
    };
}