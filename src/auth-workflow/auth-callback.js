import { LitElement, html, css } from 'lit'

export class QrcgAuthCallbackHandler extends LitElement {
    static EVENT_BEFORE_SOCIAL_LOGIN = 'qrcg-auth-callback::before-social-login'

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
                new CustomEvent(
                    QrcgAuthCallbackHandler.EVENT_BEFORE_SOCIAL_LOGIN
                )
            )
        }, 500)

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

    getBase64Attribute(name) {
        try {
            return JSON.parse(window.atob(this.getAttribute(name)))
        } catch {
            return null
        }
    }

    get user() {
        return this.getBase64Attribute('user')
    }

    get token() {
        return this.getBase64Attribute('token')
    }

    render() {
        return html` <qrcg-loader></qrcg-loader> `
    }
}

window.defineCustomElement('qrcg-auth-callback', QrcgAuthCallbackHandler)
