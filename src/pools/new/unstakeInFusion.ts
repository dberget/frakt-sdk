import { AnchorProvider, BN, web3 } from '@project-serum/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { findAssociatedTokenAddress, returnAnchorMultiRewardStaking } from '../../common';

export const unstakeInFusion = async (
  programId: web3.PublicKey,
  provider: AnchorProvider,
  userPublicKey: web3.PublicKey,
  mintToStake: web3.PublicKey,
  mintToHarvest: web3.PublicKey,
  unstakeAmount: BN,
) => {
  const encoder = new TextEncoder();

  let program = await returnAnchorMultiRewardStaking(programId, provider)

  const [vaultOwnerPda, bump] =
    await web3.PublicKey.findProgramAddress(
      [encoder.encode("vaultownerpda"), programId.toBuffer()],
      program.programId
    );
  const userToStake = await findAssociatedTokenAddress(userPublicKey, mintToStake)

  const vaultTokenAccountInput = await findAssociatedTokenAddress(vaultOwnerPda, mintToStake)
  const [mainRouter, bumpRouter] =
    await web3.PublicKey.findProgramAddress(
      [encoder.encode("mainRouter"), mintToStake.toBuffer(), mintToHarvest.toBuffer()],
      program.programId
    );

  const [configInput, bumpConfigInput] =
    await web3.PublicKey.findProgramAddress(
      [encoder.encode("mainConfigAccountInput"), mintToStake.toBuffer(), mainRouter.toBuffer()],
      program.programId
    );

  const [stakeAccount, bumpStake] =
    await web3.PublicKey.findProgramAddress(
      [userPublicKey.toBuffer(), mainRouter.toBuffer()],
      program.programId
    );

  return program.instruction.unstakeSingle(
    bump,
    bumpConfigInput,
    bumpRouter,
    bumpStake,
    unstakeAmount,
    {
      accounts: {
        initializer: userPublicKey,
        userTokenAccountInput: userToStake,
        tokenMintInput: mintToStake,
        tokenMintOutput: mintToHarvest,
        vaultOwnerPda,
        vaultTokenAccountInput,
        stakeAccount: stakeAccount,
        mainRouter,
        configInput,
        rent: web3.SYSVAR_RENT_PUBKEY,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      },
    }
  );
}
