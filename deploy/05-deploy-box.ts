import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"

const deployBox: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
    })
    const timeLock = await ethers.getContract("TimeLock")

    // `box` is a deployment object that doesn't have contract functionality in it.
    // That's why we need to declare `boxContract` using ethers.getContract(...)
    const boxContract = await ethers.getContractAt("Box", box.address)

    // So far, Box is owned by deployer
    // We need Box to be owned by TimeLock
    // This way, TimeLock will be the only one that can call `onlyOwner` functions in Box

    console.log("Transfering ownership of Box to TimeLock...")
    const transferOwnershipTx = await boxContract.transferOwnership(timeLock.address)
    await transferOwnershipTx.wait(1)
    console.log(`Box now belongs to ${timeLock.address}`)
    console.log("All Done!")
}

export default deployBox
