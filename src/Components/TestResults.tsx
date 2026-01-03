import React from 'react'
import { Card } from './ui/card'

const TestResults = () => {
    return (
        <div className='bg-background'>
            <Card className='w-220 m-auto h-150 mt-20 flex flex-row '>

                <div className='bg-amber-400 h-full w-full flex-1'>

                    {/* WPM */}
                    <div className='flex flex-col items-center mt-2'>

                        <h1 className='text-5xl font-bold text-primary'>
                            100
                        </h1>
                        <h1 className='tex-3xl'>
                            WPM
                        </h1>
                    </div>


                    {/* Accuracy */}
                    <div className='flex flex-col items-center mt-8'>

                        <h1 className='text-4xl font-bold text-primary'>
                            95%
                        </h1>
                        <h1 className='tex-3xl'>
                            Accuracy
                        </h1>
                    </div>
                </div>

                <div className='bg-purple-400 h-full w-full flex-5'>

                </div>

            </Card>
        </div>
    )
}

export default TestResults