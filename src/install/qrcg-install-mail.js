import { css, html } from 'lit'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { QRCGInstallPage } from './qrcg-install-page'

export class QrcgInstallMail extends QRCGInstallPage {
    static get styles() {
        return [
            super.styles,
            css`
                .skip-link {
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    margin: 1rem 0 0 0;
                    text-align: center;
                    color: var(--gray-2);
                    font-size: 0.8rem;
                    text-decoration: underline;
                    cursor: pointer;
                }
            `,
        ]
    }
    renderTitle() {
        return 'Mail Setup'
    }

    getBackLink() {
        return '/install/super-user'
    }

    isLast() {
        return true
    }

    renderWarning() {
        return html`This is final step, make sure all details are correct, you
            will have <b>no longer access</b> to the installation wizard after
            completing this step.`
    }

    getNextLink() {
        return null
    }

    renderNavigation() {
        return html`
            ${super.renderNavigation()}
            <div class="below-navigation">
                <div class="skip-link" @click=${this.onSkipClick}>
                    Skip Mail Configuration
                </div>
            </div>
        `
    }

    async onSkipClick() {
        try {
            await confirm({
                message:
                    'Are you sure you want to skip mail configuration? Password reset emails wont work. You can change SMTP configurations later from Settings > Email Settings',
            })
            this.completeInstallation()
        } catch {
            //
        }
    }

    verifyLink() {
        return 'install/verify-mail'
    }

    renderHelp() {
        return `    
            We will send a test email to the super user email provided in previous step.
        `
    }

    verificationFailedMessage() {
        return 'Cannot connect to mail server...'
    }

    verificationSuccessMessage() {
        return 'Mail server connection works...'
    }

    envVariables() {
        return [
            { key: 'MAIL_HOST', name: 'SMTP Host' },
            { key: 'MAIL_PORT', name: 'SMTP Port' },
            { key: 'MAIL_USERNAME', name: 'SMTP User Name' },
            { key: 'MAIL_PASSWORD', name: 'SMTP Password', type: 'password' },
            {
                key: 'MAIL_ENCRYPTION',
                name: 'SMTP Encryption',
                type: 'qrcg-balloon-selector',
                options: [
                    {
                        value: 'null',
                        name: 'None',
                    },
                    {
                        value: 'tls',
                        name: 'TLS',
                    },
                    {
                        value: 'ssl',
                        name: 'SSL',
                    },
                ],
            },
            { key: 'MAIL_FROM_ADDRESS', name: 'SMTP From Address' },
            { key: 'MAIL_FROM_NAME', name: 'SMTP From Name' },
        ]
    }
}

window.defineCustomElement('qrcg-install-mail', QrcgInstallMail)
