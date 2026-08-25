// e.g. avatarService.ts
import { assetUrl } from "./lib/cdn.ts";
import { prisma } from "./lib/prisma.ts"
import { EquipSlot } from "@prisma/client";

export const DEFAULT_AVATAR:AvatarResult = {

    atlasUrl:"/Zombie.json",
    spriteSheetUrl:"/Zombie.png"
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
        return DEFAULT_AVATAR;
    }

    equippedAvatar.item.assetUrl = assetUrl(equippedAvatar?.item.assetUrl)
    equippedAvatar.item.spriteSheetUrl = assetUrl(equippedAvatar?.item.spriteSheetUrl)

    console.log( equippedAvatar.item.assetUrl)

    return {
        atlasUrl: equippedAvatar.item.assetUrl,
        spriteSheetUrl:equippedAvatar.item.spriteSheetUrl
    }

}