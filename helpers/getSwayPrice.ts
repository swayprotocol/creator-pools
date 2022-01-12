export const getSwayPrice = async () => {
  // let price = JSON.parse(localStorage.getItem('maticPrice'))
  //
  // if(price && (new Date(price.expiration) > new Date())){
  //
  //   return price.price
  // }

  let res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&a=5&ids=sway-social', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  // let expirationDate = new Date();
  // expirationDate.setHours(expirationDate.getHours() + 1)
  // let storageData = { price: data[0].current_price, expiration: expirationDate }
  //
  // localStorage.setItem('maticPrice', JSON.stringify(storageData))

  return data[0].current_price;
}
