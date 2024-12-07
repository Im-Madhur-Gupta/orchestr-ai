import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptModule } from './prompt/prompt.module';
import { LangchainService } from './langchain/langchain.service';
import { AgentsModule } from './agents/agents.module';
import { AttestationService } from './attestation/attestation.service';

@Module({
  imports: [PromptModule, AgentsModule],
  controllers: [AppController],
  providers: [AppService, LangchainService, AttestationService],
})
export class AppModule {}
