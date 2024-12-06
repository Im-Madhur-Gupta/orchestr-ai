"use client";

import React, { useState, useEffect, useRef } from 'react'

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

    return (
        <div className="flex flex-col h-screen p-4">
            <div className="flex-1 overflow-y-auto border p-4 mb-4">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                        <span className={`inline-block p-2 rounded ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                            {message.text}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border p-2 rounded-l text-black bg-white"
                    placeholder="Type a message..."
                />
                <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded-r">
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatScreen