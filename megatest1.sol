// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

contract MEGALODON is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes, Ownable {
    // Maximum wallet holding, initially set to 6% of total supply
    uint256 public maxWalletHolding = 100000000 * 10 ** decimals() / 100 * 6;

    // Mapping to keep track of exemptions from the max wallet holding
    mapping(address => bool) private _isExemptFromMaxHolding;

    // Mapping to track the last block for each address
    mapping(address => uint) private _lastTransactionBlock;

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
     * @dev Override the transfer function to include custom logic for max wallet holding and same block transaction restriction.
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(_lastTransactionBlock[msg.sender] != block.number, "Cannot buy and sell in the same block");
        require(
            _isExemptFromMaxHolding[to] || balanceOf(to) + amount <= maxWalletHolding,
            "Recipient exceeds the max wallet holding"
        );

        _lastTransactionBlock[msg.sender] = block.number;
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
}
