import { Config } from '../core/qrcg-config'

export const isEmpty = (subject) => {
    if (subject instanceof File) {
        return false
    }

    if (subject === null) {
        return true
    }

    if (typeof subject === 'undefined') {
        return true
    }

    if (typeof subject === 'string') {
        return subject.trim().length === 0
    }

    if (subject instanceof HTMLElement) {
        return false
    }

    // handles objects and arrays alike
    if (typeof subject === 'object') {
        return Object.keys(subject).reduce(
            (acc, key) => acc && isEmpty(subject[key]),
            true
        )
    }

    if (typeof subject === 'number') {
        return subject === 0
    }

    return false
}

export const isNotEmpty = (v) => !isEmpty(v)

export const isMobile = () => {
    // to be improved in future

    return window.innerWidth < 900
}

export const debounce = (cb, ms = 300) => {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            cb.apply(this, args)
        }, ms)
    }
}

export const queryParam = (name) => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    })

    return params[name]
}

export const loadStoredJson = (key) => {
    try {
        return JSON.parse(localStorage[key])
    } catch {
        return null
    }
}

export const nullOrUndefined = (value) => {
    return typeof value === 'undefined' || value === null
}

export const storeJson = (data, key) => {
    localStorage[key] = JSON.stringify(data)
}

export function capitalize(str) {
    return str.replace(/\b\w/g, (m) => m.toUpperCase())
}

export function kebabCase(str, forceLowerCase = true) {
    if (isEmpty(str)) return ''

    if (forceLowerCase) {
        str = str.toLowerCase()
    }

    return str.replace(/ /g, '-')
}

export function slugify(str) {
    if (isEmpty(str)) return ''

    str = str.replace(/[[\]{}#~/.|<>,&"'?`\-=+]/g, ' ')

    str = str.replace(/\s+/g, ' ')

    return kebabCase(str)
}

export function studlyCase(str) {
    return titleCase(str).replace(/ /g, '')
}

export function titleCase(str) {
    return capitalize(
        str
            .replace(/-|_/g, ' ')
            .replace(/[A-Z]/g, (m) => ' ' + m)
            .toLowerCase()
    )
}

export function random(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function range(from, to) {
    const start = to > from ? from : 0

    const length = to > from ? to - from : from

    return Array.from({ length }).map((_, i) => i + start)
}

export function isFunction(param) {
    return typeof param === 'function'
}

export function Deferred() {
    this.isResolved = false
    this.isRejected = false
    this.isConsumed = false
    this.promise = new Promise((resolve, reject) => {
        this.reject = (params) => {
            this.isRejected = true
            this.isConsumed = true
            reject(params)
        }
        this.resolve = (params) => {
            resolve(params)
            this.isResolved = true
            this.isConsumed = true
        }
    })
}

export function isPrimitive(val) {
    return val !== Object(val)
}

export function equals(obj, another) {
    return JSON.stringify(obj) === JSON.stringify(another)
}

export function only(obj, keys) {
    if (!obj) return

    return keys.reduce((result, key) => {
        result[key] = obj[key]
        return result
    }, {})
}

export function rgbToHex({ r, g, b }) {
    const rgb = (r << 16) | (g << 8) | (b << 0)
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null
}

/** Noop function to get sytax highlighting to work */
export const styled = (strings, ...rest) => {
    return strings
        .map((str, i) => {
            return str + (rest[i] ? rest[i] : '')
        })
        .join('')
}

export const get = (...params) => {
    try {
        return eval(`params[0].${params[1]}`)
    } catch {
        return undefined
    }
}

export function pxToRem(px) {
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export function hash(str, seed = 0) {
    // https://stackoverflow.com/a/52171480

    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i)
        h1 = Math.imul(h1 ^ ch, 2654435761)
        h2 = Math.imul(h2 ^ ch, 1597334677)
    }
    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909)
    return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export function iPhoneSafari() {
    return !!navigator.userAgent.match('iPhone OS')
}

export function parentMatches(node, parentSelector) {
    do {
        if (node.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
            node = node.getRootNode().host
        }

        if (node.matches && node.matches(parentSelector)) {
            return node
        }

        node = node.parentNode
    } while (node)

    return null
}

export function parseBooleanValue(value) {
    if (typeof value === 'boolean') {
        return value
    }

    if (typeof value === 'number') {
        return value != 0
    }

    if (typeof value === 'string') {
        if (isNaN(+value)) {
            return value === 'true'
        } else {
            return +value !== 0
        }
    }

    return false
}

export function isArray(value) {
    return value instanceof Array
}

export function isNotArray(value) {
    return !isArray(value)
}

export function parseNumberValue(value, defaultValue = 0) {
    if (typeof value === 'number') return value

    if (isNaN(value)) return defaultValue

    return +value
}

export function generateUniqueID(idLength = 10) {
    return [...Array(idLength).keys()]
        .map(() => Math.random().toString(36).substring(2, 3))
        .join('')
}

export function ucfirst(string) {
    return string[0].toUpperCase() + string.substring(1)
}

export function ucwords(string) {
    return string
        .split(' ')
        .map((s) => ucfirst(s))
        .join(' ')
}

// https://stackoverflow.com/a/13382873/2407522
export function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll' // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
    document.body.appendChild(outer)

    // Creating inner element and placing it in the container
    const inner = document.createElement('div')
    outer.appendChild(inner)

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer)

    return scrollbarWidth
}

