import AccountSettings from '@/Components/AccountSettings'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'

type SettingsSection = "Account" | "Personalisation";

const Settings = () => {


    const [CurrentSection, SetCurrentSection] = useState<SettingsSection>("Account")

    return (
        <div className='max-w-7xl flex h-100 m-auto'>
            <div className='bg-amber-200 flex-1'>


                <div className='h-100 sticky top-0 h-screen'>

                    <div className='flex flex-col gap-3'>


                        <Button className={`text-2xl rounded-sm h-12 flex justify-start `} onClick={() => {SetCurrentSection("Account")}}>
                            Account
                        </Button>

                        <Button className={`text-2xl rounded-sm h-12 flex justify-start `} onClick={() => {SetCurrentSection("Personalisation")}}>
                            Personalisation
                        </Button>

                        {/* <Button className={`text-2xl rounded-sm h-12 flex justify-start `} onClick={() => { }}>
                            Keys
                        </Button> */}



                    </div>

                </div>
            </div>

            <div className='bg-neutral-900 flex-5 text-3xl font-bold'>

                {
                    CurrentSection === "Account" && <AccountSettings />
                }

                {
                    CurrentSection === "Personalisation" && <>Personalisation</>
                }


            </div>
        </div>
    )
}

export default Settings