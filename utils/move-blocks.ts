import { network } from "hardhat"

export async function moveBlocks(amount: number) {
    console.log(`Mining ${amount} empty blocks...`)
    for (let index = 0; index < amount; index++) {
        await network.provider.request({
            method: "evm_mine", // JSON-RPC instruction to mine a block in an EVM-compatible blockchain
            params: [],
        })
        console.log(`Mined empty block!`)
    }
}
