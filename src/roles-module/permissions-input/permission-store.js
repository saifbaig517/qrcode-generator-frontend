import { PermissionGroup } from './permission-group'

export class PermissionStore {
    permissions = []

    /**
     * @type {PermissionGroup[]}
     */
    groups = []

    static withPermissions(permissions) {
        const instance = new this()

        instance.permissions = permissions

        return instance
    }

    find(slug) {
        return this.groups.find((g) => g.slug === slug)
    }

    build() {
        this.groups = this.permissions.reduce((groups, permission) => {
            const group = groups.find((g) => g.canAddPermission(permission))

            if (group) {
                group.addPermission(permission)

                return groups
            }

            const newGroup = PermissionGroup.fromPermission(permission)

            groups.push(newGroup)

            return groups
        }, [])

        return this
    }

    get() {
        return this.groups
    }

    getSelectedPermissionIds() {
        return this.groups.reduce((permissions, group) => {
            if (group.isSelected)
                return permissions.concat(group.getPermissionIds())

            return permissions
        }, [])
    }

    syncSelectedPermissionIds(ids) {
        if (!(ids instanceof Array)) {
            return this
        }

        ids.forEach((id) => {
            const group = this.groups.find((group) => {
                return group.hasPermissionId(id)
            })

            group.setSelected(true)
        })

        return this
    }
}
