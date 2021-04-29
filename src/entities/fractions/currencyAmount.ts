import JSBI from 'jsbi'
import { currencyEquals } from '../token'
import { Currency, EDG_CURRENCY } from '../currency'
import invariant from 'tiny-invariant'
import _Big from 'big.js'
import toFormat from 'toformat'

import { BigintIsh, Rounding, MaxUint256 } from '../../constants'
import Fraction from './fraction'

const Big = toFormat(_Big)

export default class CurrencyAmount extends Fraction {
  public readonly currency: Currency

  /**
   * Helper that calls the constructor with the EDG_CURRENCY currency
   * @param amount edg amount in wei
   */
  public static edg(amount: BigintIsh): CurrencyAmount {
    return new CurrencyAmount(EDG_CURRENCY, amount)
  }

  // amount _must_ be raw, i.e. in the native representation
  protected constructor(currency: Currency, amount: BigintIsh) {
    const parsedAmount = JSBI.BigInt(amount)
    invariant(JSBI.lessThanOrEqual(parsedAmount, MaxUint256), 'AMOUNT')

    super(parsedAmount, JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(currency.decimals)))
    this.currency = currency
  }

  public get raw(): JSBI {
    return this.numerator
  }

  public add(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, JSBI.add(this.raw, other.raw))
  }

  public subtract(other: CurrencyAmount): CurrencyAmount {
    invariant(currencyEquals(this.currency, other.currency), 'TOKEN')
    return new CurrencyAmount(this.currency, JSBI.subtract(this.raw, other.raw))
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(format)
  }
}
