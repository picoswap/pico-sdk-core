import invariant from 'tiny-invariant'

/**
 * A currency is any fungible financial instrument on Edgeware, including EDG and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is EDG_CURRENCY.
 */
export class Currency {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  /**
   * The only instance of the base class `Currency`.
   */
  public static readonly EDG_CURRENCY: Currency = new Currency(18, 'EDG', 'Edgeware')

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.EDG_CURRENCY`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(decimals: number, symbol?: string, name?: string) {
    invariant(decimals < 255, 'DECIMALS')

    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
}

const EDG_CURRENCY = Currency.EDG_CURRENCY
export { EDG_CURRENCY }
