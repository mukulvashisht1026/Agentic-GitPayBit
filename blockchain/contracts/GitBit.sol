// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract GitBitNFT is ERC1155 {

    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    constructor() ERC1155("localhost:3000/api/item/{id}.json") {
        _mint(msg.sender, GOLD, 10**18,"");
        _mint(msg.sender, SILVER, 10**18, "");
        _mint(msg.sender, THORS_HAMMER, 1, "");
        _mint(msg.sender, SWORD, 10**18, "");
        _mint(msg.sender, SHIELD, 10**18, "");
    }   
}