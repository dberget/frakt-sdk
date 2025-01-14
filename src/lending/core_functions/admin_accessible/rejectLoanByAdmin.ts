import { web3 } from '@project-serum/anchor';
import { Edition, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';

import { RejectLoanByAdmin } from '../../types';
import { returnAnchorProgram } from '../../contract_model/accounts';

export const rejectLoanByAdmin = async (params: RejectLoanByAdmin): Promise<any> => {
  const { programId, provider, loan, nftUserTokenAccount, admin, user, nftMint, sendTxn } = params;

  const encoder = new TextEncoder();
  const program = await returnAnchorProgram(programId, provider);
  const editionId = await Edition.getPDA(nftMint);

  const [communityPoolsAuthority, bumpPoolsAuth] = await web3.PublicKey.findProgramAddress(
    [encoder.encode('nftlendingv2'), programId.toBuffer()],
    programId,
  );

  const instruction = program.instruction.rejectLoanByAdmin(bumpPoolsAuth, {
    accounts: {
      loan: loan,
      admin: admin,
      nftMint: nftMint,
      nftUserTokenAccount: nftUserTokenAccount,
      user: user,
      communityPoolsAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: web3.SystemProgram.programId,
      metadataProgram: MetadataProgram.PUBKEY,
      editionInfo: editionId,
    },
  });

  const transaction = new web3.Transaction().add(instruction);

  await sendTxn(transaction);
};
