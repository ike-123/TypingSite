import React, { useEffect, useState } from 'react'
import axios from 'axios'


type averagestats = {
    averageWPM:number,
    averageAccuracy:number
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

                const config = {
                    mode: "time",
                    configs: ["punctuation","numbers"],
                    LengthDurationSetting: "5"
                }
                const stats = await axios.get("http://localhost:3001/api/averagestats?last=20", { withCredentials: true });
                // console.log(data.);

                SetAverageWPM(stats.data.averageWPM)
                SetAverageAccuracy(stats.data.averageAccuracy)






            } catch (error) {
                console.error("Failed to retrieve averagestats", error);
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