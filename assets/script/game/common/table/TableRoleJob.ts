
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TableRoleJob {
    static TableName: string = "RoleJob";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableRoleJob.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** Number【key】 */
    id: number = 0;

    /** Occupational name */
    get armsName(): string {
        return this.data.armsName;
    }
    /** Weapon type */
    get weaponType(): any {
        return this.data.weaponType;
    }
    /** strength */
    get power(): number {
        return this.data.power;
    }
    /** agile */
    get agile(): number {
        return this.data.agile;
    }
}
    