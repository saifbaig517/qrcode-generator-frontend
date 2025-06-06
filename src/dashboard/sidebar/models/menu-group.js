import { hash, isArray, isEmpty } from '../../../core/helpers'
import { MenuItemModel } from './menu-item'

export class MenuGroupModel {
    /**
     * @type {MenuItemModel[]}
     */
    items = []
    name
    isLocked

    get id() {
        return hash(this.name)
    }

    get isExpanded() {
        return this.getSessionStorage('isExpanded')
    }

    set isExpanded(v) {
        this.setSessionStorage('isExpanded', v)
    }

    constructor(name) {
        this.name = name
    }

    /**
     *
     * @param {Array} groups
     * @returns {MenuGroupModel[]}
     */
    static fromRawGroupList(groups) {
        groups = isEmpty(groups) || !isArray(groups) ? [] : groups

        groups = groups.filter((group) => {
            let items = group?.items ?? []

            items = items.filter((i) => i?.link)

            if (isEmpty(group) || isEmpty(group.name) || isEmpty(items)) {
                return false
            }

            return true
        })

        groups = groups.map(function (groupObject) {
            const group = new MenuGroupModel(groupObject.name)

            group.addItems(
                groupObject.items.map(function (itemObject) {
                    const item = new MenuItemModel(
                        itemObject.label,
                        itemObject.link,
                        itemObject.permission
                    )

                    item.target = itemObject.target

                    item.badge = itemObject.badge

                    item.badgeBackgroundColor = itemObject.badgeBackgroundColor

                    item.badgeTextColor = itemObject.badgeTextColor

                    return item
                })
            )

            return group
        })

        return groups
    }

    /**
     *
     * @param {MenuItemModel|Function} item
     * @returns
     */
    addItem(item) {
        if (typeof item === 'function') {
            item = item()
        }

        if (!item) {
            return this
        }

        item.group = this

        this.items.push(item)

        return this
    }

    /**
     *
     * @param {MenuItemModel|Function[]} items
     */
    addItems(items) {
        items.forEach((item) => {
            this.addItem(item)
        })

        return this
    }

    lock() {
        this.isLocked = true
        return this
    }

    setSessionStorage(key, value) {
        if (!sessionStorage.MenuGroupModel) {
            sessionStorage.MenuGroupModel = '{}'
        }

        const map = JSON.parse(sessionStorage.MenuGroupModel)

        map[this.getSessionStorageKey(key)] = value

        sessionStorage.MenuGroupModel = JSON.stringify(map)
    }

    getSessionStorage(key) {
        try {
            const map = JSON.parse(sessionStorage.MenuGroupModel)

            return map[this.getSessionStorageKey(key)]
        } catch {
            // console.error(ex)
        }

        return null
    }

    getSessionStorageKey(key) {
        return key + '-' + this.id
    }
}
