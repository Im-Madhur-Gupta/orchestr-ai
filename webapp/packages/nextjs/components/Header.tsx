"use client";

import React from "react";
import OCButton from "./Button";
import {
  // FaucetButton,
  RainbowKitCustomConnectButton,
} from "~~/components/scaffold-eth";

export const Header = () => {
  return (
    <div className="w-full flex justify-between py-6 px-16">
      <div className="flex flex-row gap-x-10 items-center">
        <div className="text-lg text-gray-600">ORCHESTR.AI</div>
        <OCButton
          title="Register Agent"
          onClick={() => {
            console.log("clicked");
          }}
        />
      </div>
      <div className="flex flex-row gap-x-10 items-center">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
