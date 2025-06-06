import { LitElement, css, html } from 'lit'
import { defineCustomElement } from '../../../core/helpers'

import { t } from '../../../core/translate'
import { QrcgWebpagePreview } from '../qrcg-webpage-preview'
import { showToast } from '../../../ui/qrcg-toast'
import { PluginManager } from '../../../../plugins/plugin-manager'
import { FILTER_WEBSITE_BUILDER_FULLSCREEN_TEXT_COLOR } from '../../../../plugins/plugin-filters'

export class WebsiteBuilderFullScreen extends LitElement {
    static tag = 'qrcg-website-builder-fullscreen'

    static styles = [
        css`
            :host {
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
                z-index: 100;
                background-color: white;
                color: white;
            }

            iframe {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                min-height: 100%;
                z-index: 1;
                border: 0;
            }

            .close-container {
                position: absolute;
                top: 0;
                width: 100;
                left: 0;
                right: 0;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                pointer-events: none;
            }

            .close-text {
                padding: 10px;
                font-weight: bold;
                cursor: pointer;
                pointer-events: all;
                font-size: 16px;
            }

            .close-text.disabled {
                opacity: 0.5;
                pointer-events: none;
                cursor: initial;
            }

            qrcg-loader-h {
                --qrcg-loader-h-color: currentColor;
                transform: translateY(-33%);
            }

            .close-text:hover {
                background-color: rgba(255, 255, 255, 0.5);
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            saving: {
                type: Boolean,
            },
        }
    }

    static open(url) {
        const elem = document.createElement(this.tag)

        elem.url = url

        document.body.appendChild(elem)

        const color = PluginManager.applyFilters(
            FILTER_WEBSITE_BUILDER_FULLSCREEN_TEXT_COLOR,
            'white'
        )

        elem.style.color = color
    }

    connectedCallback() {
        super.connectedCallback()

        window.addEventListener('message', this.onMessage)

        window.addEventListener('beforeunload', this.onBeforeUnload)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        window.removeEventListener('message', this.onMessage)

        window.removeEventListener('beforeunload', this.onBeforeUnload)
    }

    onBeforeUnload = (e) => {
        if (this.saving) {
            e.preventDefault()
            e.returnValue = t`There are unsaved changes, are you sure you want to close the window?`
        } else {
            delete e.returnValue
        }
    }

    onMessage = (e) => {
        switch (e.data) {
            case 'saving:start':
                this.onSavingStart()
                break
            case 'saving:end':
                this.onSavingEnd()
                break
            case 'saving:error':
                this.onSavingError()
                break
        }
    }

    onSavingStart() {
        this.saving = true
    }

    onSavingEnd() {
        this.saving = false
    }

    onSavingError() {
        showToast(t`Error while saving the web page.`)
    }

    async doClose() {
        if (this.saving) {
            return
        }

        this.remove()

        document.dispatchEvent(
            new CustomEvent(QrcgWebpagePreview.EVENT_REQEUST_REFRESH)
        )
    }

    renderCloseText() {
        if (this.saving) {
            return html` <qrcg-loader-h></qrcg-loader-h> `
        }

        return t`Close`
    }

    render() {
        return html`
            <div class="close-container">
                <div
                    class="close-text ${this.saving ? 'disabled' : ''}"
                    @click=${this.doClose}
                >
                    ${this.renderCloseText()}
                </div>
            </div>

            <iframe src=${this.url}></iframe>
        `
    }
}

defineCustomElement(WebsiteBuilderFullScreen.tag, WebsiteBuilderFullScreen)
