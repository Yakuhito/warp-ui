import * as GreenWeb from 'greenwebjs';
import { SExp, Tuple, Bytes, getBLSModule } from "clvm";
import { CAT_MOD_HASH } from './cat';
import { BRIDGING_PUZZLE_HASH, getMessageCoinPuzzle1stCurry, stringToHex } from './portal';
import { CHIA_NETWORK, Network } from '../config';

/*
>>> from drivers.wrapped_assets import CAT_BURNER_MOD
>>> bytes(CAT_BURNER_MOD).hex()
*/
const CAT_BURNER_MOD = "ff02ffff01ff02ff2affff04ff02ffff04ff825fffffff04ffff0bffff02ffff03ffff09ffff0dff81bf80ffff012080ffff0181bfffff01ff088080ff0180ffff02ff2effff04ff02ffff04ff05ffff04ffff0bffff0101ff0580ffff04ff82017fffff04ffff02ff2effff04ff02ffff04ffff02ff2effff04ff02ffff04ff0bffff04ffff0bffff0101ff822fff80ffff04ffff0bffff0101ff8205ff80ff808080808080ffff04ffff0bffff0101ff820bff80ffff04ffff0bffff0101ff8217ff80ff808080808080ff80808080808080ff8202ff80ffff04ffff04ffff04ff38ffff04ff825fffff808080ffff04ffff04ff28ffff04ff8217ffff808080ffff04ffff04ff14ffff04ff822fffff808080ffff04ffff04ff2cffff04ff17ffff04ff8217ffffff04ffff04ff2fffff04ff5fffff04ff8205ffffff04ff820bffffff04ff8202ffff808080808080ff8080808080ff8080808080ff808080808080ffff04ffff01ffffff3dff4946ff48ff333cffff02ffff04ffff04ff10ffff04ffff0bff0bff0580ff808080ffff04ffff04ff3cffff04ff0bff808080ff178080ff02ffff03ff05ffff01ff0bff76ffff02ff3effff04ff02ffff04ff09ffff04ffff02ff3affff04ff02ffff04ff0dff80808080ff808080808080ffff016680ff0180ffffffa04bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459aa09dcf97a184f32623d11a73124ceb99a5709b083721e878a16d78f596718ba7b2ffa102a12871fee210fb8619291eaea194581cbd2531e4b23759d225f6806923f63222a102a8d5dd63fba471ebcb1f3e8f7c1e1879b7152a6e7298a91ce119a63400ade7c5ffff0bff56ffff02ff3effff04ff02ffff04ff05ffff04ffff02ff3affff04ff02ffff04ff07ff80808080ff808080808080ff0bff12ffff0bff12ff66ff0580ffff0bff12ff0bff468080ff018080";

/*
>>> from drivers.wrapped_assets import CAT_MINTER_MOD
>>> bytes(CAT_MINTER_MOD).hex()
*/
const CAT_MINTER_MOD = "ff02ffff01ff02ff12ffff04ff02ffff04ffff0bffff02ffff03ffff09ffff0dff825fff80ffff012080ffff01825fffffff01ff088080ff0180ffff02ff16ffff04ff02ffff04ff05ffff04ffff0bffff0102ffff0bffff0101ff82017f80ffff0bffff0101ff8205ff8080ffff04ffff0bffff0101ff8202ff80ffff04ffff0bffff0101ff8217ff80ffff04ffff0bffff0101ffff02ff3effff04ff02ffff04ff820bffff8080808080ff8080808080808080ff8080ffff04ff822fffffff04ffff04ffff04ff28ffff04ff822fffff808080ffff04ffff04ff38ffff04ff8217ffff808080ffff04ffff04ff14ffff04ffff02ff16ffff04ff02ffff04ff0bffff04ffff0bffff0101ff0b80ffff04ffff0bffff0101ffff02ff16ffff04ff02ffff04ff17ffff04ffff0bffff0101ff8217ff80ffff04ffff0bffff0101ffff02ff16ffff04ff02ffff04ff81bfffff04ff5fffff04ffff0bffff0101ff8213ff80ff80808080808080ff80808080808080ffff04ffff02ff16ffff04ff02ffff04ff2fffff04ffff0bffff0101ff822bff80ff8080808080ff80808080808080ffff04ffff12ff825bffffff010180ff80808080ff80808080ff808080808080ffff04ffff01ffffff3dff4648ff33ff3c02ffffff04ffff04ff10ffff04ffff0bff05ff0b80ff808080ffff04ffff04ff2cffff04ff05ff808080ff178080ffff02ffff03ff05ffff01ff0bff81faffff02ff2effff04ff02ffff04ff09ffff04ffff02ff2affff04ff02ffff04ff0dff80808080ff808080808080ffff0181da80ff0180ffffa04bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459aa09dcf97a184f32623d11a73124ceb99a5709b083721e878a16d78f596718ba7b2ffa102a12871fee210fb8619291eaea194581cbd2531e4b23759d225f6806923f63222a102a8d5dd63fba471ebcb1f3e8f7c1e1879b7152a6e7298a91ce119a63400ade7c5ffff0bff81baffff02ff2effff04ff02ffff04ff05ffff04ffff02ff2affff04ff02ffff04ff07ff80808080ff808080808080ffff0bff3cffff0bff3cff81daff0580ffff0bff3cff0bff819a8080ff02ffff03ffff07ff0580ffff01ff0bffff0102ffff02ff3effff04ff02ffff04ff09ff80808080ffff02ff3effff04ff02ffff04ff0dff8080808080ffff01ff0bffff0101ff058080ff0180ff018080";

