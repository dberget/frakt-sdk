import { BN, web3 } from '@project-serum/anchor';

import { InitializeLiquidityPool } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const initializeLiquidityPool = async (params: InitializeLiquidityPool): Promise<any> => {
  const {
    programId,
    provider,
    admin,
    rewardInterestRateTime,
    feeInterestRateTime,
    rewardInterestRatePrice,
    feeInterestRatePrice,
    id,
    period,
    sendTxn,
  } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);
  const liquidityPool = web3.Keypair.generate();

  const [liqOwner, liqOwnerBump] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), liquidityPool.publicKey.toBuffer()],
    program.programId,
  );

  const instruction = program.instruction.initializeLiquidityPool(
    liqOwnerBump,
    {
      rewardInterestRateTime: new BN(rewardInterestRateTime),
      rewardInterestRatePrice: new BN(rewardInterestRatePrice),
      feeInterestRateTime: new BN(feeInterestRateTime),
      feeInterestRatePrice: new BN(feeInterestRatePrice),
      id: new BN(id),
      period: new BN(period),
    },
    {
      accounts: {
        liquidityPool: liquidityPool.publicKey,
        liqOwner,
        admin: admin,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
      },
    },
  );

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction, [liquidityPool]);

  return liquidityPool.publicKey;
};
