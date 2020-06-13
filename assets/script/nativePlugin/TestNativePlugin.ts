// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestNativePlugin extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let w = window as any;
        w.__native = (s:string)=>{
            cc.log('native msg:', s);

            let arr = s.split(';');

            let type = arr[0];
            if (type == 'test_ok') {
                this.label.string = 'test ok:' + arr[1];
            }
        };
    }

    start () {
        this.sendMsgToPlugin('test');
    }

    
    //#region F
    sendMsgToPlugin(msg:string) {
        if (CC_JSB) {
            let os = cc.sys.os;

            if (os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod('com/bw/plugin/NativePlugin', 'sendMsgToPlugin', '(Ljava/lang/String;)V', msg);
            } else if (os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod('APIObject', 'sendMsgToPlugin:', msg);
            }
        }
    }
    //#endregion
}
