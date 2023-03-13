import { ethers, network } from "hardhat"
import {
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
    PROPOSAL_TARGET,
    PROPOSAL_FUNCTION_NAME,
    PROPOSAL_FUNCTION_ARGS,
    PROPOSAL_DESCRIPTION,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import * as fs from "fs"

// To test these scripts, we typically run a node in one terminal: hh node
// so we have all the contracts deployed, and then run our scripts
// in another terminal: hh run scripts/propose.ts --network localhost

/// Allows to propose calling one single function in a target contract
export async function propose(target: string, action: string, args: any[], description: string) {
    const governor = await ethers.getContract("GovernorContract")

    const targetContract = await ethers.getContract(target)

    const encodedFunctionCall = targetContract.interface.encodeFunctionData(action, args)
    console.log(`Encoded function call is: ${encodedFunctionCall}`)
    // Example:
    // - 0x6057361d000000000000000000000000000000000000000000000000000000000000004d
    // Observe here:
    // - 0x6057361d is the selector of the function (4 first bytes)
    // - 0x4d (the last part) is the encoded parameters data (77 in hex is 4d)

    console.log(`Proposing ${action} on ${target} with arguments ${args}...`)
    console.log(`Proposal description: ${description}`)

    const proposeTx = await governor.propose(
        [targetContract.address], // targets
        [0], // values (ETH)
        [encodedFunctionCall], // calldatas
        description // proposal description
    )
    const proposeReceipt = await proposeTx.wait(1)

    if (developmentChains.includes(network.name)) {
        // In a local blockchain nobody is really mining blocks so it's like "time doesn't pass"
        // That's why we need to simulate fast-forwarding blocks so we pass through the required delays
        await moveBlocks(VOTING_DELAY + 1)
    }

    const proposalId = proposeReceipt.events[0].args.proposalId

    // We'll save our proposal ids into a local JSON file
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    proposals[network.config.chainId!.toString()].push(proposalId.toString())
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
    console.log(`Saved proposalId = ${proposalId} in local JSON file`)
}

// propose("Box", "store", [77], "Proposal #1: Store 77 in the box.")
propose(PROPOSAL_TARGET, PROPOSAL_FUNCTION_NAME, PROPOSAL_FUNCTION_ARGS, PROPOSAL_DESCRIPTION)
