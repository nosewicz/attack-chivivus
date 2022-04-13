import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, transformCharacterData, transformChivData } from './constants'
import defeatChivivus from '../artifacts/contracts/DefeatChivivus.sol/DefeatChivivus.json'

const Arena = ({ characterNFT, setCharacterNFT, currentAccount }) => {

  const [contract, setContract] = useState(null)
  const [boss, setBoss] = useState(null)
  const [attackState, setAttackState] = useState('')
  const [showToast, setShowToast] = useState(false)

  const runAttackAction = async () => {
    try {
      if (contract) {
        setAttackState('attacking')
        console.log('attacking boss...')
        const attackTxn = await contract.attack()
        await attackTxn.wait()
        console.log('attackTxn: ', attackTxn)
        setAttackState('hit')
        setShowToast(true)
        setTimeout(() => {
          setShowToast(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Error attacking Chivivus Man: ", error)
      setAttackState('')
    }
  }

  const mintBoss = async (boss) => {
    try {
      if (ethereum && contract) {
        console.log("Account attempting to mint Chivivus: ", currentAccount)
        if(boss.defeater.toLowerCase() === currentAccount.toLowerCase()) {
          const mintBossTxn = await contract.mintChivivus()
          await mintBossTxn.wait()
          console.log("mintBossTxn: ", mintBossTxn)
        } else {
          console.log("You are not the defeater of Chivivus Man. You Cannot Mint.")
        }
      }
    } catch (error) {
      console.error("Error Minting Chivivus Man", error)
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
      console.log("ethereum object not found")
    }
  }, [])

  useEffect(() => {
    const fetchChivivus = async () => {
      const chivTxn = await contract.getChivivus()
      console.log("Chivivus: ", chivTxn)
      setBoss(transformChivData(chivTxn))
    }

    const onAttackComplete = (newChivHp, newPlayerHp) => {
      const chivHp = newChivHp.toNumber()
      const playerHp = newPlayerHp.toNumber()

      console.log(`Attack complete - Chivivus HP: ${chivHp} Player HP: ${playerHp}`)
      setBoss((prevState) => {
        return { ...prevState, hp: chivHp}
      })
      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp}
      })
    }

    if (contract) {
      fetchChivivus()
      contract.on('AttackComplete', onAttackComplete)
    }

    return () => {
      if (contract) {
        contract.off('AttackComplete', onAttackComplete)
      }
    }
  }, [contract])

  return (
    <div className="arena-container sm:container mx-auto flex flex-col justify-center">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? 'show' : ''}>
          <div id="desc">
            {`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}<br />
            {`💥 ${characterNFT.name} was struck back for ${boss.attackDamage}!`}
          </div>
        </div>
      )}
      {boss && boss.hp > 0 && (
        <div className="boss-container mx-auto">
          <div className={`boss-content ${attackState}`}>
            <h2 className="text-red-700 text-2xl font-bold">🔥 {boss.name} 🔥</h2>
            <div className="image-content rounded-lg">
              <img className="rounded-lg" src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`} alt={`Boss ${boss.name}`} />
              <div className="health-bar rounded-lg">
                <progress className="rounded-lg" value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container my-10 mx-auto">
            {characterNFT.hp > 0 ?
              <button className="cta-button bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded text-center" onClick={runAttackAction}>
                {`💥 Attack ${boss.name}`}
              </button>
            : 
              <div>
                <p className="text-slate-400">Your HP is at Zero. Thank you for playing. </p>
                <button className="cta-button bg-slate-500 text-white font-bold py-2 px-4 rounded text-center">
                  {`💥 Attack ${boss.name} Disabled`}
                </button>
              </div>
              }
          </div>
          {attackState === 'attacking' && (
            <div className="loading-indicator text-slate-400">
              
              <p>Attacking ⚔️</p>
            </div>
          )}
        </div>
       )}
       {boss && boss.hp == 0 && (
        <div className="mb-10">
          <p className="font-bold text-xl text-slate-400">Chivivus Man has been defeated. He was slain by {boss.defeater}.</p>
          <p className="font-bold text-xl text-slate-400">The Game is OVER.</p>
          {boss.defeater.toLowerCase() === currentAccount.toLowerCase() ? 
            <div className="">
              <p className="font-bold text-xl text-slate-400 mb-4">Looks like you have slain Chivivus Man. Claim your 1/1 Chivivus NFT!</p>
              <button className="cta-button bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded text-center" onClick={() => mintBoss(boss)}>
                MINT CHIVIVUS MAN
              </button>
            </div>
          : null }
        </div>
       )}
      {characterNFT && (
        <div className="players-container mx-auto mb-10">
          <div className="player-container">
            <h2 className="font-bold text-xl text-slate-400">Your Character</h2>
            <h2 className="font-bold text-2xl text-teal-400">{characterNFT.name}</h2>
            <div className="player rounded-lg bg-slate-200">
              <div className="image-content rounded-lg">
                <img className="rounded-lg" src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`} alt={`Character ${characterNFT.name}`} />
                <div className="health-bar rounded-lg">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Arena