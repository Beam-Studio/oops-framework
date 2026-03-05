/*
 * @Author: dgflash
 * @Date: 2021-11-11 17:45:23
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-01 13:49:37
 */

import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { GameEvent } from "../common/config/GameEvent";
import { AccountNetDataComp, AccountNetDataSystem } from "./bll/AccountNetData";
import { AccountModelComp } from "./model/AccountModelComp";

/**
 * Account module
 * 1. Connect to the game server
 * 2. Log in to the player account and obtain player information
 * 3. Disconnect and reconnect
 */
@ecs.register('Account')
export class Account extends ecs.Entity {
    AccountModel!: AccountModelComp;
    AccountNetData!: AccountNetDataComp;

    protected init() {
        this.addComponents<ecs.Comp>(AccountModelComp);
        this.addEvent();
    }

    destroy(): void {
        this.removeEvent();
        super.destroy();
    }

    /** Add global message event */
    private addEvent() {
        oops.message.on(GameEvent.GameServerConnected, this.onHandler, this);
    }

    /** Remove global message event */
    private removeEvent() {
        oops.message.off(GameEvent.GameServerConnected, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.GameServerConnected:
                this.getPlayer();
                break;
        }
    }

    /** Connect to game server */
    connect() {
        // netChannel.gameCreate();
        // netChannel.gameConnect();

        // Test the code when there is no network. When there is a network, the subsequent process will be connected by triggering the network connection success event.
        oops.message.dispatchEvent(GameEvent.GameServerConnected)
    }

    /** Get player information */
    getPlayer() {
        this.add(AccountNetDataComp);
    }
}

// export class EcsAccountSystem extends ecs.System {
//     constructor() {
//         super();

//         this.add(new AccountNetDataSystem());
//     }
// }
