async function getStakingAbi(): Promise<any> {
  const abiEnvName = process.env.NEXT_PUBLIC_ENV || 'PRODUCTION';
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stakingAbi?name=${abiEnvName.toLowerCase()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}

export default getStakingAbi;
