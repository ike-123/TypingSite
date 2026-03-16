import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Modes } from '@/utils/Typingmode'

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSelect_TypingStats } from '@/Hooks/useSelect_TypingStats'
import MultipleSelectWithPlaceholderDemo from '@/Components/shadcn-studio/select/select-33'
import type { Option } from '@/components/ui/multi-select'


type averagestats = {
    averageWPM: number,
    averageAccuracy: number
}
const MyStats = () => {

    //average stats



    const [averageWPM, SetAverageWPM] = useState<number | null>(0);
    const [averageAccuracy, SetAverageAccuracy] = useState<number | null>(0);

    const [personalBest, SetPersonalBest] = useState<number | null>(0);
    // const [averageAccuracy, SetAverageAccuracy] = useState<number>(0);

    const [testsCompleted, SetTestsCompleted] = useState<number>(0);
    const [timeSpentTyping, SetTimeSpentTyping] = useState<number>(0);


    // const [selectedMode, SetSelectedMode] = useState("")


    const AverageStats_Options = useSelect_TypingStats();
    const PB_And_History_Options = useSelect_TypingStats();


    const [avg_stats_selectedConfigs, avg_SetSelectedConfigs] = useState<Option[]>([])


    const [pb_selectedConfigs, pb_SetSelectedConfigs] = useState<Option[]>([])


    // const [selectedConfigs2, setSelectedConfigs2] = useState<Option[]>([])


    //   const word_LengthDurationSetting = [10,25,50,100,500]
    // const time_LengthDurationSetting = [5,15,30,60,120]

    // const word_LengthDurationSetting = ["10", "25", "50", "100", "500"]
    // const time_LengthDurationSetting = ["5", "15", "30", "60", "120"]
    // const quote_LengthDurationSetting = ["short", "medium", "long"]





    //   config: {
    //                 mode: modeID,
    //                 configs: Allowedconfigs,
    //                 LengthDurationSetting: LengthDurationSetting
    //             }


    useEffect(() => {


        GetAverageTestStats();

        console.log("axios")

        // GetPBandHistory();


        // GetExtraTestInfo();


    }, [AverageStats_Options.selectedLengthDuration, AverageStats_Options.selected_Test_Scope, avg_stats_selectedConfigs])


    // useEffect(() => {


    //     console.log(selectedConfigs);


    // }, [selectedConfigs])


    function Change_LengthDuration(mode: string) {

        console.log(mode);
        AverageStats_Options.SetSelectedMode(mode);

        if (mode === "time") {

            AverageStats_Options.SetLengthDuration("30")
            console.log("run 1")

        }
        else if (mode === "word") {
            AverageStats_Options.SetLengthDuration("25")
            console.log("run 2")

        }
        else if (mode === "quote") {
            AverageStats_Options.SetLengthDuration("medium")
            console.log("run 3")

        }
    }




    // useEffect(() => {

    //     //set to default
    //     if (AverageStats_Options.selectedMode === "time") {

    //         AverageStats_Options.SetLengthDuration("30")
    //         console.log("run 1")

    //     }
    //     else if (AverageStats_Options.selectedMode === "word") {
    //         AverageStats_Options.SetLengthDuration("25")
    //         console.log("run 2")

    //     }
    //     else if (AverageStats_Options.selectedMode === "quote") {
    //         AverageStats_Options.SetLengthDuration("medium")
    //         console.log("run 3")

    //     }

    // }, [AverageStats_Options.selectedMode])



    useEffect(() => {


        GetPBandHistory();


        // GetExtraTestInfo();


    }, [PB_And_History_Options.selectedLengthDuration, PB_And_History_Options.selected_Test_Scope, pb_selectedConfigs])


    // useEffect(() => {

    //     //set to default
    //     if (PB_And_History_Options.selectedMode === "time") {

    //         PB_And_History_Options.SetLengthDuration("30")
    //         console.log("run 1")

    //     }
    //     else if (PB_And_History_Options.selectedMode === "word") {
    //         PB_And_History_Options.SetLengthDuration("25")
    //         console.log("run 2")

    //     }
    //     else if (PB_And_History_Options.selectedMode === "quote") {
    //         PB_And_History_Options.SetLengthDuration("medium")
    //         console.log("run 3")

    //     }

    // }, [PB_And_History_Options.selectedMode])



    function PB_Change_LengthDuration(mode: string) {

        console.log(mode);
        PB_And_History_Options.SetSelectedMode(mode);

        if (mode === "time") {

            PB_And_History_Options.SetLengthDuration("30")
            console.log("run 1")

        }
        else if (mode === "word") {
            PB_And_History_Options.SetLengthDuration("25")
            console.log("run 2")

        }
        else if (mode === "quote") {
            PB_And_History_Options.SetLengthDuration("medium")
            console.log("run 3")
        }
    }


    // useEffect(() => {

    //     GetPBandHistory();


    //     GetExtraTestInfo();

    // }, [])


    async function GetAverageTestStats() {
        try {

            // const mode = "word"
            const configs = ["punctuation", "numbers"]
            // const LengthDurationSetting = "10"

            const stats = await axios.get(`http://localhost:3001/api/averagestats`, {
                params: {
                    last: Number(AverageStats_Options.selected_Test_Scope),
                    mode: AverageStats_Options.selectedMode,
                    LengthDurationSetting: AverageStats_Options.selectedLengthDuration,
                    configs: avg_stats_selectedConfigs.map((item) => item.value)

                },
                paramsSerializer: {
                    indexes: null
                },
                withCredentials: true
            });
            console.log(stats);

            SetAverageWPM(stats.data.averageWPM)
            SetAverageAccuracy(stats.data.averageAccuracy)


        } catch (error) {
            console.error(error);

            SetAverageWPM(null)
            SetAverageAccuracy(null)
        }
    }


    async function GetPBandHistory() {
        try {

            // const mode = "word"
            const configs = ["punctuation", "numbers"]
            // const LengthDurationSetting = "10"

            const stats = await axios.get(`http://localhost:3001/api/PBandHistory`, {
                params: {
                    last: Number(PB_And_History_Options.selected_Test_Scope),
                    mode: PB_And_History_Options.selectedMode,
                    LengthDurationSetting: PB_And_History_Options.selectedLengthDuration,
                    configs: pb_selectedConfigs.map((item) => item.value)
                },
                paramsSerializer: {
                    indexes: null
                },
                withCredentials: true
            });
            console.log(stats);

            SetPersonalBest(stats.data.PersonalBest._max.wpm)


            // SetAverageWPM(stats.data.averageWPM)
            // SetAverageAccuracy(stats.data.averageAccuracy)


        } catch (error) {
            console.error(error);
            SetPersonalBest(null)

        }
    }


    async function GetExtraTestInfo() {
        try {
            const stats = await axios.get(`http://localhost:3001/api/ExtraTestInfo`, {
                withCredentials: true
            });
            console.log(stats);
            SetTestsCompleted(stats.data.TestsCompleted);
            SetTimeSpentTyping(stats.data.TotalTimeSpentTyping)

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className='max-w-7xl m-auto flex flex-col gap-10'>

            <section className="border-2">

                <div className='flex justify-end'>

                    <Select value={AverageStats_Options.selected_Test_Scope} onValueChange={AverageStats_Options.SetTestScope}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="0">All Time</SelectItem>
                                <SelectItem value="1">Last 1 tests</SelectItem>
                                <SelectItem value="25">Last 25 tests</SelectItem>
                                <SelectItem value="50">Last 50 tests</SelectItem>
                                <SelectItem value="100">Last 100 tests</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={AverageStats_Options.selectedMode} onValueChange={Change_LengthDuration}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="time">time</SelectItem>
                                <SelectItem value="word">word</SelectItem>
                                <SelectItem value="quote">quote</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>



                    {
                        AverageStats_Options.selectedMode === "time" && <Select value={AverageStats_Options.selectedLengthDuration} onValueChange={AverageStats_Options.SetLengthDuration}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="30">30</SelectItem>
                                    <SelectItem value="60">60</SelectItem>
                                    <SelectItem value="120">120</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>



                    }

                    {
                        AverageStats_Options.selectedMode === "word" && <Select value={AverageStats_Options.selectedLengthDuration} onValueChange={AverageStats_Options.SetLengthDuration}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="500">500</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    }

                    {
                        AverageStats_Options.selectedMode === "quote" && <Select value={AverageStats_Options.selectedLengthDuration} onValueChange={AverageStats_Options.SetLengthDuration}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="short">short</SelectItem>
                                    <SelectItem value="medium">medium</SelectItem>
                                    <SelectItem value="long">long</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    }


                    <MultipleSelectWithPlaceholderDemo
                        value={avg_stats_selectedConfigs}
                        onChange={avg_SetSelectedConfigs}>

                    </MultipleSelectWithPlaceholderDemo>
                </div>



                <div className='flex gap-3'>
                    <div className='flex justify-center text-center  flex-col  w-40 h-40 bg-primary'>


                        <h1 className='text-xl' >  Average WPM</h1>

                        <h2 className='text-4xl'>{averageWPM}</h2>


                    </div>

                    <div className='flex justify-center text-center  flex-col  w-40 h-40 bg-primary'>


                        <h1 className='text-xl' > Average Accuracy</h1>

                        <h2 className='text-4xl'>{averageAccuracy}</h2>


                    </div>

                </div>

            </section>



            <section className="border-2">

                <div className='flex justify-end'>

                    <Select value={PB_And_History_Options.selected_Test_Scope} onValueChange={PB_And_History_Options.SetTestScope}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="0">All Time</SelectItem>
                                <SelectItem value="1">Last 1 tests</SelectItem>
                                <SelectItem value="25">Last 25 tests</SelectItem>
                                <SelectItem value="50">Last 50 tests</SelectItem>
                                <SelectItem value="100">Last 100 tests</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>


                    <Select value={PB_And_History_Options.selectedMode} onValueChange={PB_Change_LengthDuration}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="time">time</SelectItem>
                                <SelectItem value="word">word</SelectItem>
                                <SelectItem value="quote">quote</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {
                        PB_And_History_Options.selectedMode === "time" && <Select value={PB_And_History_Options.selectedLengthDuration} onValueChange={PB_And_History_Options.SetLengthDuration}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="30">30</SelectItem>
                                    <SelectItem value="60">60</SelectItem>
                                    <SelectItem value="120">120</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>



                    }

                    {
                        PB_And_History_Options.selectedMode === "word" && <Select value={PB_And_History_Options.selectedLengthDuration} onValueChange={PB_And_History_Options.SetLengthDuration}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                    <SelectItem value="500">500</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    }

                    {
                        PB_And_History_Options.selectedMode === "quote" && <Select value={PB_And_History_Options.selectedLengthDuration} onValueChange={PB_And_History_Options.SetLengthDuration}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="short">short</SelectItem>
                                    <SelectItem value="medium">medium</SelectItem>
                                    <SelectItem value="long">long</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    }


                    <MultipleSelectWithPlaceholderDemo
                        value={pb_selectedConfigs}
                        onChange={pb_SetSelectedConfigs}>

                    </MultipleSelectWithPlaceholderDemo>

                </div>



                <div className='flex gap-3'>
                    <div className='flex justify-center text-center  flex-col  w-40 h-40 bg-primary'>


                        <h1 className='text-xl' > Personal Best </h1>

                        <h2 className='text-4xl'>{personalBest}</h2>


                    </div>

                </div>





            </section>

            <section className='border-2'>

                <div className='flex gap-3'>
                    <div className='flex justify-center text-center  flex-col  w-40 h-40 bg-primary'>


                        <h1 className='text-xl' >  Amount of tests completd</h1>

                        <h2 className='text-4xl'>{testsCompleted}</h2>


                    </div>

                    <div className='flex justify-center text-center  flex-col  w-40 h-40 bg-primary'>


                        <h1 className='text-xl' >  Time spent typing</h1>

                        <h2 className='text-4xl'>{timeSpentTyping}</h2>


                    </div>

                </div>

            </section>







        </div>
    )
}

export default MyStats