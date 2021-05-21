import invariant from 'tiny-invariant'
import validateAndParseAddress from '../utils/validateAndParseAddress'
import { ChainId } from '../constants'
import { Currency } from './currency'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly chainId: ChainId | number
  public readonly address: string

  public constructor(chainId: ChainId | number, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export const WETH9: { [chainId in ChainId]: Token } = {
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0xe4912bD19d837a6Ef5F44012aAd6B3C2e0b52864',
    18,
    'WETH9',
    'Wrapped ETH'
  ),
  [ChainId.EDGEWARE]: new Token(
    ChainId.EDGEWARE,
    '0x59AF421cB35fc23aB6C8ee42743e6176040031f4',
    18,
    'WETH9',
    'Wrapped EDG'
  ),
  [ChainId.BERESHEET]: new Token(
    ChainId.BERESHEET,
    '0x59AF421cB35fc23aB6C8ee42743e6176040031f4',
    18,
    'WETH9',
    'Wrapped EDG'
  )
}
