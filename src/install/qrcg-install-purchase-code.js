import { css, html } from 'lit'
import { QRCGInstallPage } from './qrcg-install-page'
import { ConfigHelper } from '../core/config-helper'

export class QrcgInstallPurchaseCode extends QRCGInstallPage {
    static get styles() {
        return [
            super.styles,
            css`
                a {
                    color: var(--primary-0);
                }
            `,
        ]
    }

    connectedCallback() {
        super.connectedCallback()
    }

    renderTitle() {
        if (ConfigHelper.isPaddle()) {
            return 'License Key'
        }

        if (ConfigHelper.isCodeCanyon()) {
            return 'Purchase Code'
        }

        return 'Purchase Code / License Key'
    }

    getBackLink() {
        return '/install'
    }

    getNextLink() {
        return '/install/app-details'
    }

    verifyLink() {
        return 'install/verify-purchase-code'
    }

    verificationFailedMessage() {
        return 'Invalid license key ...'
    }

    verificationSuccessMessage() {
        return 'License key accepted ...'
    }

    renderPieceXHelp() {
        const subject = encodeURIComponent('PieceX License Key')

        const message = encodeURIComponent(
            'Please generate a license key to activate my Quick Code installation.'
        )

        return html`
            <div>
                Please enter your license key, if you did not receive it from us
                yet by email, please
                <a
                    href="mailto:mohammad.a.alhomsi@gmail.com?subject=${subject}&body=${message}"
                >
                    send us an email
                </a>
                to get your license key.
            </div>
        `
    }

    renderHelp() {
        if (ConfigHelper.getMarketPlace() === 'PIECEX') {
            return this.renderPieceXHelp()
        }

        return this.renderDefaultHelp()
    }

    renderDefaultHelp() {
        if (ConfigHelper.isPaddle()) {
            return 'Please enter your license key.'
        }

        if (ConfigHelper.isCodeCanyon()) {
            return 'Please enter your purchase code.'
        }

        return `Please enter your license key or purchase code.`
    }

    envVariables() {
        return [
            {
                key: 'ENVATO_PURCHASE_CODE',
                name: ConfigHelper.isPaddle() ? 'License Key' : 'Purchase Code',
                placeholder: '00000-0000-0000',
            },
        ]
    }
}

window.defineCustomElement(
    'qrcg-install-purchase-code',
    QrcgInstallPurchaseCode
)
