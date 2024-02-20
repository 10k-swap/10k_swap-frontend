import axios from 'axios'

export async function getUSD() {
  try {
    const res = await axios.get<{
      data: { currency: 'USD'; rates: { [symbol: string]: string } }
    }>(`https://api.coinbase.com/v2/exchange-rates?currency=usd`)

    return res.data.data.rates
  } catch (error: any) {
    throw new Error(error)
  }
}
