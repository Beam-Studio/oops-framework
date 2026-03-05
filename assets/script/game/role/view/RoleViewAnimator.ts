/*
 * @Author: dgflash
 * @Date: 2021-12-29 11:33:59
 * @LastEditors: dgflash
 * @LastEditTime: 2022-06-14 19:56:45
 */
import { sp, _decorator } from "cc";
import AnimatorSpine from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/AnimatorSpine";
import { AnimatorStateLogic } from "../../../../../extensions/oops-plugin-framework/assets/libs/animator/core/AnimatorStateLogic";
import { RoleAnimatorType, WeaponName } from "../model/RoleEnum";
import { Role } from "../Role";
import { AnimationEventHandler } from "./animator/AnimationEventHandler";
import { RoleStateAttack } from "./animator/RoleStateAttack";
import { RoleStateDead } from "./animator/RoleStateDead";
import { RoleStateHit } from "./animator/RoleStateHit";

const { ccclass, property, requireComponent, disallowMultiple } = _decorator;

/** 
 * Character SPINE animation control
 * 
 * Implement function
 * 1. Control movement changes
 * 2. Control weapon changes
 * 3. Control the direction of your face
 */
@ccclass("RoleViewAnimator")
@disallowMultiple
@requireComponent(sp.Skeleton)
export class RoleViewAnimator extends AnimatorSpine {
    /** The attack is completed */
    onAttackComplete: Function = null!;
    /** The attack action is completed */
    onHitActionComplete: Function = null!;
    /** role object */
    role: Role = null!;

    /** Weapon animation name */
    private weaponAnimName: string = null!;

    start() {
        super.start();

        // animation state machine
        let anim = new AnimationEventHandler();
        let asl: Map<string, AnimatorStateLogic> = new Map();
        asl.set(RoleAnimatorType.Attack, new RoleStateAttack(this.role, anim));
        asl.set(RoleAnimatorType.Hurt, new RoleStateHit(this.role, anim));
        asl.set(RoleAnimatorType.Dead, new RoleStateDead(this.role, anim));
        this.initArgs(asl, anim);
    }

    /** Face to the left */
    left() {
        this.node.parent!.setScale(1, 1, 1);
    }

    /** Face to the right */
    right() {
        this.node.parent!.setScale(-1, 1, 1);
    }

    /** Current action changing career animation */
    refresh() {
        // When the state value of the state machine has not changed, the state change event will not be triggered, so the state change event is directly triggered here to trigger the subsequent process.
        this.onStateChange(this._ac.curState, this._ac.curState);
    }

    /**
     * Play animation
     * @override
     * @param animName Animation name
     * @param loop Whether to loop
     */
    protected playAnimation(animName: string, loop: boolean) {
        if (animName) {
            this.weaponAnimName = this.getWeaponAnimName();
            var name = `${animName}_${this.weaponAnimName}`;
            this._spine.setAnimation(0, name, loop);
        }
        else {
            this._spine.clearTrack(0);
        }
    }

    /** Weapon animation clip name */
    private getWeaponAnimName() {
        var job = this.role.RoleModelJob;
        var weaponAnimName = WeaponName[job.weaponType[0]];
        return weaponAnimName;
    }
}