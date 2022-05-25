function getStakingAbi(abiFile: string) {
  return require(`../shared/abis/${abiFile}`);
}

export default getStakingAbi;
