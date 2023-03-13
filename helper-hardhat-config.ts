export const MIN_DELAY = 3600 // 3600 blocks = ~1 hour
export const VOTING_PERIOD = 5 // 5 blocks
export const VOTING_DELAY = 1 // 1 block
export const QUORUM_PERCENTAGE = 4 // 4% of voters need to vote for the proposal in order for it to pass
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

export const developmentChains = ["hardhat", "localhost"]
export const proposalsFile = "proposals.json"

export const PROPOSAL_TARGET = "Box"
export const PROPOSAL_FUNCTION_NAME = "store"
export const PROPOSAL_FUNCTION_ARGS = [77]
export const PROPOSAL_DESCRIPTION = "Proposal #1: Store 77 in the box."
