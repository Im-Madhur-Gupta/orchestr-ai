import React from 'react'
import { ProfileForm } from '~~/components/form'
import { SidebarTrigger } from '~~/components/ui/sidebar'
import YourAgent, { AgentDetails } from '~~/components/YourAgent'

const agentDetails: AgentDetails = {
    username: "agent007",
    apiUrl: "https://api.example.com",
    description: "This is a sample agent.",
    costPerOutputToken: 10,
    pfpUpload: new File([""], "profile.png", { type: "image/png" })
}

const Agent = () => {
    return (
        <>
            <div className="flex flex-col h-full w-full">
                <div className='mx-20 mt-10'>
                    Your Agents
                </div>
                <div className='h-75 w-full mx-10'>
                    <YourAgent agentDetails={
                        agentDetails
                    } />
                </div>
                <div className='h-75 w-full mx-10'>
                    <YourAgent agentDetails={
                        agentDetails
                    } />
                </div>
                {/* <div className='h-75 w-full mx-10'>
                    <YourAgent agentDetails={
                        agentDetails
                    } />
                </div> */}
            </div>
        </>

        // <div className="flex justify-center items-center h-full w-full">
        //     <ProfileForm />
        // </div>
    )
}

export default Agent