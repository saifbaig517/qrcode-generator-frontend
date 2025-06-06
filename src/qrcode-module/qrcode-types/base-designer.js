import './bound-qrcode-designer'

import { unsafeStatic, html } from 'lit/static-html.js'
import { BaseComponent } from '../../core/base-component/base-component'

export class BaseTypeDesigner extends BaseComponent {
    static styleSheets = [...super.styleSheets]

    static EVENT_SET_ACTIVE_DESIGNER = 'type-designer::set-active-designer'

    static DESIGNER_QRCODE_DESIGNER = 'qrcode-designer'

    static DESIGNER_WEBPAGE_DESIGNER = 'webpage'

    static get properties() {
        return {
            ...super.properties,
        }
    }

    get designer() {
        return BaseTypeDesigner.designer
    }

    set designer(v) {
        //
        BaseTypeDesigner.designer = v

        this.requestUpdate()
    }

    constructor() {
        super()

        this.designer = BaseTypeDesigner.DESIGNER_WEBPAGE_DESIGNER
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            BaseTypeDesigner.EVENT_SET_ACTIVE_DESIGNER,
            this.onSetActiveDesigner
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            BaseTypeDesigner.EVENT_SET_ACTIVE_DESIGNER,
            this.onSetActiveDesigner
        )
    }

    onSetActiveDesigner = (e) => {
        this.designer = e.detail.designer
    }

    webPageDesignerElementName() {}

    renderWebPageDesignerElement() {
        if (this.designer != BaseTypeDesigner.DESIGNER_WEBPAGE_DESIGNER) return

        const tag = this.webPageDesignerElementName()

        return html`${unsafeStatic(`<${tag}></${tag}>`)}`
    }

    renderQRCodeDesigner() {
        if (this.designer != BaseTypeDesigner.DESIGNER_QRCODE_DESIGNER) return

        return html` <qrcg-bound-qrcode-designer></qrcg-bound-qrcode-designer> `
    }

    render() {
        return html`
            ${this.renderWebPageDesignerElement()}
            <!--  -->
            ${this.renderQRCodeDesigner()}
        `
    }
}
