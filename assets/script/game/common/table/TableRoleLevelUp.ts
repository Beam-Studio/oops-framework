
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TableRoleLevelUp {
    static TableName: string = "RoleLevelUp";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableRoleLevelUp.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** Number【key】 */
    id: number = 0;

    /** Experience required to upgrade */
    get needexp(): number {
        return this.data.needexp;
    }
    /** Upgrade to increase life */
    get hp(): number {
        return this.data.hp;
    }
}
    