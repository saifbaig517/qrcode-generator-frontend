import { html } from 'lit'

import '../ui/qrcg-box'
import '../ui/qrcg-input'
import '../ui/qrcg-button'
import '../ui/qrcg-form'
import '../ui/qrcg-link'
import { post } from '../core/api'
import { QRCGApiConsumer } from '../core/qrcg-api-consumer'
import { QRCGFormController } from '../core/qrcg-form-controller'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'
import { Config } from '../core/qrcg-config'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-account-page.scss?inline'
import { classMap } from 'lit/directives/class-map.js'

export class QRCGAccountPage extends BaseComponent {
    //
    api = new QRCGApiConsumer(this)

    formController = new QRCGFormController(this)

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            data: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()

        if (this.isImageOnRight()) {
            this.classList.add('right')
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    async submitForm() {
        try {
            const { token, user } = await this.api.call(() =>
                post('login', this.data)
            )

            window.dispatchEvent(
                new CustomEvent('qrcg-login:after-login', {
                    detail: {
                        user,
                        token,
                    },
                })
            )
        } catch (error) {
            console.error(error)
        }
    }

    getTitle() {
        return 'Page Title'
    }

    getDescription() {
        return 'Welcome Back, description goes here.'
    }

    isGradientDisabled() {
        return Config.get('account_page.gradient') === 'disabled'
    }

    isImageOnRight() {
        return Config.get('account_page.image_position') === 'right'
    }

    isImageRoundCornerDisabled() {
        return Config.get('account_page.image_round_corner') === 'disabled'
    }

    renderForm() {}

    renderTitle() {}

    renderAccountPageForm() {
        return html` <qrcg-form> ${this.renderForm()} </qrcg-form> `
    }

    renderContent() {
        return html`
            <h1 class="page-title">${this.getTitle()}</h1>

            <p class="page-description">${this.getDescription()}</p>

            ${this.renderAccountPageForm()}
        `
    }

    shouldRenderGoHomeLink() {
        const config = Config.get('app.frontend_links')

        return !config || config === 'enabled'
    }

    renderGoHomeLink() {
        if (!this.shouldRenderGoHomeLink()) return

        return html`
            <a class="go-home" href="/">
                ${t`Or you may go back to the home page.`}
            </a>
        `
    }

    renderAccountPageBackground() {
        const backgroundImageUrl = Config.get(
            'account_page.background_image_url'
        )

        const _class = classMap({
            'account-page-background': true,
            'no-radius': this.isImageRoundCornerDisabled(),
        })

        if (isEmpty(backgroundImageUrl)) {
            return html` <div class="${_class}"></div> `
        }

        return html`
            <div
                class="${_class}"
                style="background-image: url(${backgroundImageUrl});"
            ></div>
        `
    }

    renderAccountPageContent() {
        return html`
            <div
                class="${classMap({
                    'account-page-content': true,
                    'no-gradient': this.isGradientDisabled(),
                })}"
            >
                <div class="account-page-content-box">
                    <div class="logo-container">
                        <qrcg-app-logo variation="login"></qrcg-app-logo>
                    </div>

                    <div class="content-container">${this.renderContent()}</div>

                    ${this.renderGoHomeLink()}
                </div>
            </div>
        `
    }

    render() {
        return [
            this.renderAccountPageBackground(),
            this.renderAccountPageContent(),
        ]
    }
}
