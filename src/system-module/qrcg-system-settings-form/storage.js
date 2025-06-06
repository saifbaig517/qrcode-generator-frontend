import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'
import { post } from '../../core/api'
import { showToast } from '../../ui/qrcg-toast'

export class QrcgSystemSettingsFormStorage extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .test-connection {
                width: fit-content;
                margin-top: 1rem;
            }
        `,
    ]

    async onTestConnectionClick() {
        try {
            this.testButton.loading = true
            const { response } = await post('system/test-storage')

            const data = await response.json()

            if (!data.result) throw new Error('')

            showToast('Storage test successful!')
        } catch {
            showToast('Error in storage configuration.')
        } finally {
            this.testButton.loading = false
        }
    }

    get testButton() {
        return this.shadowRoot.querySelector('.test-connection')
    }

    renderForm() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Storage Settings`}</h2>

                <qrcg-form-comment label="" icon="">
                    ${t`You can use either your local disk or any AWS S3 compatible object storage service, like Digital Ocean Spaces, Vultr Object Storage, Contabo Object Storage, etc ...`}
                </qrcg-form-comment>

                <qrcg-balloon-selector
                    name="app.storage_type"
                    .options=${[
                        {
                            name: t`Local`,
                            value: 'local',
                        },
                        {
                            name: t`S3 Object Storage`,
                            value: 's3',
                        },
                    ]}
                >
                    ${t`Storage Type. Default (Local)`}
                </qrcg-balloon-selector>

                <qrcg-input
                    name="filesystems.s3.key"
                    placeholder="${t`Your AWS Access Key`}"
                >
                    ${t`Access Key ID`}
                </qrcg-input>

                <qrcg-input
                    name="filesystems.s3.secret"
                    placeholder="${t`Your AWS Secret Key`}"
                >
                    ${t`Secret Access Key`}
                </qrcg-input>

                <qrcg-input
                    name="filesystems.s3.region"
                    placeholder="${t`Your AWS Region`}"
                >
                    ${t`Region`}
                </qrcg-input>

                <qrcg-input
                    name="filesystems.s3.bucket"
                    placeholder="${t`Your AWS Bucket`}"
                >
                    ${t`Bucket`}
                </qrcg-input>

                <qrcg-input
                    name="filesystems.s3.url"
                    placeholder="${t`Leave empty if you are using Amazon S3`}"
                >
                    ${t`AWS URL`}
                </qrcg-input>

                <qrcg-input
                    name="filesystems.s3.endpoint"
                    placeholder="${t`Leave empty if you are using Amazon S3`}"
                >
                    ${t`AWS End Point`}
                </qrcg-input>

                <qrcg-button
                    @click=${this.onTestConnectionClick}
                    secondary
                    class="test-connection"
                >
                    ${t`Test Connection`}
                </qrcg-button>
            </qrcg-form-section>
        `
    }
}

window.defineCustomElement(
    'qrcg-system-settings-form-storage',
    QrcgSystemSettingsFormStorage
)
