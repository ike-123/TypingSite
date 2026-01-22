"use client"
import React from 'react'

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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


export const description = "A line chart"

// const chartData = [
//     { month: "January", desktop: 186 },
//     { month: "February", desktop: 305 },
//     { month: "March", desktop: 237 },
//     { month: "April", desktop: 73 },
//     { month: "May", desktop: 209 },
//     { month: "June", desktop: 214 },
// ]

const chartData = [
    { time: "1", wpm: 96 },
    { time: "2", wpm: 126 },
    { time: "3", wpm: 130 },
    { time: "4", wpm: 94 },
    { time: "5", wpm: 86 },
]

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

// type TestResultsProps = {
//   state: State
// }


const TestResultsPage = () => {
    return (
        <div className='bg-background'>

            <div className='w-100 h-100 bg-amber-200  mx-auto'> 


                <Card className=' m-auto mt-20 flex flex-row gap-0'>

                    <div className=' h-full w-full flex-1'>

              
                        <div className='flex flex-col items-center mt-2'>

                            <h1 className='text-5xl font-bold text-primary'>
                                100
                            </h1>
                            <h1 className='tex-3xl'>
                                WPM
                            </h1>
                        </div>


  
                        <div className='flex flex-col items-center mt-8'>

                            <h1 className='text-4xl font-bold text-primary'>
                                95%
                            </h1>
                            <h1 className='tex-3xl'>
                                Accuracy
                            </h1>
                        </div>
                    </div>

                    <div className=' h-full w-full flex-5'>
                        <div className=''>

                            <ChartContainer config={chartConfig}>

                                <LineChart
                                    accessibilityLayer
                                    data={chartData}
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

                            </ChartContainer>
                        </div>

                    </div>

                </Card>

            </div>

            {/* <Card> */}

            {/* <CardHeader>
                    <CardTitle>Line Chart</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader> */}
            {/* <CardContent> */}
            {/* <ChartContainer config={chartConfig}>
                <LineChart
                    accessibilityLayer
                    data={chartData}
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

export default TestResultsPage