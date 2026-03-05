/*
 * @Author: dgflash
 * @Date: 2022-01-26 14:14:34
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 15:49:36
 */

/** Role attribute type */
export enum RoleAttributeType {
    /** strength */
    power = "power",
    /** constitution */
    physical = "physical",
    /** agile */
    agile = "agile",
    /** life max */
    hp = "hp"
}

/** Character action name */
export enum RoleAnimatorType {
    /** standby */
    Idle = "Idle",
    /** attack */
    Attack = "Attack",
    /** hit */
    Hurt = "Hurt",
    /** die */
    Dead = "Dead"
}

/** Weapon name */
export var WeaponName: any = {
    0: "Fist",
    1: "Katana",
    2: "CrossGun",
    3: "LongGun",
    4: "Razor",
    5: "Arch",
    6: "Crossbow",
    7: "IronCannon",
    8: "FireGun",
    9: "Wakizashi",
    10: "Kunai",
    11: "Dagger",
    12: "Kusarigama",
    13: "DanceFan",
    14: "Flag",
    15: "MilitaryFan",
    16: "Shield"
}