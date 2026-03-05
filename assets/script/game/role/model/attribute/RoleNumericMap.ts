/*
 * @Author: dgflash
 * @Date: 2022-01-21 09:33:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-09 12:16:28
 */
import { RoleAttributeType } from "../RoleEnum";
import { RoleNumeric } from "./RoleNumeric";

/** Character value decorator */
export class RoleNumericDecorator {
    /** Property type */
    attribute: RoleAttributeType = null!;
    /** Attribute value */
    value: number = 0;
}

/** Collection of all module role attributes */
export class RoleNumericMap {
    /** Role attributes */
    private attributes: Map<RoleAttributeType, RoleNumeric> = new Map();
    /** Character attribute modifier */
    private decorators: Map<RoleNumericDecorator, number> = new Map();
    /** Vm component data */
    private vm: any = null!;

    constructor(vm: any) {
        this.vm = vm;
    }

    /** Add property modifier */
    addDecorator(rnd: RoleNumericDecorator) {
        this.decorators.set(rnd, rnd.value);
        var rn = this.get(rnd.attribute);
        rn.decorator += rnd.value;
    }

    /** Remove property decorators */
    removeDecorator(rnd: RoleNumericDecorator) {
        this.decorators.delete(rnd);
        var rn = this.get(rnd.attribute);
        rn.decorator -= rnd.value;
    }

    /** Get role attributes */
    get(type: RoleAttributeType): RoleNumeric {
        var attr = this.attributes.get(type);
        if (attr == null) {
            switch (type) {
                case RoleAttributeType.physical:
                    attr = new RoleNumericPhysical(type, this);
                    break;
                default:
                    attr = new RoleNumeric(type, this);
                    break;
            }
            this.attributes.set(type, attr);

            attr.onUpdate = (rn: RoleNumeric) => {
                this.vm[rn.type] = rn.value;
            };
        }
        return attr;
    }

    forEach(callbackfn: (value: RoleNumeric, key: RoleAttributeType, map: Map<RoleAttributeType, RoleNumeric>) => void, thisArg?: any): void {
        this.attributes.forEach(callbackfn, thisArg);
    }

    /** Reset property value to zero */
    reset() {
        this.decorators.clear();
        this.attributes.forEach((value: RoleNumeric, key: RoleAttributeType, map: Map<RoleAttributeType, RoleNumeric>) => {
            value.reset();
        });
    }
}

/** Physical attributes */
export class RoleNumericPhysical extends RoleNumeric {
    protected update(): void {
        super.update();

        // Each point of constitution = 0.5 life
        this.attributes.get(RoleAttributeType.hp).base = Math.floor(this.value * 0.5);
    }
}