/*
>>> from drivers.wrapped_assets import CAT_MINT_AND_PAYOUT_MOD, CAT_MINT_AND_PAYOUT_MOD_HASH
>>> bytes(CAT_MINT_AND_PAYOUT_MOD).hex()
>>> CAT_MINT_AND_PAYOUT_MOD_HASH.hex()
*/
const CAT_MINT_AND_PAYOUT_MOD = "ff02ffff01ff04ffff04ff04ffff04ff17ff808080ffff04ffff04ff06ffff04ff05ffff04ff17ffff04ffff04ff05ff8080ff8080808080ffff04ffff04ff06ffff04ff80ffff04ffff01818fffff04ff0bffff04ff2fff808080808080ff80808080ffff04ffff01ff4933ff018080";
const CAT_MINT_AND_PAYOUT_MOD_HASH = "2c78140b52765a1c063062775d31a33a452410e9777c01270c1001db6e821f37";

/*
>>> from drivers.wrapped_assets import WRAPPED_TAIL_MOD, WRAPPED_TAIL_MOD_HASH
>>> bytes(WRAPPED_TAIL_MOD).hex()
>>> WRAPPED_TAIL_MOD_HASH.hex()
*/
const WRAPPED_TAIL_MOD = "ff02ffff01ff02ffff03ff2fffff01ff02ffff03ffff22ffff09ffff11ff80ff81bf80ff8202f780ffff09ff47ffff0bff16ffff0bff04ffff0bff04ff1aff0b80ffff0bff04ffff0bff1effff0bff04ffff0bff04ff1aff8204ff80ffff0bff04ffff0bff1effff0bff04ffff0bff04ff1aff8206ff80ffff0bff04ff1aff12808080ff12808080ff128080808080ff80ffff01ff088080ff0180ffff01ff02ffff03ffff22ffff09ff81bfff8080ffff09ffff0dff8202ff80ffff012080ffff09ff81b7ffff0bff8202ffff05ff8202f7808080ff80ffff01ff088080ff018080ff0180ffff04ffff01ff02ffffa04bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459aa09dcf97a184f32623d11a73124ceb99a5709b083721e878a16d78f596718ba7b2ffa102a12871fee210fb8619291eaea194581cbd2531e4b23759d225f6806923f63222a102a8d5dd63fba471ebcb1f3e8f7c1e1879b7152a6e7298a91ce119a63400ade7c5ff018080";
const WRAPPED_TAIL_MOD_HASH = "2d7e6fd2e8dd27536ebba2cf6b9fde09493fa10037aa64e14b201762c902f013";

