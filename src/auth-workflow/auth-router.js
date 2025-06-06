import { LitElement, html, css } from 'lit'

import './auth-settings-page'

export class QrcgAuthWorkflowRouter extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        const elem = document.createElement('qrcg-auth-workflow-router')

        document.body.appendChild(elem)
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/system/auth-workflow$"
                permission="system.settings"
            >
                <template>
                    <qrcg-auth-settings-page></qrcg-auth-settings-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-auth-workflow-router', QrcgAuthWorkflowRouter)

QrcgAuthWorkflowRouter.boot()
