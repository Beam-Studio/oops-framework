
/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:47:56
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-01 13:49:32
 */
import { Node, Vec3 } from "cc";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { ViewUtil } from "../../../../extensions/oops-plugin-framework/assets/core/utils/ViewUtil";
import { ecs } from "../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { MoveToComp } from "../common/ecs/position/MoveTo";
import { RoleChangeJobComp } from "./bll/RoleChangeJob";
import { RoleUpgradeComp } from "./bll/RoleUpgrade";
import { RoleAnimatorType } from "./model/RoleEnum";
import { RoleModelBaseComp } from "./model/RoleModelBaseComp";
import { RoleModelComp } from "./model/RoleModelComp";
import { RoleModelJobComp } from "./model/RoleModelJobComp";
import { RoleModelLevelComp } from "./model/RoleModelLevelComp";
import { RoleViewComp } from "./view/RoleViewComp";
import { RoleViewInfoComp } from "./view/RoleViewInfoComp";

/** 
 * role entity 
 * demand
 * 1. Data structure of character’s basic attributes (unique identifier, name, level, experience, character attributes, etc.)
 * 2. Character’s basic attribute information (strength, agility, life, etc.)
 * 3. Character occupation information (occupation name, additional attributes of occupation)
 * 4. The character needs to have an animation model
 * 5、与玩家互动的玩法（升级、转职、攻击等）
 */
@ecs.register('Role')
export class Role extends CCEntity {
    // data layer
    RoleModel!: RoleModelComp;
    RoleModelBase!: RoleModelBaseComp;          // Initial qualifications for the role
    RoleModelJob!: RoleModelJobComp;
    RoleModelLevel!: RoleModelLevelComp;

    // business layer
    RoleChangeJob!: RoleChangeJobComp;          // Change job
    RoleUpgrade!: RoleUpgradeComp;              // Upgrade
    RoleMoveTo!: MoveToComp;                    // Move

    // view layer
    RoleView!: RoleViewComp;                    // Animation
    RoleViewInfo!: RoleViewInfoComp;            // Property interface

    protected init() {
        // Initialize entity resident ECS components and define entity properties
        this.addComponents<ecs.Comp>(
            RoleModelComp,
            RoleModelBaseComp,
            RoleModelJobComp,
            RoleModelLevelComp);
    }

    /** Job transfer (ECS System processes logic and shares functionally independent business code) */
    changeJob(jobId: number) {
        var rcj = this.add(RoleChangeJobComp);
        rcj.jobId = jobId;
    }

    /** Character upgrade (upgrade only modifies data, automatically binds the interface character life attribute refresh after level change through mvvm levelware) */
    upgrade(lv: number = 0) {
        var ru = this.add(RoleUpgradeComp);
        ru.lv = lv;
    }

    /** Mobile (ECS System processing logic, sharing functionally independent business code)  */
    move(target: Vec3) {
        var move = this.get(MoveToComp) || this.add(MoveToComp);
        move.target = target;
        move.node = this.RoleView.node;
        move.speed = 100;
    }

    destroy(): void {
        // If the component object is created outside the ecs system, it cannot be recycled and the user needs to manually recycle it.
        this.remove(RoleViewComp);
        super.destroy();
    }

    /** Load the role display object (cc.Component is added to the ECS framework after creation, so that any ECS component on the entity can obtain the view layer object through the ECS API */
    load(parent: Node, pos: Vec3 = Vec3.ZERO) {
        var node = ViewUtil.createPrefabNode("game/battle/role");
        var mv = node.getComponent(RoleViewComp)!;
        this.add(mv);

        node.parent = parent;
        node.setPosition(pos);
    }

    /** Attack (the demo has no combat logic, so only one animation is played) */
    attack() {
        this.RoleView.animator.setTrigger(RoleAnimatorType.Attack);
    }
}

// export class EcsRoleSystem extends ecs.System {
//     constructor() {
//         super();

//         this.add(new RoleChangeJobSystem());
//         this.add(new RoleUpgradeSystem());
//     }
// }