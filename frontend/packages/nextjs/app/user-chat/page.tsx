"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState, useEffect, useRef } from 'react'
import { useAccount } from 'wagmi';

const ChatScreen = () => {


    const [messages, setMessages] = useState<{ sender: string, text: string }[]>([])
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const handleSend = () => {
        if (input.trim() === "") return

        const newMessage = { sender: "user", text: input }
        setMessages([...messages, newMessage])
        setInput("")

        setTimeout(() => {
            const botResponse = { sender: "bot", text: "Hi" }
            setMessages(prevMessages => [...prevMessages, botResponse])
        }, 5000)
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const { isConnected } = useAccount();

    return (
        <div className="relative flex flex-col h-screen w-screen"
            style={{ backgroundImage: "url('/bg_1.png')", backgroundSize: 'contain' }}
        >
            <div className="absolute inset-0 bg-black opacity-80"></div>
            <div className="relative z-10 flex flex-col h-full w-full items-center justify-center">
                {isConnected && (
                    <div className="absolute top-4 right-4">
                        <ConnectButton />
                    </div>
                )}
                <div className='pb-10 text-8xl text-white'>
                    OrchestrAI
                </div>
                <div className="flex w-full px-80">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 border p-2 rounded-xl text-black bg-white"
                        style={{
                            height: '50px',
                            width: '100px'
                        }}
                        placeholder="Type a message..."
                    />
                </div>
                {isConnected ? (
                    <button onClick={handleSend} className="bg-blue-500 mt-10 w-40 text-lg text-white p-2 rounded-xl bg-blue-950"
                        style={{
                            height: '50px',
                            width: '300px'
                        }}
                    >
                        Let the voyage begin!!
                    </button>
                ) : (
                    <div className="text-white mt-10 flex flex-col items-center justify-center">
                        Connect your wallet to start interacting with agents
                        <div className='pt-2'>
                            <ConnectButton />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatScreen