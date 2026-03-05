/*
 * @Author: dgflash
 * @Date: 2022-06-02 09:38:48
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:55:46
 */
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { RoleAttributeType } from "../model/RoleEnum";
import { RoleModelLevelComp } from "../model/RoleModelLevelComp";
import { Role } from "../Role";

/**
 * Character upgrade
 */
@ecs.register('RoleUpgrade')
export class RoleUpgradeComp extends ecs.Comp {
    /** current level */
    lv: number = 0;

    reset() {
        this.lv = 0;
    }
}

@ecs.register('Role')
export class RoleUpgradeSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoleUpgradeComp, RoleModelLevelComp);
    }

    entityEnter(e: Role): void {
        let rm = e.RoleModel;
        let rlm = e.RoleModelLevel;
        let ru = e.RoleUpgrade;

        if (ru.lv == 0)
            rlm.vm.lv++;                   // Promote one level
        else
            rlm.vm.lv = ru.lv;             // Set level

        // Current level configuration
        rlm.rtluCurrent.init(rlm.vm.lv);
        // Level additional attributes
        rm.attributes.get(RoleAttributeType.hp).level = rlm.rtluCurrent.hp;

        // Next level configuration
        rlm.rtluNext.init(rlm.vm.lv + 1);
        rlm.vm.expNext = rlm.rtluNext.needexp;

        e.remove(RoleUpgradeComp);
    }
}