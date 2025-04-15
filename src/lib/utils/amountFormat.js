export function amountFormat(amount) {
  if (amount >= 1e9) {
    return `${Math.floor(amount / 1e9)}B`;
  } else if (amount >= 1e6) {
    return `${Math.floor(amount / 1e6)}M`;
  } else if (amount >= 1e3) {
    return `${Math.floor(amount / 1e3)}K`;
  } else {
    return Math.floor(amount).toString(); // remove decimals for small numbers too
  }
}
