// e.g. avatarService.ts
import { any } from "zod";
import { assetUrl } from "./lib/cdn.ts";
import { prisma } from "./lib/prisma.ts"
import { EquipSlot } from "@prisma/client";

export const DEFAULT_AVATAR:AvatarResult = {

    atlasUrl:"shop-items/Zombie1/atlas.json",
    spriteSheetUrl:"shop-items/Zombie1/spritesheet.png"
}


export type AvatarResult = {
    atlasUrl: string;
    spriteSheetUrl: string;
};


export async function GetEquippedAvatar(userId: string): Promise<AvatarResult> {

    const equippedAvatar = await prisma.userEquippedItems.findUnique({
        where: {
            userid_slot: {
                userid: userId,
                slot: EquipSlot.avatar,
            },
        },
        include: {
            item: {
                select: {
                    assetUrl: true,
                    spriteSheetUrl: true
                },
            },

        }

    });


    if (!equippedAvatar?.item || !equippedAvatar.item.assetUrl || !equippedAvatar.item.spriteSheetUrl) {

        let DefaultAvatar:AvatarResult = {atlasUrl:"",spriteSheetUrl:""}

        DefaultAvatar.atlasUrl = assetUrl(DEFAULT_AVATAR.atlasUrl)
        DefaultAvatar.spriteSheetUrl = assetUrl(DEFAULT_AVATAR.spriteSheetUrl)

        return DefaultAvatar;
    }

    equippedAvatar.item.assetUrl = assetUrl(equippedAvatar?.item.assetUrl)
    equippedAvatar.item.spriteSheetUrl = assetUrl(equippedAvatar?.item.spriteSheetUrl)

    console.log( equippedAvatar.item.assetUrl)

    return {
        atlasUrl: equippedAvatar.item.assetUrl,
        spriteSheetUrl:equippedAvatar.item.spriteSheetUrl
    }

}