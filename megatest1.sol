// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

contract MEGALODON is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes, Ownable {
    // Maximum wallet holding set to 6,000,000 tokens
    uint256 public maxWalletHolding = 6000000;

    // Mapping to keep track of exemptions from the max wallet holding
    mapping(address => bool) private _isExemptFromMaxHolding;

    // Event for updating max wallet holding
    event MaxWalletHoldingUpdated(uint256 newMax);

    // Event for exemption status changes
    event ExemptionStatusChanged(address account, bool isExempt);

    constructor(address initialOwner)
        ERC20("MEGALODON", "MEGA")
        ERC20Permit("MEGALODON")
        Ownable(initialOwner)
    {
        _mint(msg.sender, 100000000 * 10 ** decimals());
    }

    /**
     * @dev Override the transfer function to include custom logic for max wallet holding.
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(
            _isExemptFromMaxHolding[to] || balanceOf(to) + amount <= maxWalletHolding,
            "Recipient exceeds the max wallet holding"
        );

        return super.transfer(to, amount);
    }

    /**
     * @dev Override necessary for ERC20Votes.
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    /**
     * @dev Override necessary for ERC20Permit.
     */
    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }

    /**
     * @dev Allows the owner to set exemptions from the max wallet holding.
     */
    function setExemptionFromMaxHolding(address account, bool exempt) external onlyOwner {
        _isExemptFromMaxHolding[account] = exempt;
        emit ExemptionStatusChanged(account, exempt);
    }

    /**
     * @dev Allows the owner to update the maximum wallet holding. Emits an event upon change.
     */
    function updateMaxWalletHolding(uint256 newMax) external onlyOwner {
        maxWalletHolding = newMax;
        emit MaxWalletHoldingUpdated(newMax);
    }

    /**
     * @dev Allows users to retrieve tokens that were accidentally sent to the contract.
     * @param tokenAddress The address of the ERC20 token to retrieve.
     * @param tokenAmount The amount of tokens to retrieve.
     */
    function retrieveAccidentallySentTokens(address tokenAddress, uint256 tokenAmount) external {
        require(tokenAddress != address(this), "Cannot retrieve tokens of this contract");
        require(ERC20(tokenAddress).transfer(msg.sender, tokenAmount), "Token transfer failed");
    }
}
