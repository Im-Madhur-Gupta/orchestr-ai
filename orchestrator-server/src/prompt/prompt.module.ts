import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { LangchainService } from 'src/langchain/langchain.service';

@Module({
  controllers: [PromptController],
  providers: [PromptService, LangchainService],
})
export class PromptModule {}
