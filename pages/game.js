import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { CONTRACT_ADDRESS, transformCharacterData } from '../components/constants'
import SelectCharacter from '../components/selectCharacter'
import defeatChivivus from '../artifacts/contracts/DefeatChivivus.sol/DefeatChivivus.json'
import Arena from '../components/arena'


const Game = () => {

  const [currentAccount, setCurrentAccount] = useState(null)
  const [characterNFT, setCharacterNFT] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window
      setIsLoading(true)

      if(!ethereum) {
        console.log("make sure you have metamask")
        setIsLoading(false)
        return
      } else {
        console.log("we have the ethereum object: ", ethereum)
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log("Found Authorized Account: ", account)
        setCurrentAccount(account)
        setIsLoading(false)
      } else {
        console.log("no authorized account found")
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window

      if(!ethereum) {
        alert("Metamask is required")
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log("Connected ". accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading text-slate-400 text-lg">Loading...</div>
      )
    }

    if (!currentAccount) {
      return (
        <div className="connect-wallet text-slate-400 max-w-[60%] mx-auto">
          <p>This game requires a Metamask wallet + browser extension. Please connect to this site on the Rinkeby test network. Funds are required, you can get some from the <a href="https://faucets.chain.link/rinkeby" target="_blank" className="text-violet-400  underline">faucet</a>.</p>
          <p>Once connected, if page appears to not update, please do a page refresh.</p>
          <button className="connect-wallet-button bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded text-center my-4" onClick={connectWalletAction}>Connect Wallet</button>
        </div>
      )
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount} />
    }
  }

  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== '4') {
        alert("This project is on the Rinkeby testnet. Please switch your wallet to Rinkeby")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    //setIsLoading(true)
    checkIfWalletIsConnected()
    checkNetwork()
  }, [])

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Checking if account has characterNFT", currentAccount)

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, defeatChivivus.abi, signer)

      const txn = await contract.checkIfUserHasNFT()
      if (txn.name) {
        console.log("user has nft")
        setCharacterNFT(transformCharacterData(txn))
      } else {
        console.log("no character NFT found")
      }

      setIsLoading(false)
    }

    if (currentAccount) {
      console.log("Current Account: ", currentAccount)
      fetchNFTMetadata()
    }
  }, [currentAccount])

  return (
    <>
      <div className="container mx-auto mb-10 text-center">
        {renderContent()}
      </div>
    </>
  )
}

export default Game;