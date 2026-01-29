"use client"
import React from 'react'

import { ArrowBigRight, RotateCcw, TrendingUp } from "lucide-react"
import { Button } from '@/components/ui/button'

import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis, ReferenceDot, Scatter } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"



import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import type { State } from '@/Hooks/useTypingEngine'
import type { configID, modeID } from '@/utils/Typingmode'


export const description = "A line chart"

// const chartData = [
//     { month: "January", desktop: 186 },
//     { month: "February", desktop: 305 },
//     { month: "March", desktop: 237 },
//     { month: "April", desktop: 73 },
//     { month: "May", desktop: 209 },
//     { month: "June", desktop: 214 },
// ]

// const chartData = [
//     { time: "1", wpm: 96 },
//     { time: "2", wpm: 126 },
//     { time: "3", wpm: 130 },
//     { time: "4", wpm: 94 },
//     { time: "5", wpm: 86 },
// ]

export interface TestResultData {
    time: number,
    wpm: number
}

export interface ErrorData {
    time: number,
}

// const chartConfig = {
//     desktop: {
//         label: "Desktop",
//         color: "var(--chart-1)",
//     },
// } satisfies ChartConfig

const chartConfig = {
    wpm: {
        label: "Word Per Minute",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

// interface TestResultsProps {
//   Results?: TestResultData[]
// }


export interface ModeConfigResults {

    mode: modeID,
    configs: configID[],
    LengthDurationSetting: string
}

type TestResultsProps = {
    state: State
    modeConfig: ModeConfigResults
    NextTestFunction: any
    RedoTestFunction: any
}

// let _mistakePoints:TestResultData | null[] = [];

// let _mistakePoints: ({ time: number, wpm: number } | null)[] = [];





// const mistakePoints = mistakes
//     .map((time) => {
//         const y = interpolateY(wpmData, time)
//         if (y == null) return null

//         return {
//             time,
//             wpm: y,
//         }
//     })
//     .filter(Boolean)



const TestResults = ({ state, modeConfig, NextTestFunction, RedoTestFunction }: TestResultsProps) => {


    function interpolateY(data: TestResultData[], targetTime: number) {

        // find the two surrounding points
        for (let i = 0; i < data.length - 1; i++) {
            const p1 = data[i]
            const p2 = data[i + 1]

            if (targetTime >= p1.time && targetTime <= p2.time) {
                const ratio =
                    (targetTime - p1.time) / (p2.time - p1.time)

                return p1.wpm + ratio * (p2.wpm - p1.wpm)
            }
        }

        return null // outside range
    }


    const _mistakePoints = state.errors.map((time) => {


        const y = interpolateY(state.WpmEverySecond, time)
        if (y == null) return null

        console.log("time ", time, " wpm ", y);

        return {
            time,
            wpm: y,
        }
    }).filter(Boolean)



    function generateTicks(min: number, max: number, maxTicks = 30) {
        const range = max - min + 1

        // If small enough, show everything
        if (range <= maxTicks) {
            return Array.from({ length: range }, (_, i) => min + i)
        }

        // Otherwise downsample with equal spacing
        const step = Math.ceil(range / maxTicks)

        const ticks = []
        for (let t = min; t <= max; t += step) {
            ticks.push(t)
        }

        return ticks
    }

    // const minTime = Math.floor(state.WpmEverySecond[0].time)
    // const maxTime = Math.ceil(state.WpmEverySecond[state.WpmEverySecond.length - 1].time)


    const minTime = 1
    const maxTime = state.WpmEverySecond.length

    const data = [
        { time: 2, wpm: 40 },
        { time: 3, wpm: 50 },

    ];



    return (
        <div className=''>
            <Card className='flex'>

                <div className='w-full m-auto flex flex-row gap-0'>

                    <div className=' h-full w-full flex-1'>

                        {/* WPM */}
                        <div className='flex flex-col items-center mt-2'>

                            <h1 className='text-6xl font-bold text-primary'>
                                {state.WPM}
                            </h1>
                            <h1 className=''>
                                WPM
                            </h1>
                        </div>


                        {/* Accuracy */}
                        <div className='flex flex-col items-center mt-8'>

                            <h1 className='text-4xl font-bold text-primary'>
                                {/* Make this a slightly lighter colour than the WPM as i want the WPM to stand out more */}

                                {state.Accuracy}%
                            </h1>
                            <h1 className=''>
                                Accuracy
                            </h1>
                        </div>

                    </div>

                    <div className=' h-full w-full flex-5'>
                        <div className='h-60'>

                            <ChartContainer className='h-full w-full' config={chartConfig}>

                                <LineChart className=''
                                    accessibilityLayer
                                    data={state.WpmEverySecond}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={true} />
                                    <XAxis
                                        dataKey="time"
                                        type='number'
                                        domain={['dataMin', 'dataMax']}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        // tickCount={30}
                                        ticks={generateTicks(minTime, maxTime, 30)}
                                    // interval={"equidistantPreserveStart"}

                                    >

                                        <Label position={"bottom"} value={"time"} offset={0} />

                                    </XAxis>

                                    <YAxis dataKey="wpm" tickLine={false} axisLine={false} >

                                        <Label position={"left"} value={"WPM"} angle={-45} offset={-20} />

                                    </YAxis>



                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Line
                                        dataKey="wpm"
                                        type="natural"
                                        stroke="var(--color-wpm)"
                                        strokeWidth={2}
                                        dot={false}
                                    />



                                    {/* {
                                        _mistakePoints = state.errors.map((time) => {


                                            const y = interpolateY(state.WpmEverySecond, time)
                                            if (y == null) return null

                                            return {
                                                time,
                                                wpm: y,
                                            }

                                            // console.log(error)
                                            //   return <ReferenceDot x={error} y={10} radius={5} />
                                        }


                                        )
                                    } */}

                                    {/* {


                                        console.log("mistake", _mistakePoints)
                                    } */}
                                    {/* <Scatter
                                        data={data}
                                        fill="red"
                                    /> */}


                                    {/* {state.errors.map((t) => {
                                        const y = interpolateY(state.WpmEverySecond, t)
                                        if (y == null) return null

                                        return (
                                            <ReferenceDot
                                                key={t}
                                                x={t}
                                                y={y}
                                                r={4}
                                                fill="red"
                                                stroke="white"
                                            />
                                        )
                                    })} */}

                                    {/* <ReferenceDot x={3.5} y={80} r={5} fill='red' /> */}


                                    {state.errors.map((time, id) => {

                                        if (time < 1) {
                                            time = 1
                                        }
                                        if (time > state.count) {
                                            // console.log(state.count)
                                            time = state.count
                                        }
                                        console.log(time)
                                        return (
                                            <ReferenceDot
                                                key={id}
                                                x={time}
                                                y={0}
                                                r={3}
                                                fill="red"
                                                stroke="black"
                                            />
                                        )
                                    })}

                                </LineChart>

                            </ChartContainer>
                        </div>

                        <div className=' flex justify-around pt-10'>

                            <div className='flex-col text-center'>

                                <h2 className='text-primary font-medium'>Test Configuration</h2>

                                <p className='text-xl font-bold'>{modeConfig.mode} {modeConfig.LengthDurationSetting}</p>

                                {
                                    modeConfig.configs.map((config) => (
                                        <p className='text-xl font-bold '>{config}</p>
                                    ))
                                }

                            </div>


                            <div className='flex-col text-center'>


                                <h2 className='text-primary font-medium'>Duration</h2>

                                <p className='text-xl font-bold '>{state.TotalTime}s</p>

                            </div>

                            <div className='flex-col text-center'>


                                <h2 className='text-primary font-medium'>Characters</h2>

                                <Tooltip>
                                    <TooltipTrigger>
                                        <p className='text-xl font-bold'>{state.correctCount} / <span className='text-red-400'>{state.incorrectCount}</span></p>
                                    </TooltipTrigger>
                                    <TooltipContent side='bottom' className='text-base'>

                                        { state.correctCount === 1 ? <p>{state.correctCount} character typed correctly</p> :  <p>{state.correctCount} characters typed correctly</p> }
                                        { state.incorrectCount === 1 ? <p>{state.incorrectCount} character typed incorrectly</p> :  <p>{state.incorrectCount} characters typed incorrectly</p> }

                                    </TooltipContent>
                                </Tooltip>


                            </div>

                        </div>



                    </div>

                </div>

                <div className='mt-10 flex justify-center gap-10'>

                    <Button className='w-20 h-12' onClick={NextTestFunction}>

                        {/* <ArrowBigRight className='size-8'></ArrowBigRight> */}
                        <span className='font-bold text-xl'>Next</span>

                    </Button>

                    <Button variant={"outline"} onClick={RedoTestFunction} className='w-20 h-12'>

                        {/* <RotateCcw className='size-7'></RotateCcw> */}
                        <span className='font-bold text-xl'>Retry</span>

                    </Button>

                </div>

            </Card>

            {/* <Card> */}
            {/* <CardHeader>
                    <CardTitle>Line Chart</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader> */}
            {/* <CardContent> */}
            {/* <ChartContainer config={chartConfig}>
                <LineChart
                    accessibilityLayer
                    data={state.WpmEverySecond}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="time"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                        dataKey="wpm"
                        type="natural"
                        stroke="var(--color-wpm)"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ChartContainer> */}
            {/* </CardContent> */}
            {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 leading-none font-medium">
                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground leading-none">
                        Showing total visitors for the last 6 months
                    </div>
                </CardFooter> */}
            {/* </Card> */}
        </div>


    )
}

export default TestResults