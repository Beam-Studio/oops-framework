/*
 * @Author: dgflash
 * @Date: 2022-01-25 17:49:26
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-21 16:49:00
 */

import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { RoleModelJobComp } from "../model/RoleModelJobComp";
import { Role } from "../Role";
import { RoleEvent } from "../RoleEvent";

/**
 * Role transfer
 * 
 * Implement function
 * 1. Modify the career data of the character career sub-module
 * 2. Automatically update the superposition value of the character's combat attribute multi-module through the combat attribute framework.
 * 3. Switch professional weapons for character animations
 * 
 * technical analysis
 * 1. Using ecs.Comp as the interface for business input parameters can be understood as an object member method receiving method parameters. Through the characteristics of the ecs framework, the ecs.System system will monitor changes in the data components it is concerned about and perform corresponding business processing.
 * 2. When adding the career switching component to the role entity, the business logic processing is triggered. After completion, the business component is removed from the role entity to complete the business life cycle.
 */
@ecs.register('RoleChangeJob')
export class RoleChangeJobComp extends ecs.Comp {
    /** Occupation number */
    jobId: number = -1;

    reset() {
        this.jobId = -1;
    }
}

@ecs.register('Role')
export class RoleChangeJobSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoleChangeJobComp, RoleModelJobComp);
    }

    entityEnter(e: Role): void {
        // Value update
        e.RoleModelJob.id = e.RoleChangeJob.jobId;

        // Job transfer event notifies the view layer logic to refresh the interface effect, realizing the separation of the two layers of logic
        oops.message.dispatchEvent(RoleEvent.ChangeJob);

        e.remove(RoleChangeJobComp);
    }
}