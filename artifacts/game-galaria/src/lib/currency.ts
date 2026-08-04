export const NGN_CURRENCY_VERSION = 'ngn-v1';
export const NGN_CONVERSION_RATE = 1500;
export const NGN_DELIVERY_FEE = 15_000;
export const NGN_FREE_DELIVERY_THRESHOLD = 150_000;

const ngnFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  currencyDisplay: 'symbol',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number) {
  return ngnFormatter.format(amount);
}

export function migrateUsdAmountToNgn(amount: number) {
  return Math.round((amount * NGN_CONVERSION_RATE) / 100) * 100;
}