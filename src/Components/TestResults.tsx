"use client"
import React from 'react'

import { TrendingUp } from "lucide-react"
import { Button } from '@/components/ui/button'

import { CartesianGrid, Label, Line, LineChart, XAxis, YAxis } from "recharts"

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
    time: string,
    wpm: number
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
}


const TestResults = ({ state, modeConfig }: TestResultsProps) => {
    return (
        <div className=''>
            <Card className='w-full m-auto flex flex-row gap-0'>

                <div className=' h-full w-full flex-1'>

                    {/* WPM */}
                    <div className='flex flex-col items-center mt-2'>

                        <h1 className='text-6xl font-bold text-primary'>
                            {state.WPM}
                        </h1>
                        <h1 className='tex-3xl'>
                            WPM
                        </h1>
                    </div>


                    {/* Accuracy */}
                    <div className='flex flex-col items-center mt-8'>

                        <h1 className='text-4xl font-bold text-primary'>
                            {/* Make this a slightly lighter colour than the WPM as i want the WPM to stand out more */}

                            {state.Accuracy}%
                        </h1>
                        <h1 className='tex-3xl'>
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
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    interval={"equidistantPreserveStart"}


                                >

                                    <Label position={"bottom"} value={"time"} offset={0} />

                                </XAxis>

                                <YAxis tickLine={false} axisLine={false} >

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
                            </LineChart>

                        </ChartContainer>
                    </div>

                    <div className='h-50 flex justify-around pt-10'>

                        <div className='flex-col text-center'>

                            <h2 className='font-bold text-xl'>Test Configuration</h2>

                            <p>{modeConfig.mode} {modeConfig.LengthDurationSetting}</p>

                            {
                                modeConfig.configs.map((config) => (
                                    <p>{config}</p>
                                ))
                            }

                        </div>


                        <div className='flex-col text-center'>


                            <h2 className='font-bold text-xl'>Duration</h2>

                            <p>{state.TotalTime}s</p>

                        </div>

                        <div className='flex-col text-center'>


                            <h2 className='font-bold text-xl'>Characters</h2>

                            <p>{state.correctCount}/{state.incorrectCount}</p>

                        </div>

                    </div>

                    <div className='flex justify-center gap-15'>

                        <Button className='w-20 h-12'></Button>
                        <Button variant={"outline"} className='w-20 h-12'></Button>

                    </div>

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