import React, { useEffect, useRef, useState } from 'react'



import { Application, extend } from '@pixi/react';

import {
    Assets,
    Container,
    Graphics,
    Sprite,
    Texture,
    AnimatedSprite,
    Spritesheet
} from 'pixi.js';

extend({
    Container,
    Graphics,
    Sprite,
    AnimatedSprite
});


// import RunSprite from '/profile.jpeg'

const AnimatedSpriteAvatar = () => {

    const atlasData = {
        frames: {
            enemy1: {
                frame: { x: 0, y: 0, w: 32, h: 32 },
                sourceSize: { w: 32, h: 32 },
                spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
            },
            enemy2: {
                frame: { x: 32, y: 0, w: 32, h: 32 },
                sourceSize: { w: 32, h: 32 },
                spriteSourceSize: { x: 0, y: 0, w: 32, h: 32 },
            },
        },
        meta: {
            image: 'images/spritesheet.png',
            format: 'RGBA8888',
            size: { w: 128, h: 32 },
            scale: 1,
        },
        animations: {
            enemy: ['enemy1', 'enemy2'], //array of frames by name
        },
    };

    

    const spriteRef = useRef<any>(null);

    const images = [
        '/RunSprite1.png',
        '/RunSprite2.png',
        '/RunSprite3.png',
        '/RunSprite4.png',
        '/RunSprite5.png',
        '/RunSprite6.png',
        '/RunSprite7.png',
        '/RunSprite8.png',
    ]
    const [frames, SetFrames] = useState<Texture[]>([]);



    useEffect(() => {


        const loadtextures = async () => {

            const textures = await Assets.load(images);

            const orderedArray = images.map((img) => textures[img]);
            SetFrames(orderedArray);
        }

        console.log(frames)

        loadtextures();

    }, []);

    useEffect(() => {

        if (spriteRef.current && frames.length > 0) {
            spriteRef.current.play();
        }
    }, [frames])



    if (frames.length === 0) return null;

    return (


        <pixiAnimatedSprite ref={spriteRef} textures={frames} animationSpeed={.15} x={32} y={32} anchor={{ x: 0.5, y: 0.5 }} scale={{ x: 0.18, y: 0.18 }} loop={true} />


    )
}

export default AnimatedSpriteAvatar