/*
>>> from drivers.wrapped_assets import BURN_INNER_PUZZLE_MOD, BURN_INNER_PUZZLE_MOD_HASH
>>> bytes(BURN_INNER_PUZZLE_MOD).hex()
>>> BURN_INNER_PUZZLE_MOD_HASH.hex()
*/
const BURN_INNER_PUZZLE_MOD = "ff02ffff01ff04ffff04ff0cffff04ff81bfff808080ffff04ffff04ff0affff04ff80ffff04ffff01818fffff04ff82017fffff04ffff04ffff0bffff0101ff1780ffff0bffff0101ff2f8080ff808080808080ffff02ff1effff04ff02ffff04ff81bfffff04ffff0bffff02ffff03ffff09ffff0dff5f80ffff012080ffff015fffff01ff088080ff0180ff05ff2f80ff80808080808080ffff04ffff01ffff3d46ff33ff3cff04ffff04ff08ffff04ffff0bff0bff0580ff808080ffff04ffff04ff16ffff04ff0bff808080ff808080ff018080";
const BURN_INNER_PUZZLE_MOD_HASH = "69b9ac68db61a9941ff537cbb69158a7e1015ad44c42cff905159909cd8e1f90";
                                    // nice

/*
def get_cat_burner_puzzle(
    bridging_puzzle_hash: bytes32,
    destination_chain: bytes,
    destination: bytes, # address of contract that receives message
) -> Program:
  return CAT_BURNER_MOD.curry(
    CAT_MOD_HASH,
    BURN_INNER_PUZZLE_MOD_HASH,
    bridging_puzzle_hash,
    destination_chain,
    destination
  )
*/
export function getCATBurnerPuzzle(
  destinationChain: string,
  destination: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(CAT_BURNER_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(CAT_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(BURN_INNER_PUZZLE_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(BRIDGING_PUZZLE_HASH),
      GreenWeb.util.sexp.bytesToAtom(destinationChain),
      GreenWeb.util.sexp.bytesToAtom(destination)
    ]
  );
}

/*
def get_cat_minter_puzzle(
    portal_receiver_launcher_id: bytes32,
    bridging_puzzle_hash: bytes32,
    source_chain: bytes,
    source: bytes
) -> Program:
  return CAT_MINTER_MOD.curry(
    get_message_coin_puzzle_1st_curry(portal_receiver_launcher_id).get_tree_hash(),
    CAT_MOD_HASH,
    WRAPPED_TAIL_MOD_HASH,
    CAT_MINT_AND_PAYOUT_MOD_HASH,
    raw_hash([
      b'\x01',
      get_cat_burner_puzzle(bridging_puzzle_hash, source_chain, source).get_tree_hash()
    ]), # CAT_BURNER_PUZZLE_HASH_HASH = (sha256 1 CAT_BURNER_PUZZLE_HASH_HASH)
    BURN_INNER_PUZZLE_MOD_HASH,
    source_chain,
    source
  )
*/
export function getCATMinterPuzzle(
  portalReceiverLauncherId: string,
  sourceChain: string,
  source: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(CAT_MINTER_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          getMessageCoinPuzzle1stCurry(portalReceiverLauncherId)
        )
      ),
      GreenWeb.util.sexp.bytesToAtom(CAT_MOD_HASH), // the one in GreenWeb is CAT v1
      GreenWeb.util.sexp.bytesToAtom(WRAPPED_TAIL_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(CAT_MINT_AND_PAYOUT_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.stdHash("01" + GreenWeb.util.sexp.sha256tree(
          getCATBurnerPuzzle(sourceChain, source)
        )) // sha256 1 CAT_BURNER_PUZZLE_HASH
      ),
      GreenWeb.util.sexp.bytesToAtom(BURN_INNER_PUZZLE_MOD_HASH),
      GreenWeb.util.sexp.bytesToAtom(sourceChain),
      GreenWeb.util.sexp.bytesToAtom(source),
    ]
  );
}

/*
def get_cat_mint_and_payout_inner_puzzle(
    receiver: bytes32
) -> Program:
  return CAT_MINT_AND_PAYOUT_MOD.curry(
    receiver
  )
*/
export function getCATMintAndPayoutInnerPuzzle(
  receiver: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(CAT_MINT_AND_PAYOUT_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(receiver)
    ]
  );
}

