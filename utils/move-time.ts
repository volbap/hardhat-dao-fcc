import { network } from "hardhat"

export async function moveTime(amount: number) {
    console.log(`Fast-forwarding ${amount} seconds...`)
    await network.provider.send("evm_increaseTime", [amount])
    console.log(`Moved ${amount} seconds to the future!`)
}
