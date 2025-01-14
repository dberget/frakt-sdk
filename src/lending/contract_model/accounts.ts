import { BN, Program, AnchorProvider, web3 } from '@project-serum/anchor';

import { IDL } from '../constants';
import { CollectionInfoView, DepositView, LiquidityPoolView, LoanView, NftLendingV2 } from '../../common/types';
import { createFakeWallet } from '../../common';

export const returnAnchorProgram = (programId: web3.PublicKey, provider: AnchorProvider): Program<NftLendingV2> =>
  new Program<NftLendingV2>(IDL as any, programId, provider);

export const decodedCollectionInfo = (decodedCollection: any, address: web3.PublicKey): CollectionInfoView => ({
  collectionInfoPubkey: address.toBase58(),
  creator: decodedCollection.creator.toBase58(),
  liquidityPool: decodedCollection.liquidityPool.toBase58(),
  pricingLookupAddress: decodedCollection.pricingLookupAddress.toBase58(),
  royaltyAddress: decodedCollection.royaltyAddress.toBase58(),
  royaltyFeeTime: decodedCollection.royaltyFeeTime.toNumber(),
  royaltyFeePrice: decodedCollection.royaltyFeePrice.toNumber(),
  loanToValue: decodedCollection.loanToValue.toNumber(),
  collaterizationRate: decodedCollection.collaterizationRate.toNumber(),
  availableLoanTypes: Object.keys(decodedCollection.availableLoanTypes)[0],
  expirationTime: decodedCollection.expirationTime.toNumber(),
});

export const decodedLiquidityPool = (decodedLiquidityPool: any, address: web3.PublicKey): LiquidityPoolView => ({
  liquidityPoolPubkey: address.toBase58(),
  id: decodedLiquidityPool.id.toNumber(),
  rewardInterestRateTime: decodedLiquidityPool.rewardInterestRateTime.toNumber(),
  feeInterestRateTime: decodedLiquidityPool.feeInterestRateTime.toNumber(),
  rewardInterestRatePrice: decodedLiquidityPool.rewardInterestRatePrice.toNumber(),
  feeInterestRatePrice: decodedLiquidityPool.feeInterestRatePrice.toNumber(),
  liquidityAmount: decodedLiquidityPool.liquidityAmount.toNumber(),
  liqOwner: decodedLiquidityPool.liqOwner.toBase58(),
  amountOfStaked: decodedLiquidityPool.amountOfStaked.toNumber(),
  userRewardsAmount: decodedLiquidityPool.userRewardsAmount.toNumber(),
  apr: decodedLiquidityPool.apr.toNumber(),
  cumulative: decodedLiquidityPool.cumulative.toNumber(),
  lastTime: decodedLiquidityPool.lastTime.toNumber(),
  oldCumulative: decodedLiquidityPool.oldCumulative.toNumber(),
  period: decodedLiquidityPool.period.toNumber(),
});

export const decodedDeposit = (decodedDeposit: any, address: web3.PublicKey): DepositView => ({
  depositPubkey: address.toBase58(),
  liquidityPool: decodedDeposit.liquidityPool.toBase58(),
  user: decodedDeposit.user.toBase58(),
  amount: decodedDeposit.amount.toNumber(),
  stakedAt: decodedDeposit.stakedAt.toNumber(),
  stakedAtCumulative: decodedDeposit.stakedAtCumulative.toNumber(),
});

export const decodedLoan = (decodedLoan: any, address: web3.PublicKey): LoanView => ({
  loanPubkey: address.toBase58(),
  user: decodedLoan.user.toBase58(),
  nftMint: decodedLoan.nftMint.toBase58(),
  nftUserTokenAccount: decodedLoan.nftUserTokenAccount.toBase58(),
  liquidityPool: decodedLoan.liquidityPool.toBase58(),
  collectionInfo: decodedLoan.collectionInfo.toBase58(),
  startedAt: decodedLoan.startedAt.toNumber(),
  expiredAt: new BN(decodedLoan.expiredAt || 0).toNumber(),
  finishedAt: decodedLoan.finishedAt.toNumber(),
  originalPrice: decodedLoan.originalPrice.toNumber(),
  amountToGet: decodedLoan.amountToGet.toNumber(),
  // amountToReturn: decodedLoan.amountToReturn.toNumber(),
  rewardAmount: decodedLoan.rewardAmount.toNumber(),
  feeAmount: decodedLoan.feeAmount.toNumber(),
  royaltyAmount: decodedLoan.royaltyAmount.toNumber(),
  rewardInterestRate: new BN(decodedLoan.rewardInterestRate || 0).toNumber(),
  feeInterestRate: new BN(decodedLoan.feeInterestRate || 0).toNumber(),
  royaltyInterestRate: new BN(decodedLoan.royaltyInterestRate || 0).toNumber(),
  loanStatus: Object.keys(decodedLoan.loanStatus)[0],
  loanType: Object.keys(decodedLoan.loanType)[0],
});

export const decodeLoan = (buffer: Buffer, connection: web3.Connection, programId: web3.PublicKey) => {
  const program = returnAnchorProgram(
    programId,
    new AnchorProvider(connection, createFakeWallet(), AnchorProvider.defaultOptions()),
  );
  return program.coder.accounts.decode('loan', buffer);
};
