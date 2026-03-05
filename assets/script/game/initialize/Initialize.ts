/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-01 13:49:35
 */
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { Account } from "../account/Account";
import { InitResComp } from "./bll/InitRes";

/**
 * The game enters the initialization module
 * 1. Hot update
 * 2. Load default resources
 */
@ecs.register('Initialize')
export class Initialize extends CCEntity {
    /** Account management */
    account: Account = null!;

    protected init() {
        // The account module is the sub-entity object of the initialization module
        this.account = ecs.getEntity<Account>(Account);
        this.addChild(this.account);

        // Initialize game public resources
        this.add(InitResComp);
    }
}

// export class EcsInitializeSystem extends ecs.System {
//     constructor() {
//         super();

//         this.add(new InitResSystem());
//     }
// }