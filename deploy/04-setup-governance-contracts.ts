import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ADDRESS_ZERO } from "../helper-hardhat-config"
import { ethers } from "hardhat"

const setupGovernanceContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre
    const { deploy, get } = deployments
    const { deployer } = await getNamedAccounts()

    const timeLock = await ethers.getContract("TimeLock", deployer)
    const governor = await ethers.getContract("GovernorContract", deployer)

    // By default, the deployer of the TimeLock has all the roles (proposer, executor, admin)
    // We need to fix this and set up the roles properly...

    console.log("Setting up roles...")
    
    // The only proposer will be the governor contract
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const proposerTx = await timeLock.grantRole(proposerRole, governor.address)
    await proposerTx.wait(1)
    
    // Anyone can execute the proposal. For that, we pass the address 0x to indicate "anyone"
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    
    // Once all the previous accesses have been set up, we need to actually
    // decentralize the time lock, by making that nobody can admin it anymore.
    // This means we need to revoke the admin access from the deployer.
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE()
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)

    // At this point:
    // - No one owns the time lock, so roles can't change anymore.
    // - The governor contract is the only proposer.
    // - Anyone can execute the proposal once conditions are met.
}

export default setupGovernanceContracts
