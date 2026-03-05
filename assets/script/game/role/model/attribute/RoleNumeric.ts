/*
 * @Author: dgflash
 * @Date: 2022-01-20 18:20:32
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-09 13:11:39
 */

import { RoleAttributeType } from "../RoleEnum";
import { RoleNumericMap } from "./RoleNumericMap";

/** Modules that affect character attributes */
export enum RoleModuleType {
    /** initial default properties */
    Base,
    /** Career additional attributes */
    Job,
    /** Level additional attributes */
    Level,
    /** Equipment additional attributes */
    Equip,
    /** Modifier attached properties */
    Decorator,
    /** Skill additional attributes */
    Skill
}

/** 
 * role attribute object
 * 1. Different module settings corresponding attribute values
 * 2. When the attribute value of any module is modified, the automatically updated numerical value of the character attribute and
 */
export class RoleNumeric {
    /** Numeric update event */
    onUpdate: Function = null!

    /** Property type */
    type: RoleAttributeType = null!;

    /** The total value of the added value of each module */
    value: number = 0;

    /** attribute value collection */
    protected attributes: RoleNumericMap;
    /** Group different module values */
    protected values: Map<RoleModuleType, number> = new Map();

    constructor(type: RoleAttributeType, attributes: RoleNumericMap) {
        this.type = type;
        this.attributes = attributes;

        // Set initial value
        var rmt = RoleModuleType;
        for (var key in rmt) {
            var k = Number(key);
            if (k > -1) this.values.set(k, 0);
        }
    }

    /** Get the specified module attribute value */
    protected getValue(module: RoleModuleType) {
        return this.values.get(module);
    }

    /** Set the specified module attribute value */
    protected setValue(module: RoleModuleType, value: number) {
        this.values.set(module, value);
        this.update();
    }

    protected update() {
        var result = 0;
        this.values.forEach(value => {
            result += value;
        });
        this.value = result;

        this.onUpdate && this.onUpdate(this);
    }

    reset() {
        this.values.clear();
        this.update();
    }

    /** Character basic attributes */
    get base(): number {
        return this.getValue(RoleModuleType.Base)!;
    }
    set base(value: number) {
        this.setValue(RoleModuleType.Base, value);
    }

    /** Level attribute */
    get level(): number {
        return this.getValue(RoleModuleType.Level)!;
    }
    set level(value: number) {
        this.setValue(RoleModuleType.Level, value);
    }

    /** Character professional attributes */
    get job(): number {
        return this.getValue(RoleModuleType.Job)!;
    }
    set job(value: number) {
        this.setValue(RoleModuleType.Job, value);
    }

    /** Character equipment attributes */
    get equip(): number {
        return this.getValue(RoleModuleType.Equip)!;
    }
    set equip(value: number) {
        this.setValue(RoleModuleType.Equip, value);
    }

    /** Decorator properties */
    get decorator(): number {
        return this.getValue(RoleModuleType.Decorator)!;
    }
    set decorator(value: number) {
        this.setValue(RoleModuleType.Decorator, value);
    }

    /** Skill additional attributes */
    get skill(): number {
        return this.getValue(RoleModuleType.Skill)!;
    }
    set skill(value: number) {
        this.setValue(RoleModuleType.Skill, value);
    }
}