import { html } from 'lit'
import { t } from '../../core/translate'
import { BaseOperation } from './base-operation'
import { isEmpty, url } from '../../core/helpers'
import { QRCGDownloadQRCode } from '../../qrcode-module/qrcg-download-qrcode'
import { destroy, get, post } from '../../core/api'
import { showToast } from '../../ui/qrcg-toast'
import { confirm } from '../../ui/qrcg-confirmation-modal'
import { Config } from '../../core/qrcg-config'

export class QrcgImportUrlQRCodesOperation extends BaseOperation {
    static name() {
        return t`Import QR Codes`
    }

    static type() {
        return 'import-url-qrcodes'
    }

    getExportSize() {
        const configSize = Config.get('bulk_operation.export-qrcode-size')

        if (isEmpty(configSize) || isNaN(configSize)) {
            return 2024
        }

        return configSize
    }

    async downloadPNG(instance) {
        const results = await this.fetchInstanceResults(instance)

        for (const item of results) {
            try {
                const { response } = await get(`qrcodes/${item.id}`)

                const qrcode = await response.json()

                const downloader = new QRCGDownloadQRCode()

                await downloader.downloadPng(qrcode, this.getExportSize())
            } catch {
                console.log(
                    'Cannot download QR code image [id = ' + item.id + ']'
                )
            }
        }
    }

    exportCsv(instance) {
        window.location = url('/api/bulk-operations/export-csv/' + instance.id)
    }

    async reRun(instance) {
        try {
            await confirm({
                message: t`This will only queue missing lines from the end of the csv file, it will not start the process immediatly but it will add missing lines to the jobs table. ONLY EXECUTE WHEN JOBS TABLE IN THE DATABASE IS EMPTY`,
            })
        } catch {
            return
        }

        try {
            await post(`bulk-operations/${instance.id}/re-run`)

            showToast(t`Instance queued successfully`)
        } catch {
            showToast(t`Error rerunning instance`)
        }
    }

    async deleteInstance(instance) {
        try {
            await confirm({
                message: t`Are you sure to delete this insance? This cannot be undone. Generated QR Codes won't be affected.`,
            })
        } catch {
            return
        }

        try {
            await destroy(`bulk-operations/${instance.id}`)

            showToast(t`Insance deleted successfully`)
        } catch {
            showToast(t`Error deleting instance`)
        }
    }

    async deleteAllQRCodes(instance) {
        try {
            await confirm({
                message: t`Are you sure to delete all QR codes of this instance? This cannot be undone.`,
            })
        } catch {
            return
        }

        try {
            await destroy(`bulk-operations/${instance.id}/all-qrcodes`)

            showToast(t`Insance deleted successfully`)
        } catch {
            showToast(t`Error deleting instance`)
        }
    }

    onActionClick(actionId, instance) {
        switch (actionId) {
            case 'download-png':
                return this.downloadPNG(instance)

            case 'export-csv':
                return this.exportCsv(instance)

            case 're-run':
                return this.reRun(instance)

            case 'delete':
                return this.deleteInstance(instance)

            case 'delete-all-qrcodes':
                return this.deleteAllQRCodes(instance)
        }
    }

    getVariables() {
        return {
            QRCODE_SLUG: t`The unique slug which is assigned to the QR code.`,
            QRCODE_ID: t`ID of the QR code.`,
            RANDOM_PINCODE: t`Generates Random PIN Code.`,
        }
    }

    renderVariablesInstructionsMessage() {
        return t`You can use the following variables in the destination URL:`
    }

    renderInstructions() {
        return html`
            <div class="instructions">
                ${t`Bulk import QR codes, work for either inserting new records or modifying existing records.`}

                <!-- -->

                ${this.renderVariablesInstructions()}

                <a href="${this.csvSampleUrl()}" target="_blank">
                    ${t`Download sample CSV file.`}
                </a>
            </div>
        `
    }

    csvSampleUrl() {
        return url(`/api/bulk-operations/${this.constructor.type()}/csv-sample`)
    }

    renderActions(instance) {
        return html`
            <div class="action" .instance=${instance} action-id="re-run">
                ${t`Re-Run`}
            </div>

            <div class="action" .instance=${instance} action-id="download-png">
                ${t`Download PNG`}
            </div>

            <div class="action" .instance=${instance} action-id="export-csv">
                ${t`Export CSV`}
            </div>

            <div class="action" .instance=${instance} action-id="delete">
                ${t`Delete Bulk Operation`}
            </div>

            <div
                class="action"
                .instance=${instance}
                action-id="delete-all-qrcodes"
            >
                ${t`Delete All QR Codes`}
            </div>
        `
    }

    renderFormFields() {
        return html`
            <qrcg-file-input
                upload-endpoint=${this.createRoute()}
                accept=".csv"
                name="${this.operationCreationFileInputName()}"
            >
                ${t`CSV File`}
            </qrcg-file-input>
        `
    }
}

window.defineCustomElement(
    QrcgImportUrlQRCodesOperation.tag(),
    QrcgImportUrlQRCodesOperation
)
