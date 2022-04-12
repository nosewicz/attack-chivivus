const CONTRACT_ADDRESS = '0x07162E23aA08aBdb5c0355deEa9c2775Fe68c9f6'

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber()
  }
}

const transformChivData = (chivData) => {
  return {
    name: chivData.name,
    imageURI: chivData.imageURI,
    hp: chivData.hp.toNumber(),
    maxHp: chivData.maxHp.toNumber(),
    attackDamage: chivData.attackDamage.toNumber(),
    defeater: chivData.defeater
  }
}

export { CONTRACT_ADDRESS, transformCharacterData, transformChivData }