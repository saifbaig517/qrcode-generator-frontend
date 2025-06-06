import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'

import '../qrcg-system-smtp-settings-test'

export class QrcgSystemSettingsFormSmtp extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            qrcg-timezone-select {
                max-width: 50%;
            }
        `,
    ]

    renderSmtpDetailsSection() {
        return html`
            <section>
                <h2 class="section-title">${t`SMTP Details`}</h2>

                <qrcg-input
                    name="mail.mailers.smtp.host"
                    placeholder="mail.domain.tld"
                >
                    ${t`Host`}
                </qrcg-input>

                <qrcg-input
                    name="mail.mailers.smtp.username"
                    placeholder="username@domain.com"
                >
                    ${t`Username`}
                </qrcg-input>

                <qrcg-input
                    name="mail.mailers.smtp.password"
                    placeholder="username@domain.com"
                    type="password"
                >
                    ${t`Password`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="mail.mailers.smtp.encryption"
                    .options=${[
                        {
                            name: t`None`,
                            value: null,
                        },
                        {
                            name: t`SSL`,
                            value: 'ssl',
                        },
                        {
                            name: t`TLS`,
                            value: 'tls',
                        },
                    ]}
                >
                    ${t`Encryption`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="mail.mailers.smtp.port"
                    .options=${[
                        {
                            name: 25,
                            value: 25,
                        },
                        {
                            name: 587,
                            value: 587,
                        },
                        {
                            name: 465,
                            value: 465,
                        },
                    ]}
                >
                    ${t`Port`}
                </qrcg-balloon-selector>

                <qrcg-input
                    name="mail.from.address"
                    placeholder="email@domain.com"
                >
                    ${t`From Address`}
                </qrcg-input>

                <qrcg-input name="mail.from.name" placeholder="No Reply">
                    ${t`From Name`}
                </qrcg-input>

                <qrcg-input
                    name="mail.mailers.smtp.timeout"
                    type="number"
                    min="1"
                    placeholder="5"
                >
                    ${t`Timeout`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="mail.mailers.smtp.auth_type"
                    .options=${[
                        {
                            name: `Auto`,
                            value: 'null',
                        },
                        {
                            name: `PLAIN`,
                            value: 'PLAIN',
                        },
                        {
                            name: `LOGIN`,
                            value: 'LOGIN',
                        },
                        {
                            name: 'XOAUTH2',
                            value: 'XOAUTH2',
                        },
                        {
                            name: 'OAUTHBEARER',
                            value: 'OAUTHBEARER',
                        },
                        {
                            name: `CRAM-MD5`,
                            value: 'CRAM-MD5',
                        },
                    ]}
                >
                    ${t`Auth Type. Default (Auto)`}
                    <div slot="instructions">
                        ${t`AUTH LOGIN command in the SMTP protocl. For most cases this should be left auto.`}
                    </div>
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderTestSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Send Test Email`}</h2>
                <qrcg-system-smtp-settings-test></qrcg-system-smtp-settings-test>
            </qrcg-form-section>
        `
    }

    renderForm() {
        return [
            this.renderSmtpDetailsSection(),
            //
            this.renderTestSection(),
        ]
    }
}

window.defineCustomElement(
    'qrcg-system-settings-form-smtp',
    QrcgSystemSettingsFormSmtp
)
