// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GitHubAnalyzerNFT is ERC1155, Ownable {
    using Strings for uint256;

    string public name = "GitHub Analyzer NFT";
    string public symbol = "GHANFT";

    // Mapping from user to their highest NFT level
    mapping(address => uint256) public userLevels;

    // Base URI for metadata
    string private baseURI;

    event NFTMinted(address indexed user, uint256 level);
    event NFTUpgraded(address indexed user, uint256 newLevel);

    constructor(string memory _baseURI) ERC1155("") {
        baseURI = _baseURI;
    }

    /**
     * @dev Mint a new NFT based on GitHub profile level.
     * Users can only mint a level higher than their current one.
     */
    function mint(uint256 level) external {
        require(level > 0, "Invalid level");
        require(level > userLevels[msg.sender], "Cannot mint lower or same level");

        // Burn previous level NFT if exists
        if (userLevels[msg.sender] > 0) {
            _burn(msg.sender, userLevels[msg.sender], 1);
        }

        // Update user level
        userLevels[msg.sender] = level;

        // Mint new NFT
        _mint(msg.sender, level, 1, "");

        emit NFTUpgraded(msg.sender, level);
    }

    /**
     * @dev Returns the URI for a specific token ID
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, "/", tokenId.toString(), ".json"));
    }

    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }
}
