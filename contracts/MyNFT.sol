// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 public mintPrice = 0.001 ether;

    constructor(address initialOwner) ERC721("MyNFT", "MyNFT") Ownable(msg.sender) {}

    function mint(address recipient, string memory _tokenURI) public payable returns(uint256){
        require(msg.value >= mintPrice, "Not enough Avax sent");
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        return newItemId;
    }

    function withdrawFee() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns(string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns(bool) {
        return super.supportsInterface(interfaceId);
    }
}

