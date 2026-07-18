export function formatJpy(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

export function formatProductPrice(amount: number, pendingLabel: string) {
  return amount > 0 ? formatJpy(amount) : pendingLabel;
}
