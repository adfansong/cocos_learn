// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

//#region role
class Role {
    //#region P
    hpMax = 1000;
    hp:number;

    // 模拟战斗：每秒掉血百分比
    hpSubPerSec:number;
    //#endregion

    //#region F
    getName():string {
        return 'role';
    }

    getHpRatio():number {
        return this.hp / this.hpMax;
    }

    init() {
        this.hp = this.hpMax;
    }

    update(dt:number) {
        // 要扩展的方法
        this.hp = Math.floor(this.hp - dt * this.hpMax * this.hpSubPerSec);
        if (this.hp < 0) {
            this.hp = 0;
        }
    }
    //#endregion
}

class Player extends Role {
    //#region P
    hpMax = 2000;
    hpSubPerSec = 0.1;
    //#endregion

    //#region F
    getName():string {
        return 'player';
    }
    //#endregion
}

class Pet extends Role {
    //#region P
    hpMax = 1500;
    hpSubPerSec = 0.15;
    //#endregion

    //#region F
    getName():string {
        return 'pet';
    }
    //#endregion
}

class Monster extends Role {
    //#region P
    hpMax = 2000;
    hpSubPerSec = 0.2;
    //#endregion

    //#region F
    getName():string {
        return 'monster';
    }
    //#endregion
}
//#endregion

//#region decorator
class UIRole extends Role {
    //#region P
    label:cc.Label;
    prog:cc.ProgressBar;

    role:Role;
    //#endregion

    //#region F
    update(dt:number) {
        // 调用角色基础功能
        this.role.update(dt);

        // 扩展的功能
        this.label.string = this.role.getName() + ' ' + this.role.hp;
        this.prog.progress = this.role.getHpRatio();
    }
    //#endregion
}
//#endregion

@ccclass
export default class Decorator extends cc.Component {
    //#region P
    @property({
        type: [cc.Label],
    })
    labels:cc.Label[] = [];

    @property({
        type: [cc.ProgressBar],
    })
    progs:cc.ProgressBar[] = [];

    uiRoles:Role[];
    //#endregion    

    //#region M
    start() {
        let roles:Role[] = [];
        roles.push(new Player());
        roles.push(new Pet());
        roles.push(new Monster());

        this.uiRoles = [];

        for (let i = 0; i < roles.length; ++i) {
            let ui = new UIRole();
            ui.role = roles[i];
            ui.role.init();

            ui.label = this.labels[i];
            ui.prog = this.progs[i];

            this.uiRoles.push(ui);
        }
    }

    update(dt) {
        if (this.uiRoles) {
            for (let i = 0; i < this.uiRoles.length; ++i) {
                this.uiRoles[i].update(dt);
            }
        }
    }
    //#endregion
}
