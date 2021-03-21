// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

//#region strategy
abstract class AI {
    abstract attack(skills:number[]):number;
}

class AIRandom extends AI {
    attack(skills:number[]):number {
        let skill = Math.floor(Math.random() * skills.length);
        return skills[skill];
    }
}

class AIEasy extends AI {
    attack(skills:number[]):number {
        return skills[0];
    }
}

class AINormal extends AI {
    attack(skills:number[]):number {
        return skills[1];
    }
}

class AIHard extends AI {
    attack(skills:number[]):number {
        return skills[2];
    }
}
//#endregion

//#region role
class Role {
    //#region P
    skills = [
        100, 200, 500,
    ];

    ai:AI;

    hp = 1000;
    //#endregion

    //#region F
    attack():number {
        if (this.ai) {
            return this.ai.attack(this.skills);
        }

        return 0;
    }
    //#endregion

}
//#endregion

export enum AIType {
    Random,
    Easy,
    Normal,
    Hard,
}

@ccclass
export default class Strategy extends cc.Component {
    //#region P
    @property({
        type: cc.Enum(AIType)
    })
    monsterAI = AIType.Easy;
    //#endregion

    //#region M
    start() {
        let player = new Role();
        let monster = new Role();

        player.ai = new AIRandom();

        // 可封装为工厂
        let ai:AI = null;
        switch (this.monsterAI) {
        case AIType.Random:
            ai = new AIRandom();
            break;
        case AIType.Easy:
            ai = new AIEasy();
            break;
        case AIType.Normal:
            ai  = new AINormal();
            break;
        case AIType.Hard:
            ai = new AIHard();
            break;
        }

        monster.ai = ai;

        // 简单战斗过程
        do {
            let dmg = player.attack();
            monster.hp -= dmg;
            cc.log(`player attack monster: hp - ${dmg} = ${monster.hp}`);
            if (monster.hp <= 0) {
                cc.log(`player win.`);
                break;
            }

            dmg = monster.attack();
            player.hp -= dmg;
            cc.log(`monster attack player: hp - ${dmg} = ${player.hp}`);
            if (player.hp <= 0) {
                cc.log(`monster win.`);
                break;
            }
        } while (true);
    }
    //#endregion
}
