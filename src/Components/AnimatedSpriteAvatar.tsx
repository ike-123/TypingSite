import React, { useEffect, useRef, useState } from 'react'



import { Application, extend } from '@pixi/react';

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

extend({
    Container,
    Graphics,
    Sprite,
    AnimatedSprite,
    Text
});


// import RunSprite from '/profile.jpeg'

const AnimatedSpriteAvatar = () => {


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

    const spriteRef = useRef<any>(null);
    const [frames, SetFrames] = useState<Texture[]>([]);



    useEffect(() => {


        const loadtextures = async () => {

            Assets.load('/character.json').then((sheet: Spritesheet) => {
                // Use a named animation group directly
                const walkFrames = sheet.animations['RunSprite'];
                SetFrames(walkFrames);
            });

            // const textures = await Assets.load(images);

            // const orderedArray = images.map((img) => textures[img]);
            // SetFrames(orderedArray);
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


        <pixiAnimatedSprite ref={spriteRef} textures={frames} animationSpeed={.15} anchor={{ x: 0, y: 0 }}  scale={50 / 388} loop={true} />


    )
}

export default AnimatedSpriteAvatar