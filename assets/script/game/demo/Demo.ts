/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2023-08-28 17:23:59
 */
import { EventTouch, _decorator } from "cc";
import { GameComponent } from "db://oops-framework/module/common/GameComponent";
import { oops } from "../../../../extensions/oops-plugin-framework/assets/core/Oops";
import { LabelChange } from "../../../../extensions/oops-plugin-framework/assets/libs/gui/label/LabelChange";
import { UIID } from "../common/config/GameUIConfig";
import { smc } from "../common/ecs/SingletonModuleComp";
import { RoleViewInfoComp } from "../role/view/RoleViewInfoComp";
import { UIParam } from "db://oops-framework/core/gui/layer/LayerUIElement";

const { ccclass, property } = _decorator;
// View layer entity is empty
@ccclass('Demo')
export class Demo extends GameComponent {
    private lang: boolean = true;

    @property(LabelChange)
    private labChange: LabelChange = null!;

    start() {
        // resLoader.dump();

        // console.log("Current number of atlases", dynamicAtlasManager.atlasCount);
        // console.log("Maximum number of atlases that can be created", dynamicAtlasManager.maxAtlasCount);
        // console.log("Width and height of the created atlas", dynamicAtlasManager.textureSize);
        // console.log("Maximum size of pictures that can be added to the atlas", dynamicAtlasManager.maxFrameSize);
        // console.log("Maximum size of pictures that can be added to the atlas", dynamicAtlasManager.maxFrameSize);

        // console.log("Is it a native platform", sys.isNative);
        // console.log("Is it a browser", sys.isBrowser);
        // console.log("Is it a mobile platform", sys.isMobile);
        // console.log("Is it little endian", sys.isLittleEndian);
        // console.log("Running platform or environment", sys.platform);
        // console.log("Language of running environment", sys.language);
        // console.log("Language code of running environment", sys.languageCode);
        // console.log("Current running system", sys.os);
        // console.log("Running system version string", sys.osVersion);
        // console.log("Current system main version", sys.osMainVersion);
        // console.log("Currently running browser type", sys.browserType);
        // console.log("Get the network type of the current device. If the network type cannot be obtained, `sys.NetworkType.LAN` will be returned by default", sys.getNetworkType());
        // console.log("Get the battery power of the current device. If the power cannot be obtained, 1 will be returned by default", sys.getBatteryLevel());


        this.labChange.changeTo(0.5, 250, () => { })
    }

    private adTutorial() {
        window.open("https://store.cocos.com/app/detail/6647", '_blank');
    }

    private adNet() {
        window.open("https://store.cocos.com/app/detail/5877", '_blank');
    }

    private adGuide() {
        window.open("https://store.cocos.com/app/detail/3653", '_blank');
    }

    private adMoba() {
        window.open("https://store.cocos.com/app/detail/3814", '_blank');
    }

    private adWarChess() {
        window.open("https://store.cocos.com/app/detail/5676", '_blank');
    }

    private adTurnBattle() {
        window.open("https://store.cocos.com/app/detail/7062", '_blank');
    }

    private adTiledmap() {
        window.open("https://store.cocos.com/app/detail/4428", '_blank');
    }

    private adRpgPlayer3d() {
        window.open("https://store.cocos.com/app/detail/4139", '_blank');
    }

    private adRpgPlayer2d() {
        window.open("https://store.cocos.com/app/detail/3675", '_blank');
    }

    private adHotUpdate() {
        window.open("https://store.cocos.com/app/detail/7296", '_blank');
    }

    private btn_long(event: EventTouch, data: any) {
        oops.gui.toast(data, true);
    }

    /** upgrade */
    private btn_level_up(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.upgrade();
    }

    /** attack */
    private btn_attack(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.attack();
    }

    /** Class transfer bow and arrow */
    private btn_change_job9(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.changeJob(9);
    }

    /** Job transfer dagger */
    private btn_change_job5(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.changeJob(5);
    }

    /** Job changing knife */
    private btn_change_job1(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        role.changeJob(1);
    }

    /** Open the role interface */
    private async btn_open_role_info(event: EventTouch, data: any) {
        var role = smc.account.AccountModel.role;
        var node = await oops.gui.open(UIID.Demo_Role_Info, { data: "Pass parameters" });
        if (node) role.add(node.getComponent(RoleViewInfoComp)!);
    }

    /** Multi-language switching */
    private btn_language(event: EventTouch, data: any) {
        console.log(oops.language.getLangByID("notify_show"));

        if (this.lang == false) {
            this.lang = true;
            oops.language.setLanguage("zh", () => { });
        }
        else {
            this.lang = false;
            oops.language.setLanguage("en", () => { });
        }
    }

    /** Floating prompt box */
    private btn_notify_show(event: EventTouch, data: any) {
        oops.gui.toast("common_prompt_content", true);
    }

    /** Loading prompt */
    private netInstableOpen(event: EventTouch, data: any) {
        oops.gui.waitOpen();
        setTimeout(() => {
            oops.gui.waitClose();
        }, 2000);
    }

    /** background music */
    private btn_audio_open1(event: EventTouch, data: any) {
        oops.audio.music.loadAndPlay("audios/nocturne");
    }

    /** background sound effects */
    private btn_audio_open2(event: EventTouch, data: any) {
        oops.audio.playEffect("audios/Gravel");
    }

    private btn_common_prompt() {
        let uip: UIParam = {
            data: {
                title: "Public pop-up window",
                content: "This is a public pop-up window",
                okWord: 'common_prompt_ok',
                needCancel: false
            }
        }
        oops.gui.open(UIID.Alert, uip);
    }
}
