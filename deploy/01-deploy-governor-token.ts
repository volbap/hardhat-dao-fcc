import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const deployGovernanceToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
    })
    await delegate(governanceToken.address, deployer)
}

const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
    console.log("Delegating...")
    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress)
    const tx = await governanceToken.delegate(delegatedAccount)
    await tx.wait(1)
    console.log(`Delegated voting power to ${delegatedAccount}`)
    console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`)
}

export default deployGovernanceToken
