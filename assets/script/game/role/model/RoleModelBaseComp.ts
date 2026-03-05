/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:54:43
 */

import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";
import { RoleAttributeType } from "./RoleEnum";
import { RoleModelComp } from "./RoleModelComp";

/**
 * Character basic attribute data
 * 
 * Implement function
 * 1. Characters have random basic combat attributes when they are initially created.
 * 2. Basic combat attributes will display values independently.
 * 
 * technical analysis
 * 1. An extensible role combat attribute object is designed in RoleModelComp.attributes. A basic attribute object is separated here to generate the data format required by the VM component and assist the display logic of the view layer.
 * 2. The purpose of this design is not to insert VM data for basic attributes into the RoleModelComp object. It is expressed here that when new requirements are added, try to use incremental development without affecting the original functions. When a project has more and more code, it is not easy to cause new problems by ignoring a certain point.
 */
@ecs.register('RoleModelBase')
export class RoleModelBaseComp extends ecs.Comp {
    /** Provides data used by VM components */
    private vm: any = {};

    /** strength */
    private _power: number = 0;
    public get power(): number {
        return this._power;
    }
    public set power(value: number) {
        this._power = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.power).base = value;
        this.vm[RoleAttributeType.power] = value;
    }

    /** constitution */
    private _physical: number = 0;
    public get physical(): number {
        return this._physical;
    }
    public set physical(value: number) {
        this._physical = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.physical).base = value;
        this.vm[RoleAttributeType.physical] = value;
    }

    /** agile */
    private _agile: number = 0;
    public get agile(): number {
        return this._agile;
    }
    public set agile(value: number) {
        this._agile = value;
        this.ent.get(RoleModelComp).attributes.get(RoleAttributeType.agile).base = value;
        this.vm[RoleAttributeType.agile] = value;
    }

    vmAdd() {
        VM.add(this.vm, "RoleBase");
    }

    vmRemove() {
        VM.remove("RoleBase");
    }

    reset() {
        this.vmRemove();

        for (var key in this.vm) {
            this.vm[key] = 0;
        }
    }
}