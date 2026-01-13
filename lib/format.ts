export function formatSYP(
  value: number,
  currency: string = 'SYP',
  locale: string = 'ar-SY'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    numberingSystem: 'latn',
  }).format(value);
}
