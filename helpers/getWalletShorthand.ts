export const getWalletShorthand = (walletId: string | undefined) => {
  return walletId ? walletId.substring(0, 4) + '...' + walletId.substring(walletId.length - 4) : '';
}
