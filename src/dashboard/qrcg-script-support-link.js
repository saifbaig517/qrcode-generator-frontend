import { LitElement, html, css } from 'lit'
import { isSuperAdmin } from '../core/auth'
import { mdiLifebuoy } from '@mdi/js'
import { Config } from '../core/qrcg-config'
import { t } from '../core/translate'
import { ConfigHelper } from '../core/config-helper'
import { DirectionAwareController } from '../core/direction-aware-controller'

export class QrcgScriptSupportLink extends LitElement {
    #dir = new DirectionAwareController(this)

    static styles = [
        css`
            :host {
                display: flex;
            }

            @media (max-width: 900px) {
                :host {
                    display: none;
                }
            }

            a {
                color: white;
                margin-right: 1rem;
                display: flex;
                align-items: center;
                text-decoration: none;
            }

            :host(.dir-rtl) a {
                margin-left: 1rem;
                margin-right: 0;
            }

            a span {
                font-weight: bold;
                font-size: 0.8rem;
                margin-left: 0.5rem;
            }

            :host(.dir-rtl) a span {
                margin-left: 0;
                margin-right: 0.5rem;
            }

            a:hover {
                color: var(--primary-0);
            }

            qrcg-icon {
                width: 1.2rem;
                height: 1.2rem;
            }
        `,
    ]

    shouldRender() {
        if (!isSuperAdmin()) return false

        if (ConfigHelper.isDemo()) return false

        const value = Config.get('dashboard.help_button_in_dashboard_header')

        if (value === 'disabled') return false

        return true
    }

    render() {
        if (!this.shouldRender()) return

        return html`
            <a
                target="_blank"
                href="https://quickcodesupport.atlassian.net/servicedesk/customer/portal/3"
            >
                <qrcg-icon mdi-icon=${mdiLifebuoy}></qrcg-icon>
                <span>${t`Support`}</span>
            </a>
        `
    }
}

window.defineCustomElement('qrcg-script-support-link', QrcgScriptSupportLink)
