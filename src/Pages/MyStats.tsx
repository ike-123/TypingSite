import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Modes } from '@/utils/Typingmode'


type averagestats = {
    averageWPM: number,
    averageAccuracy: number
}
const MyStats = () => {

    const [averageWPM, SetAverageWPM] = useState<number>(0);
    const [averageAccuracy, SetAverageAccuracy] = useState<number>(0);



    //   config: {
    //                 mode: modeID,
    //                 configs: Allowedconfigs,
    //                 LengthDurationSetting: LengthDurationSetting
    //             }

    useEffect(() => {



        async function GetAverageTestStats() {
            try {

                const mode = "word"
                const configs = ["punctuation", "numbers"]
                const LengthDurationSetting = "10"

                const stats = await axios.get(`http://localhost:3001/api/averagestats`, {
                    params: {
                        last: 20,
                        mode,
                        LengthDurationSetting,
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
        GetAverageTestStats();


    }, [])

    return (
        <div>
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
        </div>
    )
}

export default MyStats