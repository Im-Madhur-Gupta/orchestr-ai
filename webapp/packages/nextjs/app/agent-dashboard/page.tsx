"use client";

import React, { useState } from 'react';
import OCButton from '~~/components/Button';
import Image from 'next/image';

const AIAgentDashboard = () => {
    const [selectedAgent, setSelectedAgent] = useState<any>(null);

    // List of agents (can be fetched from an API)
    const agents = [
        { username: "agent_1", name: "Agent One" },
        { username: "agent_2", name: "Agent Two" },
        { username: "agent_3", name: "Agent Three" },
        // Add more agents here
    ];

    // Default agent details (you can replace this with dynamic data)
    const agentDetails = {
        username: selectedAgent ? selectedAgent.username : "Select an agent",
        name: selectedAgent ? selectedAgent.name : "Agent Name",
        apiUrl: "https://api.example.com",
        description: "This is a description of the agent.",
        costPerOutputToken: 0.05,
    };

    return (
        <div className="w-full h-full flex">
            {/* Sidebar (left part) */}
            <div className="w-1/2 p-4 text-white flex flex-col items-start space-y-4">
                <h3 className="text-xl font-semibold">Agents</h3>
                {agents.map((agent, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer hover:bg-gray-600 p-2 flex flex-row rounded-md ${selectedAgent && selectedAgent.username === agent.username ? 'bg-gray-700' : ''}`}
                        onClick={() => setSelectedAgent(agent)}
                    >
                        <Image
                            src="https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg"
                            alt={agent.name}
                            width={50}
                            height={50}
                            className="rounded-full mr-10"
                        />
                        {/* Agent Name */}
                        <div className="text-white font-semibold">{agent.name}</div>
                    </div>
                ))}
            </div>

            {/* Right part: Agent details */}
            <div className="flex-1 p-6 bg-transparent rounded-lg shadow-lg relative">
                {selectedAgent ? (
                    <div className="flex flex-col items-center">
                        {/* Image */}
                        <div className="w-full flex justify-center mb-6">
                            {/* <Image
                                src="/logo.gif"
                                alt="ORCHSTR.AI Assistant"
                                className="object-cover rounded-full"
                                width={350}
                                height={350}
                            /> */}
                            <Image
                                src="https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg"
                                alt="ORCHSTR.AI Assistant"

                                width={150}
                                height={150}
                                objectFit="contain"
                            />
                        </div>

                        <div className="pb-4 mb-6 w-full text-center">
                            <h2 className="text-2xl font-semibold text-white">Agent Details</h2>
                        </div>

                        <div className="flex flex-col space-y-4 text-white w-full">
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">Username:</label>
                                <p className="text-white">{agentDetails.username}</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">Name:</label>
                                <p className="text-white">{agentDetails.name}</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">API URL:</label>
                                <p className="text-white">{agentDetails.apiUrl}</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">Description:</label>
                                <p className="text-white">{agentDetails.description}</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">Cost Per Output Token:</label>
                                <p className="text-white">{agentDetails.costPerOutputToken}</p>
                            </div>
                        </div>

                        {/* Amount Earned Section */}
                        <div className="w-1/2 flex flex-col justify-center items-center mt-10">
                            <div className="text-3xl font-extrabold h-16 text-white">Amount Earned</div>
                            <div className="text-5xl font-extrabold h-16 text-white">50000$</div>
                            <div className="w-1/2 flex justify-center items-center mt-10">
                                <OCButton title="Withdraw" props={{ type: "submit" }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-white">
                        <h2 className="text-2xl font-semibold">Select an Agent to View Details</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIAgentDashboard;
