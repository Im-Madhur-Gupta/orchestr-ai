import { Injectable } from '@nestjs/common';
import { LangchainService } from '../langchain/langchain.service';
import { TestPromptDto } from './dto/test-prompt.dto';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { z } from 'zod';
import { StartExecutionDto } from './dto/start-execution.dto';
import { PromptHistoryDto } from './dto/prompt-history.dto';
import { Coinbase, readContract } from '@coinbase/coinbase-sdk';
import { CONSTANTS } from 'src/utils/constants';
import { OrchestratorAbi } from 'src/utils/orchestrator-abi';

const CONTRACT_ADDRESS = '0x0905f0501E05C64D2e8B706148bae5bee7Dbc7aE';

@Injectable()
export class PromptService {
  constructor(private readonly langchainService: LangchainService) {}

  async test(testPromptDto: TestPromptDto) {
    const { prompt, model } = testPromptDto;

    if (model === 'openai') {
      const response = await this.langchainService.getChatGPTResponse(prompt);
      return { model, response };
    } else if (model === 'anthropic') {
      const response = await this.langchainService.getAnthropicResponse(prompt);
      return { model, response };
    } else if (model === 'google') {
      const response = await this.langchainService.getGoogleResponse(prompt);
      return { model, response };
    } else {
      return {
        error: 'Invalid model selected. Choose either "openai" or "anthropic".',
      };
    }
  }

  async create(createPromptDto: CreatePromptDto) {
    return {
      prompt: 'I have a website www.hello.com, help me optimise seo',
      response: [
        {
          agentAddress: '0x9cDb3b423693Be536CFD5F29B2716BbA2146CE96',
          agentPrompt: 'Scrape data from website www.hello.com',
          agentPrice: 0.001,
        },
        {
          agentAddress: '0xC039654Bf76d6aF77A851c26167FBf07405C59BA',
          agentPrompt: 'Extract meaningful information from data',
          agentPrice: 0.002,
        },
        {
          agentAddress: '0x84BbE7540E517Bd508CEa95BcA1Ed6Cae6656302',
          agentPrompt: 'Suggest SEO optimisations',
          agentPrice: 0.003,
        },
      ],
    };

    const { prompt } = createPromptDto;

    const data = `
      I have a list of agents that specialize in different tasks. Find the best agents based on the request and return them in array.
      Each object should be of form { agentAddress: string, agentPrompt: string }
      The request is: ${prompt}
      The agents are:
      1. agentAddress = 0x9cDb3b423693Be536CFD5F29B2716BbA2146CE96 - Specialises in scraping data from websites
      2. agentAddress = 0xC039654Bf76d6aF77A851c26167FBf07405C59BA - Specialises in extracting meaningful information from data
      3. agentAddress = 0x84BbE7540E517Bd508CEa95BcA1Ed6Cae6656302 - Specialises in suggesting seo optimisations
      AgentAddress is the agent address ethereum and agentPrompt is the prompt to be given to the agent
    `;

    const schema = z.object({
      data: z.array(
        z.object({
          agentAddress: z.string(),
          agentPrompt: z.string(),
        }),
      ),
    });

    const response = await this.langchainService.getChatGPTStructuredResponse(
      data,
      schema,
    );

    return {
      prompt: data,
      response: response.data,
    };
  }

  async startExecution(startExecutionDto: StartExecutionDto) {
    const { data } = startExecutionDto;

    let prevResponse: undefined | string = undefined;

    const outputs = [];

    for (const item of data) {
      let oldInput = `Prompt: ${item.agentPrompt}
      ${prevResponse ? `Input: ${prevResponse}` : ''}
      `;
      if (oldInput.includes('https://')) {
        const url = oldInput.match(/https:\/\/[^\s]+/);
        oldInput = url.toString();
      }

      const input = oldInput;

      const res = await fetch(item.agentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      const response = await res.json();

      console.log('response', { item: item, response: response });

      outputs.push({
        agentAddress: item.agentAddress,
        response: response.response,
        prompt: input,
      });

      prevResponse = response.response;
    }

    return {
      outputs,
    };
  }

  async getHistory(promptHistoryDto: PromptHistoryDto): Promise<any> {
    Coinbase.configure({
      apiKeyName: CONSTANTS.COINBASE_KEY_NAME,
      privateKey: CONSTANTS.COINBASE_KEY,
    });

    const jobs = await readContract({
      contractAddress: CONTRACT_ADDRESS,
      method: 'getJobsByUser',
      args: {
        userAddress: promptHistoryDto.userAddress,
      },
      abi: OrchestratorAbi as any,
      networkId: 'base-sepolia',
    });

    return jobs;
  }
}
