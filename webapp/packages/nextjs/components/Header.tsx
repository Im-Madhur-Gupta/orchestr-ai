"use client";

import React from "react";
import OCButton from "./Button";
import {
  // FaucetButton,
  RainbowKitCustomConnectButton,
} from "~~/components/scaffold-eth";

interface IHeaderProps {
  onClick: () => void;
  hideReg: boolean;
}
export const Header = ({ onClick, hideReg }: IHeaderProps) => {
  return (
    <div className="w-full flex justify-between py-6 px-16">
      <div className="flex flex-row gap-x-10 items-center">
        <div className="text-lg text-gray-600">ORCHESTR.AI</div>
        {!hideReg && <OCButton title="Register Agent" onClick={onClick} />}
      </div>
      <div className="flex flex-row gap-x-10 items-center">
        <RainbowKitCustomConnectButton />
      </div>
    </div>
  );
};
