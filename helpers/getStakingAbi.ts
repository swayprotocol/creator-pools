import config from '../config.json';

function getStakingAbi(){
  const { staking } = config; 

  const filename = staking.abi;
  const abi = require(`../shared/abis/${filename}`)
  return abi;
}

export default getStakingAbi;