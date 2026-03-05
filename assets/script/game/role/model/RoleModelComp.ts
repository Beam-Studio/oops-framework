/*
 * @Author: dgflash
 * @Date: 2021-11-18 15:56:01
 * @LastEditors: dgflash
 * @LastEditTime: 2022-07-25 17:04:37
 */
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { VM } from "../../../../../extensions/oops-plugin-framework/assets/libs/model-view/ViewModel";
import { RoleNumeric } from "./attribute/RoleNumeric";
import { RoleNumericMap } from "./attribute/RoleNumericMap";
import { RoleAttributeType } from "./RoleEnum";

/** 
 * Role attribute data 
 * 
 * Implement function
 * 1. The unique basic data of the character
 * 2. Character combat attribute data
 * 3. Role VM component binding data
 * 
 * technical analysis
 * 1. Use ecs.Comp as the base class of the data layer so that in the subsequent business development process, as long as the ecs.Entity object contains the current data component, you can obtain the data of the corresponding submodule through ecs.Entity.get(RoleModelComp).
 */
@ecs.register('RoleModel')
export class RoleModelComp extends ecs.Comp {
    /** role number */
    id: number = -1;

    private _name: string = "";
    /** Nick name */
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
        this.vm.name = value;
    }

    /** Animation name resources */
    anim: string = "model1";

    /** Role attributes */
    attributes: RoleNumericMap = null!;

    constructor() {
        super();
        this.attributes = new RoleNumericMap(this.vm);
    }

    /** Provides data used by VM components */
    private vm: any = {};

    vmAdd() {
        VM.add(this.vm, "Role");
    }

    vmRemove() {
        VM.remove("Role");
    }

    reset() {
        this.vmRemove();

        this.id = -1;
        this.name = "";

        for (var key in this.vm) {
            this.vm[key] = 0;
        }
    }

    toString() {
        console.log(`[${this.name}] attributes"--------------------------------------------`);
        this.attributes.forEach((value: RoleNumeric, key: RoleAttributeType) => {
            console.log(key, value.value);
        });
    }
}
