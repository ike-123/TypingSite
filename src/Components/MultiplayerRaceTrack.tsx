import { useApplication, useTick } from '@pixi/react';
import React, { useEffect, useRef, useState } from 'react'
import AnimatedSpriteAvatar from './AnimatedSpriteAvatar';
import { type PlayerState } from "../Pages/Multiplayer"
import { Assets, Texture } from 'pixi.js';

type MultiplayerProps = {
    Players: PlayerState[],
    wordsLength: number

}
const MultiplayerRaceTrack = (props: MultiplayerProps) => {

    const [goldmedaltexture, setgoldmedalTexture] = useState<Texture>()


    const VBox = ({ children, gap = 3 }: { children: React.ReactNode; gap?: number }) => (
        <pixiContainer
            zIndex={2}
            ref={c => {
                if (!c) return;
                let y = 0;
                c.children.forEach(child => {
                    child.y = y;
                    y += child.height + gap;
                });
            }}
        >
            {children}
        </pixiContainer>
    );

    const HBox = ({ children, gap = 40 }: { children: React.ReactNode; gap?: number }) => (
        <pixiContainer
            ref={c => {
                if (!c) return;
                let x = 0;
                c.children.forEach(child => {
                    child.x = x;
                    x += child.width + gap;
                });
            }}
        >
            {children}
        </pixiContainer>
    );

    const playerRef = useRef<any>(null);

    const app = useApplication();

    // const width = app.app.screen.width;
    const [width, setWidth] = React.useState(app.app.screen.width);

    // useTick((delta: any) => {

    //     if (playerRef.current) {
    //         // playerRef.current.x += .25;
    //     }
    // })

    useEffect(() => {

        async function loadAsset() {
            const texture = await Assets.load('/gold-medal.png');

            setgoldmedalTexture(texture);

            //  const texture = await Assets.load('https://pixijs.com/assets/bunny.png');

        }

        loadAsset();

        // const onResize = () => {
        //     console.log(app.app.screen.width)
        //     setWidth(app.app.screen.width);
        //     console.log("setting")
        // };

        // window.addEventListener('resize', onResize);

        // return () => window.removeEventListener('resize', onResize);

        const newheight = props.Players.length * rectangleheight;

        app.app.renderer.resize(app.app.screen.width, newheight);


    }, [app, props.Players])

    const rectangleheight = 50;

    const characterWidth = 336 / 7.76;

    return (

        <>
            {
                props.Players.map((player, index) => {

                    const progressPercent = (player.progressIndex / props.wordsLength);
                    const playerXPosition = props.wordsLength ? progressPercent * width * .95 : 0

                    const trackColour = player.finished ? "0E3044" : "0E3044"

                    //Limit presentable name to Maximum of 12 characters after add elipsis
                    const playerName = player.DisplayName;

                    // console.log(progressPercent)
                    console.log(width);
                    // console.log(progressPercent)

                    return (
                        <pixiGraphics key={player.id} y={index * (rectangleheight + 1)} draw={(graphics) => {
                            graphics.clear();
                            graphics.setFillStyle({ color: trackColour });
                            graphics.rect(0, 0, width * .9, rectangleheight);
                            graphics.fill();
                        }} >



                            <pixiContainer x={playerXPosition} ref={playerRef}>
                                <AnimatedSpriteAvatar player={player}/>

                                <pixiText text={player.DisplayName} style={{
                                    fill: 'white',
                                    fontSize: 12,
                                }}

                                    x={characterWidth + 2}
                                    y={15}
                                    zIndex={2}

                                >

                                </pixiText>



                            </pixiContainer>


                            {

                                player.finished &&

                                <>

                                    <pixiContainer ref={c => {
                                        if (c) {
                                            c.pivot.x = c.width / 2;
                                        }
                                    }}

                                        x={(width * .95 / 2)}>

                                        {/* {goldmedaltexture && <pixiSprite scale={50 / 750} y={25} x={-15} anchor={0.5} texture={goldmedaltexture} />} */}


                                        <pixiText text={` ${playerName}`} style={{
                                            fill: 'white',
                                            fontSize: 18,
                                        }}

                                            y={15}
                                            zIndex={2}
                                        >

                                        </pixiText>
                                    </pixiContainer>


                                    <pixiContainer x={(width * 0.9) * 0.85} y={5}>
                                        {/* <pixiText
                                    text="97 WPM"
                                    anchor={.5}
                                    style={{ fill: 'white', fontSize: 12 }}
                                />

                                <pixiText
                                    text="100% Accuracy"
                                    anchor={.5}
                                    x={80} // offset from first label
                                    style={{ fill: 'white', fontSize: 12 }}
                                />

                                <pixiText
                                    text="time: 00:39"
                                    anchor={.5}
                                    x={180}
                                    style={{ fill: 'white', fontSize: 12 }}
                                /> */}
                                        <HBox>


                                            {/* <VBox>
                                                <pixiText text="WPM" style={{ fill: 'gray', fontSize: 10 }} />
                                                <pixiText text="97" style={{ fill: 'pink', fontSize: 18 }} />
                                            </VBox> */}

                                            {/* <VBox>
                                                <pixiText text="Accuracy" style={{ fill: 'gray', fontSize: 9 }} />
                                                <pixiText text="100%" style={{ fill: 'white', fontSize: 14 }} />
                                            </VBox> */}

                                            <VBox>
                                                <pixiText text="Time" style={{ fill: 'gray', fontSize: 9 }} />
                                                <pixiText text={player.finishtime} style={{ fill: 'white', fontSize: 14 }} />
                                            </VBox>

                                            {goldmedaltexture && <pixiSprite zIndex={2} scale={50 / 750} y={22} x={width * .95 + ((width - width * .95) / 2)} anchor={0.5} texture={goldmedaltexture} />}
                                        </HBox>

                                    </pixiContainer>

                                </>

                            }






                            <pixiGraphics draw={(graphics) => {
                                graphics.clear();
                                graphics.setFillStyle({ color: '#081f30' });
                                graphics.rect(width * .9, 0, width * .5, rectangleheight);
                                graphics.fill();
                                graphics.zIndex = 1;





                            }} >
                            </pixiGraphics>



                            {/* {
                                player.finished

                                    ?
                                    goldmedaltexture && <pixiSprite zIndex={2} scale={50 / 750} y={25} x={width * .95 + ((width - width * .95) / 2)} anchor={0.5} texture={goldmedaltexture} />


                                    :
                                    <pixiContainer zIndex={2} x={width * .95 + ((width - width * .95) / 2)} y={7} >
                                        <VBox>
                                            <pixiText anchor={{ x: .5, y: 0 }} zIndex={3} text="WPM" style={{ fill: 'gray', fontSize: 9 }} />
                                            <pixiText anchor={{ x: .5, y: 0 }} zIndex={3} text={player.wpm} style={{ fill: 'white', fontSize: 14 }} />
                                        </VBox>
                                    </pixiContainer>
                            } */}

                            <pixiContainer zIndex={2} x={width * .9 + ((width - width * .95) / 2)} y={7} >

                                <HBox gap={18}>
                                    <VBox>
                                        <pixiText anchor={{ x: .5, y: 0 }} zIndex={3} text="WPM" style={{ fill: 'gray', fontSize: 9 }} />
                                        <pixiText anchor={{ x: .5, y: 0 }} zIndex={3} text={player.wpm} style={{ fill: 'white', fontSize: 16 }} />
                                    </VBox>

                                    {

                                        player.finished ?

                                        <VBox>
                                            <pixiText anchor={{ x: .5, y: 0 }} zIndex={3} text="Accuracy" style={{ fill: 'gray', fontSize: 9 }} />
                                            <pixiText anchor={{ x: .5, y: 0 }} zIndex={3} text={player.accuracy + "%"} style={{ fill: 'white', fontSize: 12 }} />
                                        </VBox>

:""
                                    }


                                </HBox>


                            </pixiContainer>




                            {/* 
                            <pixiText text={player.wpm + " wpm"} style={{
                                fill: 'white',
                                fontSize: 12,
                            }}
                                x={width * .95}
                                y={15}
                                zIndex={2}
                            >

                            </pixiText>  */}






                        </pixiGraphics>

                    )

                })
            }


        </>

    )
}

export default MultiplayerRaceTrack