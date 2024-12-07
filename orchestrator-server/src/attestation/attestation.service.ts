import { Injectable } from '@nestjs/common';
import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
} from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

const EAS_ADDRESS = '0x4200000000000000000000000000000000000021';

@Injectable()
export class AttestationService {
  constructor() {}

  async createAttestation() {
    const eas = new EAS(EAS_ADDRESS);
    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    // const schemaEncoder = new SchemaEncoder('uint256 eventId, uint8 voteIndex');
    // const encodedData = schemaEncoder.encodeData([
    // { name: 'eventId', value: 1, type: 'uint256' },
    // { name: 'voteIndex', value: 1, type: 'uint8' },
    // ]);

    // string response;
    // string prompt;
    // string jobId; // associated job id
    // address agentAddress; // mpc wallet address of the agent
    // uint256 amount; // amount of ETH sent to the agent

    const schemaEncoder = new SchemaEncoder(
      'string response, string prompt, string jobId, address agentAddress, uint256 amount',
    );
    const encodedData = schemaEncoder.encodeData([
      { name: 'response', value: 'response', type: 'string' },
      { name: 'prompt', value: 'prompt', type: 'string' },
      { name: 'jobId', value: 'jobId', type: 'string' },
      { name: 'agentAddress', value: 'agentAddress', type: 'address' },
      { name: 'amount', value: 0, type: 'uint256' },
    ]);

    const schemaUID =
      '0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995';

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
        expirationTime: 0,
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();

    console.log('New attestation UID:', newAttestationUID);
  }

  async deploySchema() {
    const schemaRegistryContractAddress = EAS_ADDRESS;
    const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

    schemaRegistry.connect(signer);

    const schema = 'uint256 eventId, uint8 voteIndex';
    const resolverAddress = '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0'; // Sepolia 0.26
    const revocable = true;

    const transaction = await schemaRegistry.register({
      schema,
      resolverAddress,
      revocable,
    });

    // Optional: Wait for transaction to be validated
    await transaction.wait();
  }
}
