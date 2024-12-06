// SPDX-License-Identifier: MPL-2.0
pragma solidity ^0.8.27;

contract AgentMarketPlace {
	enum JobStatus {
		InProgress,
		Completed,
		Canceled
	}

	struct Job {
		address[] agentAddresses;
		uint256[] amounts;
		string promptMetadataUri;
		address userAddress;
		JobStatus jobStatus;
		uint256 totalAmount;
	}

	struct Agent {
		address mpcWalletAddress;
		address ownerAddress;
		string metadataId;
	}

	// State variables
	mapping(address => string[]) public userAddressToJobIds; // user address -> job ids
	mapping(string => Job) public jobs; // job id -> Job

	address[] public registeredAgentAddresses; // all registered agent addresses
	mapping(address => Agent) public registeredAgents; // agent address -> Agent

	event AgentRegistered(address mpcWallet, address owner, string metadataId);
	event FundsAccepted(
		string indexed jobId,
		address[] agents,
		uint256[] amounts
	);
	event FundsDisbursed(string indexed jobId, address[] agents);

	error InvalidArrayLengths();
	error JobAlreadyExists();
	error JobDoesNotExist();
	error UnauthorizedAgent();
	error InvalidAmount();
	error AgentAlreadyRegistered();

	constructor() {}

	function getJobsByUser(address userAddress) external view returns (Job[] memory) {
		string[] memory jobIds = userAddressToJobIds[userAddress];
		Job[] memory jobsByUser = new Job[](jobIds.length);
		for (uint256 i = 0; i < jobIds.length; i++) {
			jobsByUser[i] = jobs[jobIds[i]];
		}
		return jobsByUser;
	}

	function getAgents() external view returns (Agent[] memory) {
		Agent[] memory agents = new Agent[](registeredAgentAddresses.length);
		for (uint256 i = 0; i < registeredAgentAddresses.length; i++) {
			agents[i] = registeredAgents[registeredAgentAddresses[i]];
		}
		return agents;
	}

	function registerAgent(
		address mpcWalletAddress,
		address ownerAddress,
		string calldata metadataId
	) external {
		if (registeredAgents[mpcWalletAddress].mpcWalletAddress != address(0))
			revert AgentAlreadyRegistered();

		registeredAgents[mpcWalletAddress] = Agent({
			mpcWalletAddress: mpcWalletAddress,
			ownerAddress: ownerAddress,
			metadataId: metadataId
		});
		registeredAgentAddresses.push(mpcWalletAddress);

		emit AgentRegistered(mpcWalletAddress, ownerAddress, metadataId);
	}

	function acceptFunds(
		string calldata jobId,
		address[] calldata agentAddresses,
		uint256[] calldata amounts,
		string calldata promptMetadataUri
	) external payable {
		if (agentAddresses.length != amounts.length)
			revert InvalidArrayLengths();
		if (jobs[jobId].userAddress != address(0)) revert JobAlreadyExists();

		uint256 totalAmount;

		for (uint256 i = 0; i < agentAddresses.length; i++) {
			require(
				registeredAgents[agentAddresses[i]].mpcWalletAddress !=
					address(0),
				"Agent not registered"
			);
			totalAmount += amounts[i];
		}

		require(msg.value == totalAmount, "Incorrect ETH amount sent");

		jobs[jobId] = Job({
			agentAddresses: agentAddresses,
			amounts: amounts,
			promptMetadataUri: promptMetadataUri,
			userAddress: msg.sender,
			jobStatus: JobStatus.InProgress,
			totalAmount: totalAmount
		});
		userAddressToJobIds[msg.sender].push(jobId);

		emit FundsAccepted(jobId, agentAddresses, amounts);
	}

	function disburseFunds(
		string calldata jobId,
		string[] calldata attestations
	) external {
		Job storage job = jobs[jobId];
		if (job.userAddress == address(0)) revert JobDoesNotExist();
		require(job.jobStatus == JobStatus.InProgress, "Job not in progress");

		// Verify attestations (implement your verification logic here)
		// For now, we'll assume attestations are valid

		address[] memory agentAddresses = job.agentAddresses;
		for (uint256 i = 0; i < agentAddresses.length; i++) {
			require(
				registeredAgents[agentAddresses[i]].mpcWalletAddress !=
					address(0),
				"Invalid agent"
			);
			payable(agentAddresses[i]).transfer(job.amounts[i]);
		}

		job.jobStatus = JobStatus.Completed;
		emit FundsDisbursed(jobId, agentAddresses);
	}
}
