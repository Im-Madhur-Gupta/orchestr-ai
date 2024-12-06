// SPDX-License-Identifier: MPL-2.0
pragma solidity ^0.8.27;

contract AgentMarketPlace {
	// total earned by each agent
	mapping(string => address) public agentIdToAgentAddress;
	// attester whitelist
	mapping(address attester => bool allowed) public whitelist;

	enum JobStatus {
		InProgress,
		Completed,
		Canceled
	}
	struct Job {
		address fromUserWallet;
		address toAgentAddress;
		uint256 value;
		uint256 time;
		JobStatus jobstatus;
	}

	constructor() {}
}
