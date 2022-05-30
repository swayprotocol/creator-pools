async function getStakingAbi(abiFilename: string): Promise<any> {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stakingAbi?name=${abiFilename.toLowerCase()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}

export default getStakingAbi;
