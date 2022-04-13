import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, transformCharacterData } from './constants'
import defeatChivivus from '../artifacts/contracts/DefeatChivivus.sol/DefeatChivivus.json'

const SelectCharacter = ({ setCharacterNFT }) => {

  const [characters, setCharacters] = useState([])
  const [contract, setContract] = useState(null)
  const [mintingCharacter, setMintingCharacter] = useState(false)

  const mintCharacterNFTAction = async (characterId) => {
    try {
      if(contract) {
        setMintingCharacter(true)
        console.log("minting character...")
        const mintTxn = await contract.mintCharacter(characterId, {value: ethers.utils.parseEther("0.025")})
        await mintTxn.wait()
        console.log("mintTxn: ", mintTxn)
        setMintingCharacter(false)
      }
    } catch (error) {
      console.warn("MintCharacterAction Error: ", error)
      alert("MintCharacterAction Error: ", error)
      setMintingCharacter(false)
    }
  }

  useEffect(() => {
    const { ethereum } = window

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, defeatChivivus.abi, signer)

      setContract(contract)
    } else {
      console.log("Ethererum object not found")
    }
  }, [])

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("fetching contract characters")
        const charactersTxn = await contract.getAllDefaultCharacters()
        console.log("charactersTxn: ", charactersTxn)

        const characters = charactersTxn.map((characterData) => 
          transformCharacterData(characterData)
        )
        setCharacters(characters)
      } catch (error) {
        console.error("Something went wrong fetching characters: ", error)
      }
    }

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`)
      if(contract) {
        const characterNFT = await contract.checkIfUserHasNFT()
        console.log("Character NFT: ", characterNFT)
        setCharacterNFT(transformCharacterData(characterNFT))
      }
    }

    if (contract) {
      getCharacters()
      contract.on("CharacterNFTMinted", onCharacterMint)
    }

    return () => {
      if (contract) {
        contract.off("CharacterNFTMinted", onCharacterMint)
      }
    }
  }, [contract])

  const renderCharacters = () => 
    characters.map((character, index) => (
      <div className="character-item max-w-[30%]" key={character.name}>
        <div className="name-container">
          <p className="text-xl text-teal-500 font-bold">{character.name}</p>
        </div>
        <img src={`https://cloudflare-ipfs.com/ipfs/${character.imageURI}`} alt={character.name} />
        <button
          type="button"
          className="character-mint-button bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded text-center my-5"
          onClick={()=> mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ))
  

  return (
    <div className="select-character-container container mx-auto px-4">
      <p className="text-2xl text-slate-400 font-bold">Select your fighter:</p>
      {characters.length > 0 && (
        <div className="character-grid flex flex-row justify-center content-evenly gap-8">{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <p className="text-slate-400">Minting in progress...</p>
      )}
    </div>
  )
}

export default SelectCharacter