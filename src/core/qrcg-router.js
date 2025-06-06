import { Config } from './qrcg-config'

/**
 * Get URL to the given path
 *
 * @param {String} path
 * @return {String}
 */
export function url(path) {
    if (typeof path !== 'string') {
        throw new Error('path must be a string')
    }

    if (path[0] === '/') {
        path = path.substring(1)
    }
    return Config.get('app.url') + '/' + path
}

document.addEventListener('click', (e) => {
    if (runningSSR()) return

    const elem = e.composedPath()[0] || e.target

    if (elem.tagName === 'A') {
        if (elem.origin !== location.origin) {
            return
        }

        if (
            elem.getAttribute('download') ||
            elem.getAttribute('target') === '_blank'
        ) {
            return
        }

        if (elem.hasAttribute('native-link')) {
            return
        }

        if (isSSR(elem)) return

        e.preventDefault()

        push(elem.href)
    }
})

export function runningSSR() {
    return isSSR(window.location)
}

export function isSSR(url) {
    const frontendRoutesPattern = /dashboard|account|checkout|install/

    if (!url.pathname) {
        const a = document.createElement('a')

        a.href = url

        url = a
    }
    // SSR from and to home page

    return !url.pathname.match(frontendRoutesPattern) || isHomePage(url.href)
}

function getHost(url) {
    const a = document.createElement('a')

    a.href = url

    const host = a.host

    a.remove()

    return host
}

function isHomePage(url) {
    if (url === '/' || url === '') return true

    return (
        removeTrailingSlashes(url) ==
        removeTrailingSlashes(Config.get('app.url'))
    )
}

function removeTrailingSlashes(url) {
    return url.replace(/(.*)\/+$/, (match, $1) => $1)
}

function shouldChangeLocation(url) {
    // Because we are not using a frontend router in the home page,
    // We have to make a full reload, if we are redirecting to or from the home page.

    return (
        getHost(url) !== location.host ||
        isHomePage(url) ||
        isHomePage(location.href) ||
        isSSR(url)
    )
}

function doPush(url) {
    if (shouldChangeLocation(url)) {
        window.location = url
        return
    } else {
        history.pushState({}, '', url)
    }
}

function doReplace(url) {
    if (shouldChangeLocation(url)) {
        window.location = url
    } else {
        history.replaceState({}, '', url)
    }
}

export const push = (url = '', historyReplace = false) => {
    const shouldProceed = window.dispatchEvent(
        new CustomEvent('qrcg-router:location-will-change', {
            detail: { url },
            cancelable: true,
        })
    )

    if (!shouldProceed) return

    const a = document.createElement('a')

    a.href = Config.get('app.url')

    const basePathname = a.pathname

    if (!url.match(new RegExp(basePathname.replace('/', '\\/'))))
        url = basePathname + url.replace(a.origin, '')

    a.remove()

    if (historyReplace) {
        doReplace(url)
    } else {
        doPush(url)
    }

    setTimeout(
        () =>
            window.dispatchEvent(
                new CustomEvent('qrcg-router:location-changed')
            ),
        0
    )

    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 50)
}
