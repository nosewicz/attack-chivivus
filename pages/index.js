import Head from 'next/head'
import Link from 'next/link'


export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>Attack Chivivus Man</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
       <h1 className="text-4xl font-bold text-red-700 text-center">🔥 Attack Chivivus Man 🔥</h1>
       <div className="about text-neutral-200">
         <p className="my-10">In the time of the ancients a darkness was sweeping the land. For centuries it stalked the earth, polluting and poisoning as it went. Devouring and destorying everything in its path, growing in its power. Humanity, desperate to defeat the power, but powerless themselves, turned to the most unlikely of allies... Two mages from the "other" dimension who were banished to earth realm for their mis-deeds. Cast out from their home world, and treated as outcasts by the Humans, they agree to help defeat the darkness in hopes that they'll finally be accepted. </p>

         <p className="my-10">After a several year struggle and losing countless allies and friends along the way, the mages and their hunting party finally corner the darkness in the Great North. At the conclusion of an intense battle, and near the brink of death, the mages finally manage to pin the darkness down. Acting quickly, they then use their powers and construct a prison of ice and stone and bury it deep underground. Locking the darkness away forever...</p>

         <p className="my-10"> Or so they thought! Millenia later, in the year 2022, the melting ice caps finally prove to be too weak to continue to hold the darkness. It breaks free and continues its destructive path across the earth. Meanwhile, a long dormant power rooted deep in the family bloodlines of two teenagers begins to awaken. Humanity's last hope now lies in the hands of two reluctant heros, Rufus and Bartholomew. Do they have what it takes to defeat the legendary Chivivus Man?!</p>
       </div>

       <div className="game text-neutral-200">
         <p className="my-10">Attack Chivivus man is a turn-based NFT game. Users can mint one hero NFT per address and then use it to attack Chivivus Man. The user's attack settles first, but be warned, if Chivivus Man survives the attack he strikes back at your hero. The one who finally defeats Chivivus Man by getting his HP to 0 will then be rewarded with a free 1/1 mint of Chivivus Man.</p>
         <div className="text-center mb-10">
          <Link href="/game"><a><button className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded text-center">Play Game</button></a></Link>
         </div>
       </div>
      </main>

     

    </div>
  )
}
