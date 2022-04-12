// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./libraries/Base64.sol";

contract DefeatChivivus is ERC721URIStorage {
  
  struct Chivivus {
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
    address defeater;
  }

  struct CharacterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
  }

  address payable public owner;
  Chivivus public chivivus;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  Counters.Counter private _chivCount;
  Counters.Counter private _specialCount;
  CharacterAttributes[] defaultCharacters;

  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  mapping(address => uint256) public nftHolders;

  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event AttackComplete(uint newBossHp, uint newPlayerHp);

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint256[] memory characterHp,
    uint256[] memory characterAttackDamage,
    string memory chivivusName,
    string memory chivivusImageURI,
    uint256 chivivusHp,
    uint256 chivivusAttackDamage
  ) ERC721("Attack Chivivus Man!", "CHV") payable {
    owner = payable(msg.sender);

    chivivus = Chivivus({
      name: chivivusName,
      imageURI: chivivusImageURI,
      hp: chivivusHp,
      maxHp: chivivusHp,
      attackDamage: chivivusAttackDamage,
      defeater: owner
    });

    for(uint i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(CharacterAttributes({
        characterIndex: i,
        name: characterNames[i],
        imageURI: characterImageURIs[i],
        hp: characterHp[i],
        maxHp: characterHp[i],
        attackDamage: characterAttackDamage[i]
      }));
    }
    _tokenIds.increment();
  }

  function mintCharacter(uint256 _characterIndex) external payable {
    require(msg.value >= 0.25 * 10**17, "Not enough ETH paid");

     if(_characterIndex == 2) {
      require(_specialCount.current() < 3, "Character at Max Mint amount, select another");
      _specialCount.increment();
    }

    uint256 newItemId = _tokenIds.current();

    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].maxHp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage
    });

    nftHolders[msg.sender] = newItemId;

    CharacterAttributes memory charAttributes = nftHolderAttributes[newItemId];

    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

    string memory json = Base64.encode(
      abi.encodePacked(
        '{"name": "',
        charAttributes.name,
        ' -- NFT #: ',
        Strings.toString(newItemId),
        '", "description": "This is an NFT to battle the mysterious Chivivus Man!", "image": "ipfs://',charAttributes.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value": ',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',strAttackDamage,'} ]}'
      )
    );

    string memory output = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, output);

    
    _tokenIds.increment();
    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
  }

  function mintChivivus() external {
    require(_chivCount.current() < 1, "Chivivous has already been minted");
    require(chivivus.defeater == msg.sender, "you did not defeat Chivivus Man. Cannot mint.");

    uint256 newItemId = _tokenIds.current();

    string memory strMaxHp = Strings.toString(chivivus.maxHp);
    string memory strAttackDamage = Strings.toString(chivivus.attackDamage);

    string memory json = Base64.encode(
      abi.encodePacked(
        '{"name": "',
        chivivus.name,
        ' -- NFT 1 of 1", "description": "The Legendary Chivivus Man!", "image": "ipfs://',chivivus.imageURI,
        '", "attributes": [ { "trait_type": "Health Points", "value": ',strMaxHp,', "max_value": ',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',strAttackDamage,'} ]}'
      )
    );

    string memory output = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, output);

    nftHolders[msg.sender] = newItemId;
    emit CharacterNFTMinted(msg.sender, newItemId, 3);
    _tokenIds.increment();
    _chivCount.increment();
  }

  function attack() public {
    uint id = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[id];
    require(player.hp > 0, "Error: character must have HP to attack");
    require(chivivus.hp > 0, "Error: Chivivus must have Hp to get attacked");

    if (chivivus.hp <= player.attackDamage) {
      chivivus.hp = 0;
      chivivus.defeater = msg.sender;
    } else {
      chivivus.hp = chivivus.hp - player.attackDamage;
    }
    
    if (player.hp < chivivus.attackDamage) {
      player.hp = 0;
    } else {
      player.hp = player.hp - chivivus.attackDamage; 
    }

    emit AttackComplete(chivivus.hp, player.hp);
  }

  function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
    uint256 id = nftHolders[msg.sender];

    if (id > 0) {
      return nftHolderAttributes[id];
    } else {
      CharacterAttributes memory emptyStruct;
      return emptyStruct;
    }
  }

  function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
    return defaultCharacters;
  }

  function getChivivus() public view returns (Chivivus memory) {
    return chivivus;
  }

  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  function isOwner() public view returns (bool) {
    return msg.sender == owner;
  }

  function withdraw() public onlyOwner {
    uint amount = address(this).balance;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "failed to withdraw balance");
  }
}