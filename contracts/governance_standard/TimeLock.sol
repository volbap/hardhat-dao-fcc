// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

// The TimeLock is the contract that is actually the owner of our target contract (Box.sol)
// We want to *wait* for a new vote to be executed.

// This contract expects conditions to be met before actually executing the proposal.

// Give users time to get out if they don't like a governance update.

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    /// @param minDelay How long to wait, in blocks, before allowing execution
    /// @param proposers The list of addresses that can propose (typically only the GovernorContract address can propose)
    /// @param executors Who can execute this proposal once `minDelay` has passed (typically everyone)
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors, msg.sender) {}
}
