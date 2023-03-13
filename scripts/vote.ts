import { ethers, network } from "hardhat"
import { developmentChains, proposalsFile, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs"

const index = 0

async function main(proposalIndex: number) {
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    const proposalId = proposals[network.config.chainId!][proposalIndex]

    const voteWay = 1 /* 0 = against | 1 = for | 2 = abstain */
    const reason = "I believe this proposal will benefit the community"

    const governor = await ethers.getContract("GovernorContract")
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reason)
    await voteTxResponse.wait(1)

    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }

    console.log("Voted! Ready to go!")

    const proposalState = await governor.state(proposalId)
    console.log(
        `Proposal state is now: ${proposalState} (check out state meanings in 'openzeppelin/contracts/governance/IGovernor.sol')`
    )
}

main(index)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
