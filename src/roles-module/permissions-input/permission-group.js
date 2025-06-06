import { ucwords } from '../../core/helpers'

export class PermissionGroup {
    slug

    permissions = []

    isSelected = false

    static fromPermission(permission) {
        const instance = new this()

        instance.slug = instance.extractSlug(permission)

        instance.permissions.push(permission)

        return instance
    }

    hasPermissionId(id) {
        return this.permissions.find((p) => p.id == id)
    }

    getName() {
        return ucwords(this.slug.replace(/-/g, ' '))
    }

    canAddPermission(p) {
        return this.slug === this.extractSlug(p)
    }

    addPermission(p) {
        this.permissions.push(p)
    }

    extractSlug(permission) {
        return permission.slug.split('.')[0]
    }

    setSelected(value) {
        this.isSelected = value

        return this
    }

    getPermissionIds() {
        return this.permissions.map((p) => p.id)
    }
}
