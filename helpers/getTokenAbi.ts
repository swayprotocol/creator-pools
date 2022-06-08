
async function getTokenAbi(): Promise<any> {
  let res = await fetch(`${process.env.NEXT_PUBLIC_TOKEN_ABI_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.json();
}
export default getTokenAbi;