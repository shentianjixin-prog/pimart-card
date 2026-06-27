export function formatJpy(amount: number) {
  return `¥${amount.toLocaleString("ja-JP")}`;
}
