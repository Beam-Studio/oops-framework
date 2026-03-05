/*
 * @Author: dgflash
 * @Date: 2021-11-24 10:04:56
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:54:52
 */
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { TableRoleJob } from "../../common/table/TableRoleJob";
import { RoleAttributeType } from "./RoleEnum";
import { RoleModelComp } from "./RoleModelComp";

/** 
 * Character career data 
 * 
 * Implement function
 * 1. Affects the character’s strength and agility combat attributes
 * 2. Weapons that affect character animation
 */
@ecs.register('RoleModelJob')
export class RoleModelJobComp extends ecs.Comp {
    private table: TableRoleJob = new TableRoleJob();

    /** Occupational code number */
    private _id: number = -1;
    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this.table.init(value);
        this._id = value;

        var attributes = this.ent.get(RoleModelComp).attributes;
        attributes.get(RoleAttributeType.power).job = this.power;
        attributes.get(RoleAttributeType.agile).job = this.agile;
    }
    /** Occupational name */
    get armsName(): string {
        return this.table.armsName;
    }
    /** strength */
    get power(): number {
        return this.table.power;
    }
    /** agile */
    get agile(): number {
        return this.table.agile;
    }
    /** Weapon type */
    get weaponType(): number[] {
        return this.table.weaponType;
    }

    reset() {
        this._id = -1;
    }
}