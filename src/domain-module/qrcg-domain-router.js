import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-domain-form-page'

import './qrcg-domain-list-page'

import './qrcg-domain-add-page'

export class QrcgDomainRouter extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve))
        }

        document.body.appendChild(new QrcgDomainRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/domains$"
                permission="domain.list-all"
            >
                <template>
                    <qrcg-domain-list-page></qrcg-domain-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/domains/new|/dashboard/domains/edit/(?<id>\\d+)"
                permission="domain.update-any"
            >
                <template>
                    <qrcg-domain-form-page></qrcg-domain-form-page>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/domains/add"
                permission="domain.add"
            >
                <template>
                    <qrcg-domain-add-page></qrcg-domain-add-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-domain-router', QrcgDomainRouter)

QrcgDomainRouter.boot()
