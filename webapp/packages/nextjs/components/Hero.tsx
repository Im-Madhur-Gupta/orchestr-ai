import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";

const HeroSection = () => {
  const [displayText, setDisplayText] = useState("");
  const [prompt, setPrompt] = useState("");
  const productName = "ORCHESTR.AI";

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= productName.length) {
        setDisplayText(productName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  const handlePromptChange = (e: any) => {
    setPrompt(e.target.value);
  };

  const handleSendPrompt = () => {
    if (prompt.trim()) {
      // Here you would typically send the prompt to your AI service
      console.log("Sending prompt:", prompt);
      // Optional: Clear the input after sending
      // setPrompt('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      handleSendPrompt();
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="bg-black flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Logo and Title Container */}
          <div className="flex flex-col items-center justify-center space-x-6 mb-6">
            <Image
              src="/logo.gif"
              alt="ORCHSTR.AI Assistant"
              className="object-cover rounded-full"
              width={350}
              height={350}
            />

            {/* Product Name with Typewriting Effect */}
            <h1 className="text-6xl font-extrabold h-16">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 text-transparent bg-clip-text">
                {displayText}
              </span>
            </h1>
          </div>

          {/* Input Bar Section */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={handlePromptChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full pl-6 pr-36 py-4 bg-gray-800/70 border border-gray-700/50 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition duration-300 ease-in-out"
              />
              <button
                onClick={handleSendPrompt}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out border border-purple-500/30 hover:border-purple-500/50 flex items-center space-x-2"
              >
                <span>Send</span>
                <Send size={18} className="ml-2" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Orchestrate your AI workflows with unprecedented intelligence and
            seamless coordination.
          </p>

          {/* Subtle Background Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
