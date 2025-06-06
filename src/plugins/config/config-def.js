import { html, unsafeStatic } from 'lit/static-html.js'

export class PluginConfigDef {
    constructor({
        key,
        expandedKey,
        title,
        instructions,
        type,
        value,
        placeholder,
        extra,
    } = {}) {
        this.key = key
        this.expandedKey = expandedKey
        this.title = title
        this.instructions = instructions
        this.type = type
        this.value = value
        this.placeholder = placeholder
        this.extra = extra
    }

    renderInstructions() {
        if (!this.instructions) return

        return html` <div slot="instructions">${this.instructions}</div>`
    }

    renderFileInput() {
        return html`
            <qrcg-file-input
                name="${this.expandedKey ?? ''}"
                upload-endpoint="system/configs/upload?key=${this.expandedKey}"
            >
                ${this.title}
                <!-- -->
                ${this.renderInstructions()}
            </qrcg-file-input>
        `
    }

    renderTextInput(type = 'text') {
        return html`
            <qrcg-input
                name=${this.expandedKey ?? ''}
                .placeholder=${this.placeholder ?? ''}
                type=${type}
            >
                ${this.title}
                <!-- -->
                ${this.renderInstructions()}
            </qrcg-input>
        `
    }

    renderBalloonSelector() {
        return html`
            <qrcg-balloon-selector
                name=${this.expandedKey}
                .options=${this.extra.options}
                ?multiple=${this.extra.multiple}
            >
                ${this.title}
                <!-- -->
                ${this.renderInstructions()}
            </qrcg-balloon-selector>
        `
    }

    renderCodeInput() {
        return html`
            <qrcg-code-input name=${this.expandedKey}>
                <span> ${this.title} </span>
                <!-- -->
                ${this.renderInstructions()}
            </qrcg-code-input>
        `
    }

    renderTextAreaInput() {
        return html`
            <qrcg-textarea
                name=${this.expandedKey}
                placeholder=${this.placeholder ?? ''}
            >
                ${this.title}
                <!-- -->
                ${this.renderInstructions()}
            </qrcg-textarea>
        `
    }

    renderCustomTag() {
        const tag = this.extra.tag

        const element = `<${tag} name="${this.expandedKey}"></${tag}>`

        return html`${unsafeStatic(element)}`
    }

    renderReviewSitesInput() {
        return html`
            <qrcg-review-sites-input
                name="${this.expandedKey}"
                without-qrcode
            ></qrcg-review-sites-input>
        `
    }

    render() {
        switch (this.type) {
            case 'file':
                return this.renderFileInput()

            case 'balloon-selector':
                return this.renderBalloonSelector()

            case 'code-input':
                return this.renderCodeInput()

            case 'textarea':
                return this.renderTextAreaInput()

            case 'text':
                return this.renderTextInput()

            case 'number':
                return this.renderTextInput('number')

            case 'custom':
                return this.renderCustomTag()

            case 'review-sites':
                return this.renderReviewSitesInput()

            default:
                return this.renderTextInput()
        }
    }
}
