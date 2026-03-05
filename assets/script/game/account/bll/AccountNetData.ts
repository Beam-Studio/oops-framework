/*
 * @Author: dgflash
 * @Date: 2021-11-23 15:51:15
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-25 17:03:54
 */

import { v3 } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { GameEvent } from "../../common/config/GameEvent";
import { Role } from "../../role/Role";
import { Account } from "../Account";
import { AccountModelComp } from "../model/AccountModelComp";

/** Request player game data */
@ecs.register('AccountNetData')
export class AccountNetDataComp extends ecs.Comp {
    reset() { }
}

/** Request player game data */
@ecs.register('Account')
export class AccountNetDataSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(AccountNetDataComp, AccountModelComp);
    }

    entityEnter(e: Account): void {
        let onComplete = {
            target: this,
            callback: (data: any) => {
                // Set a locally stored user ID (for next login without entering an account)
                this.setLocalStorage(data.id);

                // Create player character object
                this.createRole(e, data);

                // Player login success event
                oops.message.dispatchEvent(GameEvent.LoginSuccess);
            }
        }

        // Offline testing code begins
        var data = {
            id: 1,
            name: "Oops",
            power: 10,
            agile: 10,
            physical: 10,
            lv: 1,
            jobId: 1
        }
        onComplete.callback(data);
        // End of offline test code

        e.remove(AccountNetDataComp);
    }

    /** Create role objects (custom logic) */
    private createRole(e: Account, data: any) {
        var role = ecs.getEntity<Role>(Role);

        // character data
        role.RoleModel.id = data.id;
        role.RoleModel.name = data.name;

        // Character's initial combat attributes
        role.RoleModelBase.power = data.power;
        role.RoleModelBase.agile = data.agile;
        role.RoleModelBase.physical = data.physical;

        // Character level data
        role.upgrade(data.lv);

        // Character career data
        role.RoleModelJob.id = data.jobId;

        // The basic attributes of the character are bound to be displayed on the interface
        role.RoleModel.vmAdd();
        // Character level attributes are bound to be displayed on the interface
        role.RoleModelLevel.vmAdd();
        // The initial basic attributes of the character are bound to be displayed on the interface.
        role.RoleModelBase.vmAdd();

        // Character animation display object
        role.load(oops.gui.game, v3(0, -300, 0));

        e.AccountModel.role = role;
    }

    /** Set a locally stored user ID */
    private setLocalStorage(uid: string) {
        oops.storage.setUser(uid);
        oops.storage.set("account", uid);
    }
}