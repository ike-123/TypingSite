import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/Components/ui/card'
import SP_TypingTest from '@/Components/SP_TypingTest'
import { useTypingEnigne } from '@/Hooks/useTypingEngine'



const SinglePageTypingTest = () => {

const engine =  useTypingEnigne()

    return (
        <div className='bg-background'>
            <Card>
                <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non volutpat quam. Nullam vitae eleifend dui, sed dictum neque. Duis posuere arcu sapien, ut efficitur elit tempus eget. Sed sed dolor in enim bibendum rutrum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce condimentum metus lorem, in fringilla urna vulputate in. Fusce ac nibh a urna tempor ullamcorper. Vivamus posuere hendrerit urna, eu aliquet ipsum elementum ac</div>
                <Button onClick={engine.Reset} className='bg-primary w-25 m-auto'>Button</Button>
            </Card>

            <SP_TypingTest engine={engine} ></SP_TypingTest>

        </div>
    )
}

export default SinglePageTypingTest