/*
def get_cat_burn_inner_puzzle_first_curry(
    destination_chain: bytes,
    destination: bytes,
    source_chain_token_contract_address: bytes,
) -> Program:
  return BURN_INNER_PUZZLE_MOD.curry(
    get_cat_burner_puzzle(destination_chain, destination).get_tree_hash(),
    source_chain_token_contract_address
  )
*/
export function getCATBurnInnerPuzzleFirstCurry(
  destinationChain: string,
  destination: string,
  sourceChainTokenContractAddress: string,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(BURN_INNER_PUZZLE_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          getCATBurnerPuzzle(destinationChain, destination)
        )
      ),
      GreenWeb.util.sexp.bytesToAtom(sourceChainTokenContractAddress)
    ]
  );
}

/*
def get_cat_burn_inner_puzzle(
    destination_chain: bytes,
    destination: bytes, # e.g., ETH token bridge
    source_chain_token_contract_address: bytes,
    target_receiver: bytes,
    bridge_toll: int
) -> Program:
  return get_cat_burn_inner_puzzle_first_curry(
    destination_chain,
    destination,
    source_chain_token_contract_address
  ).curry(
    target_receiver,
    bridge_toll
  )
*/
export function getCATBurnInnerPuzzle(
  destinationChain: string,
  destination: string,
  sourceChainTokenContractAddress: string,
  targetReceiver: string,
  bridgeToll: number,
): GreenWeb.clvm.SExp {
  return GreenWeb.util.sexp.curry(
    getCATBurnInnerPuzzleFirstCurry(
      destinationChain,
      destination,
      sourceChainTokenContractAddress
    ),
    [
      GreenWeb.util.sexp.bytesToAtom(targetReceiver),
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.coin.amountToBytes(bridgeToll)
      )
    ]
  );
}

/*
def get_wrapped_tail(
    portal_receiver_launcher_id: bytes32,
    source_chain: bytes,
    source: bytes,
    source_chain_token_contract_address: bytes,
) -> Program:
  if len(source_chain_token_contract_address) < 32:
    source_chain_token_contract_address = b'\x00' * (32 - len(source_chain_token_contract_address)) + source_chain_token_contract_address
    
  return WRAPPED_TAIL_MOD.curry(
    get_cat_minter_puzzle(
      portal_receiver_launcher_id, source_chain, source
    ).get_tree_hash(),
    get_cat_burn_inner_puzzle_first_curry(
      source_chain, source, source_chain_token_contract_address
    ).get_tree_hash(),
  )
*/
export function getWrappedTAIL(
  portalReceiverLauncherId: string,
  sourceChain: string,
  source: string,
  sourceChainTokenContractAddress: string,
): GreenWeb.clvm.SExp {
  if(sourceChainTokenContractAddress.length < 64) {
    sourceChainTokenContractAddress = "0".repeat(64 - sourceChainTokenContractAddress.length) + sourceChainTokenContractAddress;
  }
  
  return GreenWeb.util.sexp.curry(
    GreenWeb.util.sexp.fromHex(WRAPPED_TAIL_MOD),
    [
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          getCATMinterPuzzle(portalReceiverLauncherId, sourceChain, source)
        )
      ),
      GreenWeb.util.sexp.bytesToAtom(
        GreenWeb.util.sexp.sha256tree(
          getCATBurnInnerPuzzleFirstCurry(
            sourceChain, source, sourceChainTokenContractAddress
          )
        )
      ),
    ]
  );
}

/*
def get_burn_inner_puzzle_solution(
    cat_burner_parent_id: bytes32,
    my_coin_id: bytes32,
    tail_reveal: Program
) -> Program:
  return Program.to([
    cat_burner_parent_id,
    my_coin_id,
    tail_reveal
  ])
*/
export function getBurnInnerPuzzleSolution(
  catBurnerParentId: string,
  myCoinId: string,
  tailReveal: GreenWeb.clvm.SExp,
): GreenWeb.clvm.SExp {
  return SExp.to([
    GreenWeb.util.sexp.bytesToAtom(catBurnerParentId),
    GreenWeb.util.sexp.bytesToAtom(myCoinId),
    tailReveal
  ]);
}

