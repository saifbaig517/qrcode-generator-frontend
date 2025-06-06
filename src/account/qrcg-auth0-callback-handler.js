import { LitElement, html, css } from 'lit'

export class QrcgAuth0CallbackHandler extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 2rem 0;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()

        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent('qrcg-login:after-login', {
                    detail: {
                        user: this.user,
                        token: this.token,
                        useRouter: false,
                    },
                })
            )
        }, 1000)
    }

    get user() {
        try {
            return JSON.parse(this.getAttribute('user'))
        } catch {
            return null
        }
    }

    get token() {
        try {
            return this.getAttribute('token')
        } catch {
            return null
        }
    }

    render() {
        return html` <qrcg-loader></qrcg-loader> `
    }
}

window.defineCustomElement(
    'qrcg-auth0-callback-handler',
    QrcgAuth0CallbackHandler
)
