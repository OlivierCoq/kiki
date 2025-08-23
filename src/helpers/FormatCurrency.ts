// Format Currency Helper
interface Currency {
  code: string
  symbol: string
}

const formatCurrency = (currency: Currency, amount: number) => {
  // console.log('Currencyyyy', currency)
  if (typeof amount !== 'number') {
    // console.error('Invalid amount for currency formatting:', amount);
    return '';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency?.code,
  }).format(amount);
}

export default formatCurrency;