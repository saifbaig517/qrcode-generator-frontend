export class ActionCollection {
    store = new Map()

    actions(actionName) {
        let list = this.store.get(actionName)

        if (!list) {
            list = []

            this.store.set(actionName, list)
        }

        list = list.sort(function (a, b) {
            return a.sortOrder - b.sortOrder
        })

        return list
    }

    addAction(actionName, callback, sortOrder = 0) {
        this.actions(actionName).push(new ActionCallback(callback, sortOrder))
    }

    doActions(actionName, ...params) {
        return this.actions(actionName).map((action) => {
            return action.doAction(...params)
        })
    }
}

export class ActionCallback {
    static store = new Map()

    callback
    sortOrder

    constructor(callback, sortOrder) {
        this.callback = callback

        this.sortOrder = sortOrder
    }

    doAction(value, ...params) {
        return this.callback(value, ...params)
    }
}
