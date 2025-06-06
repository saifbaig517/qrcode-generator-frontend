import { isEmpty, number_format } from '../core/helpers'
import { Config } from '../core/qrcg-config'

let _currency = null

export function currency() {
    if (!_currency) {
        _currency = Config.get('currency')
    }

    return _currency
}

function isCurrencyBefore() {
    const position = currency().symbol_position

    return isEmpty(position) || position == 'before'
}

export function price(value) {
    if (isNaN(value)) return value

    if (value === null) {
        value = 0
    }

    value = formatPrice(value)

    if (isCurrencyBefore()) {
        return currency().symbol + value
    }

    return value + currency().symbol
}

function formatPrice(number) {
    let decimals = 0

    if (currency().decimal_separator_enabled === 'enabled') {
        decimals = 2
    }

    return number_format(
        number,
        decimals,
        currency().decimal_separator,
        currency().thousands_separator
    )
}
