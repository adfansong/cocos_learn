// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

//#region thing
class Thing {
    tid:string;

    getDesc():string {
        return `thing ${this.tid}`;
    }
}

class Skill extends Thing {
    getDesc():string {
        return `skill ${this.tid}`;
    }
}

class Equip extends Thing {
    getDesc():string {
        return `equip ${this.tid}`;
    }
}

class Item extends Thing {
    getDesc():string {
        return `item ${this.tid}`;
    }
}
//#endregion

//#region factory
class ThingFactory {
    static create(tid:string):Thing {
        let type = Number(tid[0]);
        let t:Thing = null;

        switch (type) {
        case 1:
            t = new Skill();
            break;
        case 2:
            t = new Equip();
            break;
        case 3:
            t = new Item();
            break;
        default:
            t = new Thing();
            break;
        }

        if (t) {
            t.tid = tid;
        }

        return t;
    }
}
//#endregion

@ccclass
export default class Factory extends cc.Component {
    //#region P
    @property({
        type: [cc.String]
    })
    tids:string[] = [];
    //#endregion

    //#region M
    start() {
        for (let i = 0; i < this.tids.length; ++i) {
            let t = ThingFactory.create(this.tids[i]);
            
            cc.log('add thing:', t.getDesc());
        }
    }
    //#endregion
}
