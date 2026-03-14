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


type averagestats = {
    averageWPM: number,
    averageAccuracy: number
}
const MyStats = () => {

    //average stats



    const [averageWPM, SetAverageWPM] = useState<number>(0);
    const [averageAccuracy, SetAverageAccuracy] = useState<number>(0);

    const [personalBest, SetPersonalBest] = useState<number>(0);
    // const [averageAccuracy, SetAverageAccuracy] = useState<number>(0);

    const [testsCompleted, SetTestsCompleted] = useState<number>(0);
    const [timeSpentTyping, SetTimeSpentTyping] = useState<number>(0);


    // const [selectedMode, SetSelectedMode] = useState("")


    const AverageStats_Options = useSelect_TypingStats();
    const PB_And_History_Options = useSelect_TypingStats();



    //   config: {
    //                 mode: modeID,
    //                 configs: Allowedconfigs,
    //                 LengthDurationSetting: LengthDurationSetting
    //             }

    useEffect(() => {


        GetAverageTestStats();


        GetPBandHistory();


        GetExtraTestInfo();



    }, [])


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
                    configs
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
                    configs
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
        <div>

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


            <Select value={AverageStats_Options.selectedMode} onValueChange={AverageStats_Options.SetSelectedMode}>
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


            <Select value={AverageStats_Options.selectedLengthDuration} onValueChange={AverageStats_Options.SetLengthDuration}>
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


            <div className='flex gap-3'>
                <div className='flex justify-center text-center  flex-col  w-40 h-40 bg-primary'>


                    <h1 className='text-xl' >  Average WPM</h1>

                    <h2 className='text-4xl'>{averageWPM}</h2>


                </div>

                <div className='flex justify-center text-center  flex-col  w-40 h-40 bg-primary'>


                    <h1 className='text-xl' >  Average Accuracy</h1>

                    <h2 className='text-4xl'>{averageAccuracy}</h2>


                </div>

            </div>




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


            <Select value={PB_And_History_Options.selectedMode} onValueChange={PB_And_History_Options.SetSelectedMode}>
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


            <Select value={PB_And_History_Options.selectedLengthDuration} onValueChange={PB_And_History_Options.SetLengthDuration}>
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



            <div className='flex gap-3'>
                <div className='flex justify-center text-center  flex-col  w-40 h-40 bg-primary'>


                    <h1 className='text-xl' > Personal Best </h1>

                    <h2 className='text-4xl'>{personalBest}</h2>


                </div>

            </div>




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


        </div>
    )
}

export default MyStats