export class FilterCollection {
    store = new Map()

    filters(filterName) {
        let list = this.store.get(filterName)

        if (!list) {
            list = []

            this.store.set(filterName, list)
        }

        list = list.sort(function (a, b) {
            return a.sortOrder - b.sortOrder
        })

        return list
    }

    addFilter(filterName, callback, sortOrder = 0) {
        this.filters(filterName).push(new FilterCallback(callback, sortOrder))
    }

    applyFilters(filterName, value, ...params) {
        return this.filters(filterName).reduce((result, filter) => {
            return filter.doFilter(result, ...params)
        }, value)
    }
}

export class FilterCallback {
    static store = new Map()

    callback
    sortOrder

    constructor(callback, sortOrder) {
        this.callback = callback

        this.sortOrder = sortOrder
    }

    doFilter(value, ...params) {
        return this.callback(value, ...params)
    }
}
