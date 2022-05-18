export const getTokenPrice = async (coingecko_coin_ticker: string) => {
  let res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&a=5&ids=${coingecko_coin_ticker}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  return data[0].current_price;
}
