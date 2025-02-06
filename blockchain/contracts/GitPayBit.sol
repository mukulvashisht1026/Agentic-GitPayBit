// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract OpenSourceCampaignNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    struct Campaign {
        string githubUsername;
        string repositoryName;
        string campaignName;
        uint256 prizePool;
        address creator;
        address[] maintainers;
        bool exists;
    }

    struct Level {
        uint256 nftSupply;
        string metadataURI;
    }

    struct NFTPayment {
        bool paid;
        uint256 amount;
    }

    mapping(bytes32 => Campaign) public campaigns;
    mapping(bytes32 => mapping(uint256 => Level)) public campaignLevels; // campaignId -> level -> LevelData
    mapping(bytes32 => mapping(address => uint256[])) public contributorLevels; // campaignId -> contributor -> levels
    mapping(uint256 => NFTPayment) public nftPayments; // tokenId -> payment details

    event CampaignCreated(
        bytes32 indexed campaignId,
        string githubUsername,
        string repositoryName,
        string campaignName,
        uint256 prizePool,
        address indexed creator,
        address[] maintainers
    );

    event LevelAssigned(
        bytes32 indexed campaignId,
        address indexed contributor,
        uint256 level
    );

    event NFTMinted(
        bytes32 indexed campaignId,
        address indexed contributor,
        uint256 tokenId,
        uint256 level,
        string metadataURI
    );

    event NFTPaid(
        uint256 indexed tokenId,
        address indexed contributor,
        uint256 amount
    );

    constructor() ERC721("OpenSourceContributionNFT", "OSCNFT") Ownable(msg.sender) {}

    /**
     * @dev Create a new campaign
     */
    function createCampaign(
        string memory _githubUsername,
        string memory _repositoryName,
        string memory _campaignName,
        uint256 _prizePool,
        address[] memory _maintainers,
        uint256[] memory _levelSupplies,
        string[] memory _levelURIs
    ) public {
        require(_levelSupplies.length == _levelURIs.length, "Levels data mismatch");
        bytes32 campaignId = keccak256(
            abi.encodePacked(_githubUsername, _repositoryName, _campaignName, msg.sender)
        );
        
        require(!campaigns[campaignId].exists, "Campaign already exists");

        campaigns[campaignId] = Campaign({
            githubUsername: _githubUsername,
            repositoryName: _repositoryName,
            campaignName: _campaignName,
            prizePool: _prizePool,
            creator: msg.sender,
            maintainers: _maintainers,
            exists: true
        });

        for (uint256 i = 0; i < _levelSupplies.length; i++) {
            campaignLevels[campaignId][i + 1] = Level({
                nftSupply: _levelSupplies[i],
                metadataURI: _levelURIs[i]
            });
        }
        emit CampaignCreated(campaignId, _githubUsername, _repositoryName, _campaignName, _prizePool, msg.sender, _maintainers);
    }

    /**
     * @dev Check if an address is a maintainer
     */
    function isMaintainer(bytes32 campaignId, address user) public view returns (bool) {
        if (campaigns[campaignId].creator == user) return true; // Creator is always a maintainer

        address[] memory maintainers = campaigns[campaignId].maintainers;
        for (uint256 i = 0; i < maintainers.length; i++) {
            if (maintainers[i] == user) return true;
        }
        return false;
    }

    /**
     * @dev Assign a contributor to a specific level
     */
    function assignLevel(bytes32 campaignId, address contributor, uint256 level) public {
        require(campaigns[campaignId].exists, "Campaign does not exist");
        require(isMaintainer(campaignId, msg.sender), "Not authorized");
        require(level > 0, "Invalid level");

        // Ensure contributor doesn't already have this level
        uint256[] storage levels = contributorLevels[campaignId][contributor];
        for (uint256 i = 0; i < levels.length; i++) {
            require(levels[i] != level, "Contributor already assigned this level");
        }

        contributorLevels[campaignId][contributor].push(level);
        emit LevelAssigned(campaignId, contributor, level);
    }

    /**
     * @dev Mint NFT when a contributor reaches a level
     */
    function mintNFT(bytes32 campaignId) public {
        require(campaigns[campaignId].exists, "Campaign does not exist");

        uint256[] storage levels = contributorLevels[campaignId][msg.sender];
        require(levels.length > 0, "No assigned levels");

        for (uint256 i = 0; i < levels.length; i++) {
            uint256 level = levels[i];
            Level storage levelData = campaignLevels[campaignId][level];
            require(levelData.nftSupply > 0, "No NFTs left for this level");

            levelData.nftSupply -= 1;
            _tokenIdCounter += 1;
            _mint(msg.sender, _tokenIdCounter);
            _setTokenURI(_tokenIdCounter, levelData.metadataURI);

            emit NFTMinted(campaignId, msg.sender, _tokenIdCounter, level, levelData.metadataURI);
        }

        // Clear assigned levels after minting NFTs
        delete contributorLevels[campaignId][msg.sender];
    }

    /**
     * @dev Allow maintainers to pay the developer associated with an NFT
     */
    function payNFT(uint256 tokenId) public payable {
        require(ownerOf(tokenId) != address(0), "NFT does not exist");
        require(!nftPayments[tokenId].paid, "NFT payment already made");
        require(msg.value > 0, "No payment provided");

        address owner = ownerOf(tokenId);
        nftPayments[tokenId] = NFTPayment({paid: true, amount: msg.value});
        payable(owner).transfer(msg.value);

        emit NFTPaid(tokenId, owner, msg.value);
    }

    /**
     * @dev Verify if an address owns an NFT from a specific campaign at a certain level
     */
    function verifyNFT(bytes32 campaignId, address contributor, uint256 level) public view returns (bool) {
        uint256[] memory levels = contributorLevels[campaignId][contributor];
        for (uint256 i = 0; i < levels.length; i++) {
            if (levels[i] == level) {
                return true;
            }
        }
        return false;
    }
}
