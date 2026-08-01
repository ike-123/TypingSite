import React, { useEffect, useRef, useState } from 'react'



import { Application, extend, useApplication, useTick } from '@pixi/react';

import {
    Assets,
    Container,
    Graphics,
    Sprite,
    Texture,
    Text,
    AnimatedSprite,
    Spritesheet
} from 'pixi.js';
import type { PlayerState } from '@/Pages/Multiplayer';

extend({
    Container,
    Graphics,
    Sprite,
    AnimatedSprite,
    Text
});

type playerProp = {
    player: PlayerState,
    isShopDisplay?: boolean
}


// import RunSprite from '/profile.jpeg'

const AnimatedSpriteAvatar = (props: playerProp) => {


    // const images = [
    //     '/RunSprite1.png',
    //     '/RunSprite2.png',
    //     '/RunSprite3.png',
    //     '/RunSprite4.png',
    //     '/RunSprite5.png',
    //     '/RunSprite6.png',
    //     '/RunSprite7.png',
    //     '/RunSprite8.png',
    // ]

    const app = useApplication();


    const spriteRef = useRef<any>(null);
    // const spriteRefSet = useRef(false);

    const [frames, SetFrames] = useState<Map<String, Texture[]>>(new Map());

    const [animationToPlay, SetAnimationToPlay] = useState<string>("idle");

    const [finished, SetFinished] = useState(false);

    const MoveRight_ShopDisplay = useRef<boolean>(false);

    const SpriteStartPos = useRef<number>(0);





    useEffect(() => {


        // const loadtextures = async () => {

        //     Assets.load(props.player.avatarUrl.atlasUrl).then((sheet: Spritesheet) => {
        //         // Use a named animation group directly
        //         const idleFrames = sheet.animations['Idle'];
        //         const runFrames = sheet.animations['Run'];

        //         SetFrames(() => {

        //             const newMap = new Map();

        //             newMap.set("idle", idleFrames)
        //             newMap.set("run", runFrames);

        //             return newMap;
        //         });
        //     });
        // }

        let isCancelled = false;
        const loadtextures = async () => {

            const avatarUrl = props.player.avatarUrl;

            if (!avatarUrl) {
                return;
            }


            const { atlasUrl, spriteSheetUrl } = props.player.avatarUrl;


            try {

                console.log(atlasUrl)
                console.log(spriteSheetUrl)



                // Load both independently — no assumption about folder structure
                const [texture, atlasData] = await Promise.all([
                    Assets.load<Texture>(spriteSheetUrl),
                    fetch(atlasUrl).then((res) => res.json())
                ]);

                if (isCancelled) return;

                const sheet = new Spritesheet(texture, atlasData);
                await sheet.parse();

                if (isCancelled) return;

                const idleFrames = sheet.animations['Idle'];
                const runFrames = sheet.animations['Run'];

                SetFrames(() => {
                    const newMap = new Map();
                    newMap.set("idle", idleFrames);
                    newMap.set("run", runFrames);
                    return newMap;
                });

            } catch (err) {
                console.error("Failed to load avatar spritesheet:", props.player.avatarUrl, err);
            }

        }

        // console.log(frames)

        loadtextures();

        return () => {
            isCancelled = true;
        };



    }, [props.player]);



    // useEffect(()=>{

    //     PlayShopAnimSequence();

    // },[])

    useEffect(() => {

        if (spriteRef.current && frames && frames.size > 0) {

            console.log(props.player);
            console.log("playerlastwordindex " + props.player.lastWordIndexIncreaseTime)

            if (!props.player.lastWordIndexIncreaseTime) {
                SetAnimationToPlay("idle");
                spriteRef.current.play();

                return
            }
            if (props.player.lastWordIndexIncreaseTime + 1000 > Date.now()) {

                console.log("here 1");

                SetAnimationToPlay("run");
                spriteRef.current.play();

            }
            else {
                console.log("here 2");
                SetAnimationToPlay("idle");
                spriteRef.current.play();

            }

        }




    }, [frames, props.player])

    useTick((delta: any) => {

        if (spriteRef.current && frames && frames.size > 0) {

            // console.log(props.player);
            // console.log("playerlastwordindex " + props.player.lastWordIndexIncreaseTime)

            if (!props.isShopDisplay) {

                if (!props.player.lastWordIndexIncreaseTime) {
                    SetAnimationToPlay("idle");
                    spriteRef.current.play();

                    return
                }
                if (props.player.lastWordIndexIncreaseTime + 2000 > Date.now()) {

                    // console.log("here 1");

                    SetAnimationToPlay("run");
                    spriteRef.current.play();

                }
                else {
                    // console.log("here 2");
                    SetAnimationToPlay("idle");
                    spriteRef.current.play();


                }

                if (props.player.finished) {

                    console.log("finished");
                    app.app.stage.removeChild(spriteRef.current);
                }
            }
            else {

                if (MoveRight_ShopDisplay.current) {
                    console.log("move1")
                    SetAnimationToPlay("run");

                    spriteRef.current.play();
                    spriteRef.current.x += .25;
                }
            }

        }

    })

    function PlayShopAnimSequence() {

        console.log("function")
        if (!spriteRef.current) {
            console.log("null")
            return;
        }

        SpriteStartPos.current = spriteRef.current.x;

        SetAnimationToPlay("idle");
        spriteRef.current.play();

        setTimeout(() => {

            console.log("function timeout started")
            MoveRight_ShopDisplay.current = true;
        }, 3000);
    }

    function RestartShopAnimSequence() {

        spriteRef.current.x = SpriteStartPos.current;
        PlayShopAnimSequence();
    }

    const handleSpriteRef = (ref: any) => {

        console.log("hey1")


        if (!ref || spriteRef.current === ref) return;

        console.log("hey2")

        spriteRef.current = ref;
        PlayShopAnimSequence();

    };

    useEffect(() => {

        if (props.player.finished) {

            SetFinished(true);

        }
    }, [props.player.finished])


    const textures = frames.get(animationToPlay);
    if (!textures) return null;

    return (



        !finished ?
            <pixiAnimatedSprite ref={handleSpriteRef} textures={frames.get(animationToPlay) ?? []} animationSpeed={.15} anchor={{ x: 0, y: 0 }} scale={50 / 388} loop={true} />

            : ""





    )
}

export default AnimatedSpriteAvatar