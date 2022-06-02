async function getStakingAbi(): Promise<any> {
  let res = await fetch(`${process.env.NEXT_PUBLIC_STAKING_ABI_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}

export default getStakingAbi;
