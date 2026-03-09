// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage {
    uint256 public tokenCount;
    uint256 public constant MAX_SUPPLY = 5000;
    uint256 public constant MINT_PRICE = 0.001 ether;

    address public owner;

    constructor() ERC721("MyNFT", "MNFT") {
        owner = msg.sender;
    }

    function mint(string memory tokenURI) public payable {
        require(tokenCount < MAX_SUPPLY, "Max supply reached");
        require(msg.value >= MINT_PRICE, "Not enough ETH sent");

        tokenCount++;
        uint256 newTokenId = tokenCount;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
    }

    function withdraw() public {
        require(msg.sender == owner, "Not the owner");

        uint256 balance = address(this).balance;
        payable(owner).transfer(balance);
    }
}