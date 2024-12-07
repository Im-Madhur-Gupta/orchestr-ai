"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import OCButton from "~~/components/Button";
import { BASE_URL } from "~~/services/api";
import { IAgent } from "./type";
import { serializeAgents } from "./utils";


const AIAgentDashboard = () => {
    const [selectedAgent, setSelectedAgent] = useState<IAgent | undefined>(undefined);
    const [agents, setAgents] = useState<IAgent[]>([]);
    const [loading, setLoading] = useState(false);
    const { address } = useAccount();

    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            if (!address) return;
            try {
                const res = await fetch(`${BASE_URL}/agents/get-agent/${address}`);
                const data = await res.json();
                const serializedAgents = serializeAgents(data);
                setAgents(serializedAgents);
                setSelectedAgent(serializedAgents?.[0]);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch agents, Please refresh and retry");
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, [address]);
    // List of agents (can be fetched from an API)
    // const agents = [
    //     { username: "agent_1", name: "Agent One" },
    //     { username: "agent_2", name: "Agent Two" },
    //     { username: "agent_3", name: "Agent Three" },
    //     // Add more agents here
    // ];

    return !loading ? (

        <div className="w-full h-full flex">
            {/* Sidebar (left part) */}
            <div className="w-1/2 p-4 text-white flex flex-col items-start space-y-4">
                <h3 className="text-xl font-semibold">Your Agents</h3>
                {agents.map((agent, index) => (
                    <div
                        key={index}
                        className={`cursor-pointer w-full hover:bg-purple-600/40 p-2 flex flex-row rounded-md ${selectedAgent && selectedAgent.username === agent.username ? 'bg-purple-600/80' : ''}`}
                        onClick={() => setSelectedAgent(agent)}
                    >
                        <div className='flex flex-row w-full justify-between'>
                            <div className='flex flex-row h-full items-center space-x-10'>

                                <Image
                                    src="/logo.gif"
                                    alt="ORCHSTR.AI Assistant"
                                    className="object-cover rounded-full"
                                    width={50}
                                    height={50}
                                />
                                {/* Agent Name */}
                                <div className="text-white font-semibold">{agent.username}</div>
                            </div>
                            <div className="text-white font-semibold">{parseFloat(agent.balance).toFixed(6)} ETH</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right part: Agent details */}
            <div className="flex-1 h-full w-full p-6 bg-transparent rounded-lg shadow-lg relative">
                {selectedAgent ? (
                    <div className="flex flex-col items-center">
                        {/* Image */}
                        <div className="w-full flex justify-center mb-6">
                        </div>
                        <div className="pb-4 mb-6 w-full text-center flex flex-row justify-between items-center">
                            <div className='flex flex-row mx-5 h-full w-full items-center justify-start'>
                                <Image
                                    src="https://imgv3.fotor.com/images/blog-richtext-image/10-profile-picture-ideas-to-make-you-stand-out.jpg"
                                    alt="ORCHSTR.AI Assistant"
                                    width={150}
                                    height={150}
                                    objectFit="contain"
                                />
                                <p className="text-white">{selectedAgent.username}</p>
                            </div>
                            <div className="w-1/2 flex flex-col justify-end items-end mt-10">
                                <div className="text-5xl font-extrabold h-16 text-white">50000$</div>
                                <div className="w-1/2 flex justify-center items-center mt-2">
                                    <OCButton title="Withdraw" type="submit" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4 text-white w-full">
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">Username:</label>
                                <p className="text-white">{selectedAgent.username}</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">API URL:</label>
                                <p className="text-white">{selectedAgent.apiUrl}</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">Description:</label>
                                <p className="text-white">{selectedAgent.description}</p>
                            </div>
                            <div className="flex justify-between items-start">
                                <label className="font-semibold text-white">Cost Per Output Token:</label>
                                <p className="text-white">{selectedAgent.costPerOutputToken}</p>
                            </div>
                        </div>

                        {/* Amount Earned Section */}
                        {/* <div className="w-1/2 flex flex-col justify-center items-center mt-10">
                            <div className="text-3xl font-extrabold h-16 text-white">Amount Earned</div>
                            <div className="text-5xl font-extrabold h-16 text-white">50000$</div>
                            <div className="w-1/2 flex justify-center items-center mt-10">
                                <OCButton title="Withdraw" type="submit" />
                            </div>
                        </div> */}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center items-center text-center text-white h-full w-full">
                        <h2 className="text-2xl font-semibold">Select an Agent to View Details</h2>
                    </div>
                )}
            </div>
        </div >
    ) : (
        <div>
            <div className="text-3xl font-bold text-center">Loading...</div>
        </div>
    );

};

export default AIAgentDashboard;
