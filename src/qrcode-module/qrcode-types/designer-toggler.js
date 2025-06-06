import style from './designer-toggler.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { BaseTypeDesigner } from './base-designer'
import { mdiQrcode, mdiWeb } from '@mdi/js'
import { html } from 'lit'
import { t } from '../../core/translate'

export class DesignerToggler extends BaseComponent {
    static tag = 'qrcg-designer-toggler'

    static styleSheets = [...super.styleSheets, style]

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)

        this.syncTitle()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onClick)
    }

    onClick() {
        if (
            BaseTypeDesigner.designer ===
            BaseTypeDesigner.DESIGNER_QRCODE_DESIGNER
        ) {
            this.setDesignerType(BaseTypeDesigner.DESIGNER_WEBPAGE_DESIGNER)
        } else {
            this.setDesignerType(BaseTypeDesigner.DESIGNER_QRCODE_DESIGNER)
        }
    }

    setDesignerType(designer) {
        document.dispatchEvent(
            new CustomEvent(BaseTypeDesigner.EVENT_SET_ACTIVE_DESIGNER, {
                detail: {
                    designer,
                },
            })
        )
    }

    syncTitle() {
        if (
            BaseTypeDesigner.designer ===
            BaseTypeDesigner.DESIGNER_QRCODE_DESIGNER
        ) {
            this.title = t`Design Web Page`
        } else {
            this.title = t`Design QR Code`
        }
    }

    resolveIcon() {
        if (
            BaseTypeDesigner.designer ===
            BaseTypeDesigner.DESIGNER_QRCODE_DESIGNER
        ) {
            return mdiWeb
        }

        return mdiQrcode
    }

    render() {
        return html` <qrcg-icon mdi-icon=${this.resolveIcon()}></qrcg-icon> `
    }
}

DesignerToggler.register()
