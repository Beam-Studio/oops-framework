/*
 * @Author: dgflash
 * @Date: 2022-07-22 17:06:22
 * @LastEditors: dgflash
 * @LastEditTime: 2022-09-22 14:41:58
 */

import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { AsyncQueue, NextFunction } from "../../../../../extensions/oops-plugin-framework/assets/libs/collection/AsyncQueue";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { UIID } from "../../common/config/GameUIConfig";
import { Initialize } from "../Initialize";
import { LoadingViewComp } from "../view/LoadingViewComp";

/** Initialize game public resources */
@ecs.register('InitRes')
export class InitResComp extends ecs.Comp {
    reset() { }
}

@ecs.register('Initialize')
export class InitResSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(InitResComp);
    }

    entityEnter(e: Initialize): void {
        var queue: AsyncQueue = new AsyncQueue();

        // Load multi-language pack
        this.loadLanguage(queue);
        // Load public resources
        this.loadCommon(queue);
        // Loading game content loading progress prompt interface
        this.onComplete(queue, e);

        queue.play();
    }

    /** Loading language packs (optional) */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            // Set default language
            let lan = oops.storage.get("language");
            if (lan == null || lan == "") {
                lan = "zh";
                oops.storage.set("language", lan);
            }

            // Load language pack resources
            oops.language.setLanguage(lan, next);
        });
    }

    /** Load public resources (required) */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            oops.res.loadDir("common", next);
        });
    }

    /** After loading is completed, enter the game content loading interface. */
    private onComplete(queue: AsyncQueue, e: Initialize) {
        queue.complete = async () => {
            var node = await oops.gui.open(UIID.Loading);
            if (node) e.add(node.getComponent(LoadingViewComp) as ecs.Comp);
            e.remove(InitResComp);
        };
    }
}