/*
def get_cat_mint_and_payout_inner_puzzle_solution(
    tail_puzzle: Program,
    my_amount: int,
    parent_parent_info: bytes32,
) -> Program:
  return Program.to([
    tail_puzzle,
    my_amount,
    parent_parent_info
  ])
*/
function getCATMintAndPayoutInnerPuzzleSolution(
  tailPuzzle: GreenWeb.clvm.SExp,
  myAmount: number,
  parentParentInfo: string,
): GreenWeb.clvm.SExp {
  return SExp.to([
    tailPuzzle,
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.coin.amountToBytes(myAmount)
    ),
    GreenWeb.util.sexp.bytesToAtom(parentParentInfo)
  ]);
}

function messageContentsAsSexp(messageContents: any): GreenWeb.clvm.SExp {
  return SExp.to(messageContents.map((content: string) => GreenWeb.util.sexp.bytesToAtom(
    GreenWeb.util.unhexlify(content)!
  )));
}

/*
def get_cat_minter_puzzle_solution(
    nonce: int,
    message: Program,
    my_puzzle_hash: bytes32,
    my_coin_id: bytes32,
    message_coin_parent_info: bytes32,
) -> Program:
  return Program.to([
    nonce,
    message,
    my_puzzle_hash,
    my_coin_id,
    message_coin_parent_info
  ])
*/
export function getCATMinterPuzzleSolution(
  nonce: string,
  messageContents: any,
  myPuzzleHash: string,
  myCoinId: string,
  messageCoinParentInfo: string,
): GreenWeb.clvm.SExp {
  return SExp.to([
    GreenWeb.util.sexp.bytesToAtom(nonce),
    messageContentsAsSexp(messageContents),
    GreenWeb.util.sexp.bytesToAtom(myPuzzleHash),
    GreenWeb.util.sexp.bytesToAtom(myCoinId),
    GreenWeb.util.sexp.bytesToAtom(messageCoinParentInfo)
  ]);
}

/*
def get_cat_burner_puzzle_solution(
    cat_parent_info: bytes32,
    tail_hash: bytes32,
    cat_amount: int,
    source_chain_token_contract_address: bytes,
    destination_receiver_address: bytes,
    my_coin: Coin
) -> Program:
  return Program.to([
    cat_parent_info,
    raw_hash([b'\x01', tail_hash]),
    cat_amount,
    source_chain_token_contract_address,
    destination_receiver_address,
    my_coin.amount,
    my_coin.puzzle_hash,
    my_coin.name()
  ])
*/
export function getCATBurnerPuzzleSolution(
  catParentInfo: string,
  tailHash: string,
  catAmount: GreenWeb.BigNumber,
  sourceChainTokenContractAddress: string,
  destinationReceiverAddress: string,
  myCoin: any,
): GreenWeb.clvm.SExp {
  return SExp.to([
    GreenWeb.util.sexp.bytesToAtom(catParentInfo),
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.sexp.sha256tree(
        SExp.to(GreenWeb.util.sexp.bytesToAtom(tailHash))
      )
    ),
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.coin.amountToBytes(catAmount)
    ),
    GreenWeb.util.sexp.bytesToAtom(sourceChainTokenContractAddress),
    GreenWeb.util.sexp.bytesToAtom(destinationReceiverAddress),
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.coin.amountToBytes(myCoin.amount)
    ),
    GreenWeb.util.sexp.bytesToAtom(myCoin.puzzleHash),
    GreenWeb.util.sexp.bytesToAtom(
      GreenWeb.util.coin.getName(myCoin)
    )
  ]);
}

export function getWrappedERC20AssetID(sourceChain: Network, erc20ContractAddress: string) {
  erc20ContractAddress = GreenWeb.util.unhexlify(erc20ContractAddress)!;
  erc20ContractAddress = "0".repeat(64 - erc20ContractAddress.length) + erc20ContractAddress;

  return GreenWeb.util.sexp.sha256tree(
    getWrappedTAIL(
      CHIA_NETWORK.portalLauncherId!,
      stringToHex(sourceChain.id),
      GreenWeb.util.unhexlify(sourceChain.erc20BridgeAddress!)!,
      erc20ContractAddress
    )
  );
}