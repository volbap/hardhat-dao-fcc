// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

// ERC20 vs. ERC20Votes

// ERC20Votes includes "checkpoints" (snapshots) to avoid pump & dump schemes.
// With a regular ERC20, people knowing that a hot proposal is coming might buy a lot of tokens, vote,
// and once it's approved, sell all their tokens. We want to avoid that.

contract GovernanceToken is ERC20Votes {
    uint256 public s_maxSupply = 1_000_000e18; // 1 million

    constructor() ERC20("GovernanceToken", "GTO") ERC20Permit("GovernanceToken") {
        _mint(msg.sender, s_maxSupply);
    }

    // The functions below are overrides required by Solidity

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}
