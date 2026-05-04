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
    const [frames, SetFrames] = useState<Map<String, Texture[]>>(new Map());

    const [animationToPlay, SetAnimationToPlay] = useState<string>("idle");

    const [finished, SetFinished] = useState(false);




    useEffect(() => {


        const loadtextures = async () => {

            Assets.load('/Zombie.json').then((sheet: Spritesheet) => {
                // Use a named animation group directly
                const idleFrames = sheet.animations['Idle'];
                const runFrames = sheet.animations['Run'];

                SetFrames(() => {

                    const newMap = new Map();

                    newMap.set("idle", idleFrames)
                    newMap.set("run", runFrames);

                    return newMap;
                });
            });

            // const textures = await Assets.load(images);

            // const orderedArray = images.map((img) => textures[img]);
            // SetFrames(orderedArray);
        }

        console.log(frames)

        loadtextures();

    }, []);

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

    })

    useEffect(() => {

        if (props.player.finished) {

            SetFinished(true);

        }
    }, [props.player.finished])


    const textures = frames.get(animationToPlay);
    if (!textures) return null;

    return (



        !finished ?
            <pixiAnimatedSprite ref={spriteRef} textures={frames.get(animationToPlay) ?? []} animationSpeed={.15} anchor={{ x: 0, y: 0 }} scale={50 / 388} loop={true} />

            : ""



    )
}

export default AnimatedSpriteAvatar