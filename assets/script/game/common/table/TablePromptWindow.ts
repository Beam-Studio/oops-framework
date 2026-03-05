
import { JsonUtil } from "../../../../../extensions/oops-plugin-framework/assets/core/utils/JsonUtil";

export class TablePromptWindow {
    static TableName: string = "PromptWindow";

    private data: any;

    init(id: number, id1: number, id2: number) {
        var table = JsonUtil.get(TablePromptWindow.TableName);
        this.data = table[id][id1][id2];
        this.id = id;
        this.id1 = id1;
        this.id2 = id2;
    }

    /** Number【key】 */
    id: number = 0;
    /** Double primary key [key] */
    id1: number = 0;
    /** Double primary key [key] */
    id2: number = 0;

    /** title */
    get title(): string {
        return this.data.title;
    }
    /** describe */
    get describe(): string {
        return this.data.describe;
    }
    /** describe */
    get array(): any {
        return this.data.array;
    }
    /** life */
    get hp(): number {
        return this.data.hp;
    }
}
    