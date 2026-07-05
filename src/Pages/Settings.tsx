import AccountSettings from '@/Components/AccountSettings'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useAuthStore } from '@/Stores/AuthStore';

type SettingsSection = "Account" | "Personalisation" | "other";

const Settings = () => {


    const User = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.loading)

    const [CurrentSection, SetCurrentSection] = useState<SettingsSection>("Account")

    return (
        <div className='max-w-7xl flex h-100 m-auto mt-10'>
            <div className=''>


                <div className='h-100 w-60 border-r-white-800 border-r-1 sticky top-0 h-screen'>

                    <div className='flex flex-col gap-4 mr-2'>

                        {
                            User &&
                            <Button className={`text-xl rounded-sm h-10 flex justify-start`} variant={CurrentSection === "Account" ? "default" : "ghost"} onClick={() => { SetCurrentSection("Account") }}>
                                Account
                            </Button>
                        }


                        <Button className={`text-xl rounded-sm h-10 flex justify-start `} variant={CurrentSection === "Personalisation" ? "default" : "ghost"} onClick={() => { SetCurrentSection("Personalisation") }}>
                            Customisation
                        </Button>

                        {/* <Button className={`text-xl rounded-sm h-10 flex justify-start `} variant={CurrentSection === "other" ? "default" : "ghost"} onClick={() => { SetCurrentSection("other") }}>
                            Other
                        </Button> */}


                    </div>

                </div>
            </div>

            <div className='w-full m-3'>

                <div className='w-100 ml-5'>
                    {
                        CurrentSection === "Account" && <AccountSettings />
                    }

                    {
                        CurrentSection === "Personalisation" && <>Personalisation</>
                    }

                </div>



            </div>
        </div>
    )
}

export default Settings