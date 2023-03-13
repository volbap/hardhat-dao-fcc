1. Spin up a fresh blockchain node in one terminal:
    - `$ hh node`
2. In another terminal, run the scripts in this order:
    1. Propose `$ hh run scripts/propose.ts --network localhost`
    2. Vote `$ hh run scripts/vote.ts --network localhost`
    3. Queue and Execute `$ hh run scripts/queue-and-execute.ts --network localhost`

This is sort of a simulation of what's done behind the scenes in a DAO's front-end.

This is an example of what the console logs should look like after executing them:

```bash
hardhat-dao-fcc$ hh run scripts/propose.ts --network localhost          
Encoded function call is: 0x6057361d000000000000000000000000000000000000000000000000000000000000004d
Proposing store on Box with arguments 77...
Proposal description: Proposal #1: Store 77 in the box.
Mining 2 empty blocks...
Mined empty block!
Mined empty block!
Saved proposalId = 92036345982565914164947458901932254047689278853816232430592178512004444556817 in local JSON file

hardhat-dao-fcc$ hh run scripts/vote.ts --network localhost             
Mining 6 empty blocks...
Mined empty block!
Mined empty block!
Mined empty block!
Mined empty block!
Mined empty block!
Mined empty block!
Voted! Ready to go!
Proposal state is now: 4 (check out state meanings in 'openzeppelin/contracts/governance/IGovernor.sol')

hardhat-dao-fcc$ hh run scripts/queue-and-execute.ts --network localhost
Queuing proposal...
Proposal queued into TimeLock!
Fast-forwarding 3601 seconds...
Mining 1 empty blocks...
Executing proposal...
Moved 3601 seconds to the future!
Mined empty block!
Proposal executed!
Box new value is 77

hardhat-dao-fcc$ 
```