export function url(path) {
    const baseUrl = Config.get('app.url')

    if (baseUrl[baseUrl.length - 1] === '/') {
        path = path.replace(/^\//, '')
    }

    if (path[0] === '/') {
        path = path.substring(1)
    }

    return `${baseUrl}/${path}`
}

export function removeEmptyFields(obj) {
    return Object.keys(obj).reduce((result, key) => {
        if (!isEmpty(obj[key])) result[key] = obj[key]
        return result
    }, {})
}

export function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function downloadBlob(content, filename, contentType) {
    // Create a blob
    var blob = new Blob([content], { type: contentType })
    var url = URL.createObjectURL(blob)

    // Create a link to download it
    var pom = document.createElement('a')
    pom.href = url
    pom.setAttribute('download', filename)
    pom.click()

    setTimeout(() => {
        URL.revokeObjectURL(url)
    }, 100)
}

export function urlWithQueryString(url, queryString) {
    if (url.match(/\?/)) {
        return url + '&' + queryString
    }

    return url + '?' + queryString
}

export function openLinkInNewTab(link) {
    const a = document.createElement('a')

    a.href = link

    a.target = '_blank'

    a.style = 'display: none'

    document.body.appendChild(a)

    a.click()

    setTimeout(() => {
        a.remove()
    }, 100)
}

export function shuffle(array) {
    const result = []

    const keys = array.map((a, b) => b)

    while (keys.length) {
        result.push(
            array[keys.splice(Math.floor(Math.random() * keys.length), 1)]
        )
    }

    return result
}

/**
 *
 * Mutate obj1 and merge all attributes from obj2 into obj1.
 *
 * @param {Object} obj1
 * @param {Object} obj2
 *
 * @returns {Object} reference to obj1
 */
export function mix(obj1, obj2) {
    Object.keys(obj2).forEach((key) => {
        obj1[key] = obj2[key]
    })

    return obj1
}

export function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms))
}

export function defineCustomElement(tag, Element) {
    if (customElements.get(tag) === undefined) {
        window.customElements.define(tag, Element)
    }
}

export function number_format(
    number,
    decimals,
    decimal_separator,
    thousands_separator
) {
    if (number == null || !isFinite(number)) {
        throw new TypeError('number is not valid')
    }

    if (!decimals) {
        const numberAfterDecimalPoint = number.toString().split('.')[1]

        if (numberAfterDecimalPoint && parseInt(numberAfterDecimalPoint)) {
            decimals = numberAfterDecimalPoint.length
        }
    }

    if (!decimal_separator) {
        decimal_separator = '.'
    }

    if (!thousands_separator) {
        thousands_separator = ','
    }

    number = parseFloat(number).toFixed(decimals)

    number = number.replace('.', decimal_separator)

    var splitNum = number.split(decimal_separator)
    splitNum[0] = splitNum[0].replace(
        /\B(?=(\d{3})+(?!\d))/g,
        thousands_separator
    )
    number = splitNum.join(decimal_separator)

    return number
}

window.defineCustomElement = defineCustomElement

export const mapEventDelegate = (e, map) => {
    const target = e.composedPath()[0]

    Object.keys(map).forEach((selector) => {
        const matched = parentMatches(target, selector)

        if (matched) {
            const callback = map[selector]

            callback(e, matched)
        }
    })
}

export const arrayToCsv = (data) => {
    return data
        .map(
            (row) =>
                row
                    .map(String) // convert every value to String
                    .map((v) => v.replaceAll('"', '""')) // escape double colons
                    .map((v) => `"${v}"`) // quote it
                    .join(',') // comma-separated
        )
        .join('\r\n') // rows starting on new lines
}
