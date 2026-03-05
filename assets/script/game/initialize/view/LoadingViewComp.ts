/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-29 13:37:08
 */
import { _decorator, sys } from "cc";
import { oops } from "db://oops-framework/core/Oops";
import { JsonUtil } from "db://oops-framework/core/utils/JsonUtil";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCViewVM } from "db://oops-framework/module/common/CCViewVM";
import { GameEvent } from "../../common/config/GameEvent";
import { UIID } from "../../common/config/GameUIConfig";
import { smc } from "../../common/ecs/SingletonModuleComp";
import { Initialize } from "../Initialize";

const { ccclass, property } = _decorator;

/** Game resource loading */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
export class LoadingViewComp extends CCViewVM<Initialize> {
    /** VM component binding data */
    data: any = {
        /** Current progress of loading resources */
        finished: 0,
        /** Maximum progress of loading resources */
        total: 0,
        /** Loading resource progress ratio value */
        progress: "0",
        /** Prompt text during loading process */
        prompt: ""
    };

    private progress: number = 0;

    reset(): void {
        setTimeout(() => {
            // Close loading interface
            oops.gui.remove(UIID.Loading);

            // Open the game main interface (custom logic)
            oops.gui.open(UIID.Demo);
        }, 500);
    }

    start() {
        if (!sys.isNative) {
            this.enter();
        }
    }

    enter() {
        this.addEvent();
        this.loadRes();
    }

    private addEvent() {
        this.on(GameEvent.LoginSuccess, this.onHandler, this);
    }

    private onHandler(event: string, args: any) {
        switch (event) {
            case GameEvent.LoginSuccess:
                // The loading process ends and the loading prompt interface is removed.
                this.ent.remove(LoadingViewComp);
                break;
        }
    }

    /** Load resources */
    private async loadRes() {
        this.data.progress = 0;
        await this.loadCustom();
        this.loadGameRes();
    }

    /** Load the game's local json data (custom content) */
    private loadCustom() {
        // Load the multi-language prompt text of the game's local json data
        this.data.prompt = oops.language.getLangByID("loading_load_json");

        return new Promise(async (resolve, reject) => {
            await JsonUtil.loadDir();
            resolve(null);
        });
    }

    /** Load initial game content resources */
    private loadGameRes() {
        // Multilingual prompt text for loading initial game content assets
        this.data.prompt = oops.language.getLangByID("loading_load_game");

        oops.res.loadDir("game", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
    }

    /** Loading progress event */
    private onProgressCallback(finished: number, total: number, item: any) {
        this.data.finished = finished;
        this.data.total = total;

        var progress = finished / total;
        if (progress > this.progress) {
            this.progress = progress;
            this.data.progress = (progress * 100).toFixed(2);
        }
    }

    /** Load complete event */
    private onCompleteCallback() {
        // Get multilingual prompt text for user information
        this.data.prompt = oops.language.getLangByID("loading_load_player");

        // Initialize account module
        smc.account.connect();
    }
}