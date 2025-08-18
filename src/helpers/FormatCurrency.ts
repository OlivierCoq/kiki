// Format Currency Helper
const formatCurrency = (amount: number) => {
  if (typeof amount !== 'number') {
    console.error('Invalid amount for currency formatting:', amount);
    return '';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default formatCurrency;