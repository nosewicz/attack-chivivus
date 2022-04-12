const main = async () => {
  const attackChivivusFactory = await hre.ethers.getContractFactory('DefeatChivivus')
  const attackChivivusContract = await attackChivivusFactory.deploy(    
    ["Rufus", "Bartholomew", "Sasafraz"],
    ["QmeXvNCFs59o27Dq42USzjJ6pbKykF9Nz9DWVEFr8NR8mt", "QmPG1aAHSM7mQ1ncMZkR3pr62mKQrGfNYfSnSWztsp9oFy", "QmQQR4GzJAC5MSoveBgqqSBaaBxsvgGb6PT9md1DTUkq6V"],
    [150, 150, 500],
    [100, 100, 500],
    "Chivivus Man",
    "QmRaYPFrqEpxXkiY1yXVNrTkwgNumd5EcRU1WmGtWSAQFM",
    10000,
    50
  )

  await attackChivivusContract.deployed()
  console.log("Contracted deployed to: ", attackChivivusContract.address)
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()