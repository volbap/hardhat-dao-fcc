import { ethers, network } from "hardhat"
import {
    developmentChains,
    PROPOSAL_FUNCTION_NAME,
    PROPOSAL_FUNCTION_ARGS,
    PROPOSAL_DESCRIPTION,
    MIN_DELAY,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

export async function queueAndExecute() {
    const box = await ethers.getContract("Box")
    const encodedFunctionCall = box.interface.encodeFunctionData(
        PROPOSAL_FUNCTION_NAME,
        PROPOSAL_FUNCTION_ARGS
    )
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION))

    const governor = await ethers.getContract("GovernorContract")

    // QUEUE
    console.log("Queuing proposal...")
    const queueTx = await governor.queue(
        [box.address], // targets
        [0], // values (ETH)
        [encodedFunctionCall], // calldatas
        descriptionHash // proposal description hashed
    )
    await queueTx.wait(1)
    console.log("Proposal queued into TimeLock!")

    // FAST-FORWARD TIME
    if (developmentChains.includes(network.name)) {
        moveTime(MIN_DELAY + 1)
        moveBlocks(1)
    }

    // EXECUTE!
    console.log("Executing proposal...")
    const executeTx = await governor.execute(
        [box.address], // targets
        [0], // values (ETH)
        [encodedFunctionCall], // calldatas
        descriptionHash // proposal description hashed
    )
    await queueTx.wait(1)
    console.log("Proposal executed!")

    const boxNewValue = await box.retrieve()
    console.log(`Box new value is ${boxNewValue}`)
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
