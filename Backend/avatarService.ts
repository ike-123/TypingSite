// e.g. avatarService.ts
import { prisma } from "./lib/prisma.ts"
import { EquipSlot } from "@prisma/client";

export const DEFAULT_AVATAR = "default"

export async function GetEquippedAvatar(userId: string): Promise<string> {

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
                    ModelUrl: true,
                },
            },

        }

    });

    if (!equippedAvatar?.item || !equippedAvatar.item.ModelUrl) {
        return DEFAULT_AVATAR;
    }
    
    return equippedAvatar.item.ModelUrl
    
}