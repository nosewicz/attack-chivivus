const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("DefeatChivivus Contract", function () {

  let Contract
  let contract
  let owner
  let user1
  let user2
  const provider = waffle.provider

  beforeEach(async () => {
    Contract = await ethers.getContractFactory("DefeatChivivus");
    [owner, user1, user2] = await ethers.getSigners();
    contract = await Contract.deploy(
      ["Rufus", "Bartholomew", "Sasafraz"],
      ["rufus-image", "bart-image", "sas-image"],
      [100, 150, 500],
      [100, 150, 500],
      "Chivivus Man",
      "chiv-image",
      1000,
      50
    );
    await contract.deployed();
  })

  describe('deployment', () => {
    it('creates Rufus character', async() => {
      const result = await contract.getAllDefaultCharacters()
      const char1Name = result[0].name
      expect(char1Name).to.equal("Rufus")
    })
    it('creates Bartholomew character', async() => {
      const result = await contract.getAllDefaultCharacters()
      const char1Name = result[1].name
      expect(char1Name).to.equal("Bartholomew")
    })
    it('creates Sasafraz character', async() => {
      const result = await contract.getAllDefaultCharacters()
      const char1Name = result[2].name
      expect(char1Name).to.equal("Sasafraz")
    })
    it('creates Chivivus Man as boss', async() => {
      const result = await contract.getChivivus()
      expect(result.name).to.equal("Chivivus Man")
    })
  })

  describe('minting', () => {
    it('user1 mints a Rufus', async() => {
      const result = await contract.connect(user1).mintCharacter(0, {value: ethers.utils.parseEther("0.025")})
      expect(result).to.emit(contract, "CharacterNFTMinted")
    })
    it('user2 mints a Sasafraz', async() => {
      const result = await contract.connect(user2).mintCharacter(2, {value: ethers.utils.parseEther("0.025")})
      expect(result).to.emit(contract, "CharacterNFTMinted")
    })
  })

  describe('attacking Chivivus', () => {

    it('user2s Sasafraz attack Chivivus', async() => {
      const user2Connected = await contract.connect(user2)
      await user2Connected.mintCharacter(2, {value: ethers.utils.parseEther("0.025")})
      const attack = await user2Connected.attack()
      expect(attack).to.emit(contract, "AttackComplete")
      const nft = await user2Connected.checkIfUserHasNFT()
      expect(nft.hp).to.equal(450)
      const chiv = await contract.getChivivus()
      expect(chiv.hp).to.equal(500)
    })
  })

  describe('killing and minting Chivivus', () => {
    it('user2 mints character, attacks twice, kills Chivivus. Then mints Chivivus as prize', async() => {
      const user2Connected = await contract.connect(user2)
      await user2Connected.mintCharacter(2, {value: ethers.utils.parseEther("0.025")})
      const attack = await user2Connected.attack()
      expect(attack).to.emit(contract, "AttackComplete")
      const attack2 = await user2Connected.attack()
      expect(attack2).to.emit(contract, "AttackComplete")
      const chiv = await contract.getChivivus()
      expect(chiv.hp).to.equal(0)
      const chivNft = await user2Connected.mintChivivus()
      expect(chivNft).to.emit(contract, "CharacterNFTMinted")
    })
  })

  describe('owner withdrawing balance', () => {
    it('mint 3 NFTs and get contract balance of 0.075 ETH', async() => {
      await contract.connect(user1).mintCharacter(0, {value: ethers.utils.parseEther("0.025")})
      await contract.connect(user2).mintCharacter(1, {value: ethers.utils.parseEther("0.025")})
      await contract.mintCharacter(2, {value: ethers.utils.parseEther("0.025")})
      const result = await provider.getBalance(contract.address)
      expect(ethers.utils.formatEther(result)).to.equal("0.075")
    })
    it('have owner withdraw 0.075 ETH', async() => {
      await contract.connect(user1).mintCharacter(0, {value: ethers.utils.parseEther("0.025")})
      await contract.connect(user2).mintCharacter(1, {value: ethers.utils.parseEther("0.025")})
      await contract.mintCharacter(2, {value: ethers.utils.parseEther("0.025")})
      let result = await provider.getBalance(contract.address)
      expect(ethers.utils.formatEther(result)).to.equal("0.075")
      await contract.withdraw()
      result = await provider.getBalance(contract.address)
      expect(ethers.utils.formatEther(result)).to.equal("0.0")
    })
    it('have non-owner attempt to withdraw, fail transaction', async() => {
      await contract.mintCharacter(2, {value: ethers.utils.parseEther("0.025")})
      await expect(contract.connect(user1).withdraw()).to.be.reverted
    })
  })

})