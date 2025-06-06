import { css, html } from 'lit'
import { Config } from '../core/qrcg-config'

import { QRCGInstallPage } from './qrcg-install-page'

export class QrcgInstallIntroduction extends QRCGInstallPage {
    static get styles() {
        return [
            super.styles,
            css`
                ul {
                    line-height: 1.8;
                    padding: 0 1rem;
                }
                li {
                    margin: 0;
                }
            `,
        ]
    }

    renderTitle() {
        return `Welcome in ${Config.get('app.name')}`
    }

    getNextLink() {
        return '/install/purchase-code'
    }

    renderForm() {
        return html`
            <div>
                <p>
                    This wizard will guide you through the installation process.
                </p>
                <h2>Before you start</h2>
                <div>
                    Make sure you have the following ready:
                    <ul>
                        <li>MySQL database credentials.</li>
                        <li>SMTP mail server credentials.</li>
                        <li>
                            Script is running on Linux system, to configure cron
                            jobs.
                        </li>
                    </ul>
                </div>
                <p>If you are ready to proceed click Next.</p>
            </div>
        `
    }
}
window.defineCustomElement('qrcg-install-introduction', QrcgInstallIntroduction)
