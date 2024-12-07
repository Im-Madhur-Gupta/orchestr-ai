import { Injectable } from '@nestjs/common';
import {
  AgentDto,
  AgentMetadata,
  CreateAgentDto,
  FullAgentDto,
} from './dto/create-agent.dto';
import {
  Wallet as CoinbaseWallet,
  Coinbase,
  readContract,
} from '@coinbase/coinbase-sdk';
import { CONSTANTS } from 'src/utils/constants';
import * as fs from 'fs';
import axios from 'axios';
import { OrchestratorAbi } from 'src/utils/orchestrator-abi';
import { ethers } from 'ethers';
import { ExtractFundsDto } from './dto/extract-funds.dto';

const CONTRACT_ADDRESS = '0x0905f0501E05C64D2e8B706148bae5bee7Dbc7aE';

@Injectable()
export class AgentsService {
  async create(createAgentDto: CreateAgentDto) {
    const {
      agentDescription,
      agentImage,
      apiUrl,
      costPerOutputToken,
      userAddress,
      agentName,
    } = createAgentDto;

    Coinbase.configure({
      apiKeyName: CONSTANTS.COINBASE_KEY_NAME,
      privateKey: CONSTANTS.COINBASE_KEY,
    });
    const wallet = await CoinbaseWallet.import({
      walletId: '20e101e3-50ce-4d3c-bbc3-2d2928e50f21',
      seed: 'ecb99d925322b02128133da0cdf2276acda8f08611d98162450ab7b052d12a4d',
    });
    // const wallet = await CoinbaseWallet.create();

    const address = await wallet.getDefaultAddress();

    const agentAddress = address.getId();

    const tx = await wallet.faucet();
    await tx.wait();

    fs.writeFileSync(`${agentAddress}.json`, JSON.stringify(wallet.export()));

    const agentData: AgentMetadata = {
      agentDescription,
      agentImage,
      apiUrl,
      costPerOutputToken,
      agentName,
    };

    const data = JSON.stringify(agentData);

    const response = await axios.put(
      'https://publisher.walrus-testnet.walrus.space/v1/store',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      },
    );

    let blobId = '';

    if (response.data.alreadyCertified) {
      blobId = response.data.alreadyCertified.blobId;
    } else {
      blobId = response.data.newlyCreated.blobObject.blobId;
    }

    const agent: AgentDto = {
      agentAddress: agentAddress,
      blobId: blobId,
      userAddress: userAddress,
    };

    const invocation = await wallet.invokeContract({
      contractAddress: CONTRACT_ADDRESS,
      method: 'registerAgent',
      args: {
        mpcWalletAddress: agentAddress,
        metadataId: agent.blobId,
        ownerAddress: userAddress,
      },
      abi: OrchestratorAbi,
    });

    const newInvocation = await invocation.wait();
    const txHash = newInvocation.getTransactionHash();

    return {
      agent: agent,
      hash: txHash,
    };
  }

  async extractFunds({
    agentAddress,
    signature,
    userAddress,
  }: ExtractFundsDto) {
    Coinbase.configure({
      apiKeyName: CONSTANTS.COINBASE_KEY_NAME,
      privateKey: CONSTANTS.COINBASE_KEY,
    });

    const message = `Extract funds from ${agentAddress}`;

    const signerAddress = ethers.verifyMessage(message, signature);

    if (signerAddress !== userAddress) {
      throw new Error('Invalid signature');
    }

    const wallet = await CoinbaseWallet.import({
      walletId: '20e101e3-50ce-4d3c-bbc3-2d2928e50f21',
      seed: 'ecb99d925322b02128133da0cdf2276acda8f08611d98162450ab7b052d12a4d',
    });

    const balance = await wallet.getBalance(Coinbase.assets.Eth);

    const transfer = await wallet.createTransfer({
      amount: balance,
      assetId: Coinbase.assets.Eth,
      destination: userAddress,
    });

    const newTransfer = await transfer.wait();

    return {
      message: 'Funds extracted successfully',
      txHash: newTransfer.getTransactionHash(),
    };
  }

  async getAgents(): Promise<FullAgentDto[]> {
    Coinbase.configure({
      apiKeyName: CONSTANTS.COINBASE_KEY_NAME,
      privateKey: CONSTANTS.COINBASE_KEY,
    });

    const agents = await readContract({
      contractAddress: CONTRACT_ADDRESS,
      method: 'getAgents',
      args: {},
      abi: OrchestratorAbi as any,
      networkId: 'base-sepolia',
    });

    const agentsArray: FullAgentDto[] = [];

    if (agents) {
      for (const agent of agents) {
        const agentAddress = agent.mpcWalletAddress;
        const metadataId = agent.metadataId;
        const ownerAddress = agent.ownerAddress;

        const metadata = await fetch(
          `https://aggregator.walrus-testnet.walrus.space/v1/${metadataId}`,
        );

        const data = await metadata.json();

        const dataObj = JSON.parse(data.body);

        const fullAgent: FullAgentDto = {
          agentAddress,
          ...dataObj,
          ownerAddress,
          metadataId,
        };

        agentsArray.push(fullAgent);
      }

      console.log(agentsArray);

      return agentsArray;
    }
  }

  async getMyAgent(userAddress: string): Promise<FullAgentDto> {
    Coinbase.configure({
      apiKeyName: CONSTANTS.COINBASE_KEY_NAME,
      privateKey: CONSTANTS.COINBASE_KEY,
    });

    const agents = await readContract({
      contractAddress: CONTRACT_ADDRESS,
      method: 'getAgents',
      args: {},
      abi: OrchestratorAbi as any,
      networkId: 'base-sepolia',
    });

    if (agents) {
      const myAgent = agents.find(
        (agent) =>
          agent.ownerAddress.toLowerCase() === userAddress.toLowerCase(),
      );

      const metadata = await fetch(
        `https://aggregator.walrus-testnet.walrus.space/v1/${myAgent.metadataId}`,
      );

      const data = await metadata.json();

      const dataObj = JSON.parse(data.body);

      const fullAgent: FullAgentDto = {
        agentAddress: myAgent.mpcWalletAddress,
        ...dataObj,
        ownerAddress: myAgent.ownerAddress,
        metadataId: myAgent.metadataId,
      };

      return fullAgent;
    }

    return null;
  }
}
