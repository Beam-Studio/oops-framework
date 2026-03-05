/*
 * @Author: dgflash
 * @Date: 2021-11-18 17:42:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 10:32:42
 */

import { _decorator, sp } from "cc";
import { CCView } from "db://oops-framework/module/common/CCView";
import { ecs } from "../../../../../extensions/oops-plugin-framework/assets/libs/ecs/ECS";
import { Role } from "../Role";
import { RoleEvent } from "../RoleEvent";
import { RoleViewAnimator } from "./RoleViewAnimator";
import { RoleViewController } from "./RoleViewController";
import { RoleViewLoader } from "./RoleViewLoader";

const { ccclass, property } = _decorator;

/** Character display component */
@ccclass('RoleViewComp')                   // Defined as Cocos Creator component
@ecs.register('RoleView', false)           // Defined as an ECS component
export class RoleViewComp extends CCView<Role> {
    @property({ type: sp.Skeleton, tooltip: '角色动画' })
    spine: sp.Skeleton = null!;

    /** Character animation resource management */
    loader: RoleViewLoader = null!;
    /** Character animation rule management */
    animator: RoleViewAnimator = null!;
    /** character controller */
    controller: RoleViewController = null!;

    /** View layer logic code separation demonstration */
    onLoad() {
        var role = this.ent as Role;

        this.loader = this.node.addComponent(RoleViewLoader);
        this.node.emit("load", role);

        this.animator = this.spine.getComponent(RoleViewAnimator)!;
        this.animator.role = role;

        this.controller = this.node.addComponent(RoleViewController);
        this.controller.role = role;

        this.on(RoleEvent.ChangeJob, this.onHandler, this);
    }

    /** Global messages in the business layer notify the logical processing of the view layer, and demonstrate the logical decoupling between the two layers. */
    private onHandler(event: string, args: any) {
        switch (event) {
            case RoleEvent.ChangeJob:
                this.animator.refresh();
                break;
        }
    }

    reset() {
        this.node.destroy();
    }
}