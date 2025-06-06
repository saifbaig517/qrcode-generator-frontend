export class MenuItemModel {
    label
    link
    permission

    target = null

    renderer = null

    isQueryStringIgnored = false

    data

    badgeBackgroundColor
    badgeTextColor
    /**
     * Actual badge text
     */
    badge

    group = null

    constructor(label, link, permission) {
        this.label = label

        this.link = link

        this.permission = permission
    }

    ignoreQueryString() {
        this.isQueryStringIgnored = true

        return this
    }

    setData(data) {
        this.data = data

        return this
    }

    setRenderer(renderer) {
        this.renderer = renderer

        return this
    }

    isActive() {
        const item = this

        const itemSearchPart = item.link.match(/\?/)
            ? item.link.replace(/.*(\?.*)/, (_, $1) => {
                  return $1
              })
            : ''

        let itemSearch = new URLSearchParams(itemSearchPart)

        const itemPath = item.link.replace(itemSearchPart, '')

        let windowSearch = window.location.search

        windowSearch = new URLSearchParams(windowSearch)

        const itemSearchMatched = Array.from(itemSearch.keys()).reduce(
            (matched, key) => {
                return matched && itemSearch.get(key) === windowSearch.get(key)
            },
            true
        )

        const ignoredKeys = ['page']

        const windowHasExtraParams = Array.from(windowSearch.keys()).reduce(
            (prev, key) => {
                const keyFoundInItemSearch = Array.from(itemSearch.keys()).find(
                    (iKey) => key === iKey
                )

                const keyIsIgnored = ignoredKeys.find((iKey) => iKey === key)

                if (keyIsIgnored) {
                    return prev
                }

                if (keyFoundInItemSearch) {
                    return prev
                } else {
                    return true
                }
            },
            false
        )

        const queryParamMatched = item.isQueryStringIgnored
            ? true
            : !windowHasExtraParams

        const result =
            itemPath === window.location.pathname &&
            itemSearchMatched &&
            queryParamMatched

        return result
    }
}
