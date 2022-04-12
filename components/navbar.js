import Link from 'next/link'
import { CONTRACT_ADDRESS } from './constants'

export default function Navbar () {
  return (
    <nav className="mt-2">
      <Link href="/"><a><button className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded text-center mx-2">Home</button></a></Link>
      <Link href="/game"><a><button className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded text-center mx-2">Game</button></a></Link>
      <a href="https://testnets.opensea.io/collection/attack-chivivus-man-v2" target="_blank"><button className="bg-sky-400 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded text-center mx-2">OpenSea</button></a>
    </nav>
  )
}