import { html } from 'lit'
import style from './role-name.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { t } from '../../core/translate'

export class RoleName extends BaseComponent {
    static tag = 'qrcg-role-name'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            model: {},
        }
    }

    renderReadOnlyBadge() {
        if (!this.model.read_only) {
            return
        }

        return html` <div class="badge read-only">${t`Read Only`}</div> `
    }

    renderSuperAdminBadge() {
        if (!this.model.super_admin) return

        return html` <div class="badge super-admin">${t`Super Admin`}</div> `
    }

    render() {
        return html`
            <div class="text">${this.model.name}</div>

            ${this.renderReadOnlyBadge()}
            <!--  -->
            ${this.renderSuperAdminBadge()}
        `
    }
}

RoleName.register()
