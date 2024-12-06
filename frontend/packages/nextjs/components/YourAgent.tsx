import React from 'react'
import { Button } from "@/components/ui/button"

export interface AgentDetails {
    username: string
    apiUrl: string
    description?: string
    costPerOutputToken: number
    pfpUpload: File | null
}

interface YourAgentProps {
    agentDetails: AgentDetails
}

const YourAgent: React.FC<YourAgentProps> = ({ agentDetails }) => {
    return (
        <div className="border rounded-lg p-6 mx-10 my-5">
            <h2 className="text-xl font-bold mb-4">Agent Details</h2>
            <p><strong>Username:</strong> {agentDetails.username}</p>
            <p><strong>API URL:</strong> {agentDetails.apiUrl}</p>
            <p><strong>Description:</strong> {agentDetails.description}</p>
            <p><strong>Cost Per Output Token:</strong> {agentDetails.costPerOutputToken}</p>
            <p><strong>Profile Picture:</strong> {agentDetails.pfpUpload?.name}</p>
            <div className="flex justify-end mt-4">
                <Button>Withdraw Funds</Button>
            </div>
        </div>
    )
}

export default YourAgent