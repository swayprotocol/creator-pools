export const getWalletShorthand = (walletId: string) => {
  return walletId.substring(0, 4) + '...' + walletId.substring(walletId.length - 4);
}
