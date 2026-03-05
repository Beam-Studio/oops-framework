/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:55:01
 */

import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";
import { TableRoleLevelUp } from "../../common/table/TableRoleLevelUp";

/**
 * Character level data
 * 
 * Implement function
 * 1. When the character level changes, the added life value in the upgrade configuration table is obtained and superimposed on the character attributes.
 * 
 * technical analysis
 * 1. The level module directly obtains the local level configuration table data through the API of the data access layer, and matches the level configuration data in the configuration table through the current level.
 * 2. The added value of life in the obtained level configuration data is superimposed on the added value of the level module of the character’s combat attributes.
 */
@ecs.register('RoleModelLevel')
export class RoleModelLevelComp extends ecs.Comp {
    /** Next level configuration */
    rtluNext: TableRoleLevelUp = new TableRoleLevelUp();
    /** Current level configuration */
    rtluCurrent: TableRoleLevelUp = new TableRoleLevelUp();

    /** Provides data used by VM components */
    vm: RoleLevelVM = new RoleLevelVM();

    vmAdd() {
        VM.add(this.vm, "RoleLevel");
    }

    vmRemove() {
        this.vm.reset();
        VM.remove("RoleLevel");
    }

    reset() {
        this.vmRemove();
    }
}

class RoleLevelVM {
    /** current level */
    lv: number = 0;
    /** Current experience */
    exp: number = 0;
    /** Subordinate experience */
    expNext: number = 0;

    reset() {
        this.lv = 0;
        this.exp = 0;
        this.expNext = 0;
    }
}