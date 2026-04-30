import { useApplication, useTick } from '@pixi/react';
import React, { useEffect, useRef } from 'react'
import AnimatedSpriteAvatar from './AnimatedSpriteAvatar';
import { type PlayerState } from "../Pages/Multiplayer"

type MultiplayerProps = {
    Players: PlayerState[],
    wordsLength: number

}
const MultiplayerRaceTrack = (props: MultiplayerProps) => {


    const playerRef = useRef<any>(null);

    const app = useApplication();
    // const width = app.app.screen.width;
    const [width, setWidth] = React.useState(app.app.screen.width);

    useTick((delta: any) => {

        if (playerRef.current) {
            // playerRef.current.x += .25;
        }
    })

    // useEffect(() => {

    //     const onResize = () => {
    //         console.log(app.app.screen.width)
    //         setWidth(app.app.screen.width);
    //         console.log("setting")
    //     };

    //     window.addEventListener('resize', onResize);

    //     return () => window.removeEventListener('resize', onResize);

    // }, [app])

    const rectangleheight = 50;

    return (

        <>
            {
                props.Players.map((player, index) => {

                    const progressPercent = (player.progressIndex / props.wordsLength);
                    const playerXPosition = props.wordsLength ? progressPercent * width * .95 : 0

                    // console.log(progressPercent)
                    console.log(width);
                    // console.log(progressPercent)

                    return (
                        <pixiGraphics key={player.id} y={index * (rectangleheight + 1)} draw={(graphics) => {
                            graphics.clear();
                            graphics.setFillStyle({ color: 'blue' });
                            graphics.rect(0, 0, width, rectangleheight);
                            graphics.fill();
                        }} >

                            <pixiGraphics draw={(graphics) => {
                                graphics.clear();
                                graphics.setFillStyle({ color: 'purple' });
                                graphics.rect(0, 0, width * .95, rectangleheight);
                                graphics.fill();
                            }} >

                                <pixiContainer x={playerXPosition} ref={playerRef}>
                                    <AnimatedSpriteAvatar />

                                </pixiContainer>


                            </pixiGraphics>


                            <pixiText text={"100WPM"} style={{
                                fill: 'white',
                                fontSize: 12,
                            }} 
                            x={width*.95}
                            >

                            </pixiText>

                        </pixiGraphics>

                    )

                })
            }


        </>

    )
}

export default MultiplayerRaceTrack