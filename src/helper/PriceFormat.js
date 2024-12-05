export const formatPrice = price => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
    .format(price)
    .replace('$', ''); // Remove the dollar sign
};
