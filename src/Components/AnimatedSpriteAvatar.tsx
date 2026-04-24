import React, { useEffect, useState } from 'react'


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


const AnimatedSpriteAvatar = () => {

    const [frames, SetFrames] = useState<Texture[]>([]);


    useEffect(() => {
        // Load a spritesheet (atlas JSON + image)
        Assets.load('/assets/character.json').then((sheet: Spritesheet) => {
            SetFrames(Object.values(sheet.textures));
        });
    }, []);

    if (frames.length === 0) return null;

    return (
        <div>

            <pixiAnimatedSprite textures={frames} animationSpeed={.1} x={400} y={300} anchor={{ x: 0.5, y: 0.5 }} loop={true}/>

        </div>
    )
}

export default AnimatedSpriteAvatar