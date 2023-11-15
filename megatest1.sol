// SPDX-License-Identifier: MIT
// https://twitter.com/MEGAERC20
// https://www.megaerc20.com/

pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.0/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";

contract MEGALODON is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes, Ownable {

    constructor(address initialOwner)
        ERC20("MEGALODON", "MEGA")
        ERC20Permit("MEGALODON")
        Ownable(initialOwner)
    {
        _mint(msg.sender, 100000000 * 10 ** decimals());
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
}
