
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TableLanguage {
    static TableName: string = "Language";

    private data: any;

    init(id: number) {
        var table = JsonUtil.get(TableLanguage.TableName);
        this.data = table[id];
        this.id = id;
    }

    /** Number【key】 */
    id: number = 0;

    /** Simplified Chinese */
    get zh(): string {
        return this.data.zh;
    }
    /** English */
    get en(): string {
        return this.data.en;
    }
}
    