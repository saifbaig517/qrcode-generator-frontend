import { LitElement, html, css } from 'lit'
import { isEmpty } from '../core/helpers'

export class QrcgCodeInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: relative;
            }

            #editor-container {
                min-height: 450px;
                margin-bottom: 0.5rem;
            }

            label *::slotted(*) {
                display: block;
                margin-bottom: 1rem;
                font-size: 0.8rem;
                font-weight: bold;
                letter-spacing: 1px;
                user-select: none;
                -webkit-user-select: none;
            }

            .error {
                color: var(--danger);
                position: absolute;
                font-size: 0.8rem;
                font-weight: bold;
                bottom: 0.5rem;
                transform: translateY(100%);
                animation: fade-in ease 1s both;
            }

            .monaco-editor {
                padding-top: 1rem;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

            qrcg-loader {
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 100;
                transform: translate(-50%, -50%);
            }

            .instructions *::slotted(*) {
                font-size: 0.8rem;
                padding: 0.5rem;
                background-color: var(--gray-0);
                margin-bottom: 0.5rem;
                line-height: 1.7;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {},
            errors: { type: Array },
            loading: { type: Boolean },
            language: {},
        }
    }

    constructor() {
        super()

        this.loading = true

        this.language = 'html'
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        // Clearing up monaco
        window.monaco.editor.getModels().forEach((model) => model.dispose())
    }

    async firstUpdated() {
        await this.loadMonaco()

        window.require.config({
            paths: { vs: '/assets/lib/monaco-editor/min/vs' },
        })

        window.require(['vs/editor/editor.main'], () => {
            this.editor = window.monaco.editor.create(
                this.shadowRoot.querySelector('#editor-container'),
                {
                    theme: 'vs-dark',
                    value: '',
                    language: this.getLanguage(),
                    fontSize: '18px',
                }
            )

            this.editor.getModel().onDidChangeContent(() => {
                this.fireOnInput()
            })

            this.syncEditorValue()

            this.loading = false
        })
    }

    updated(changed) {
        if (changed.has('value')) {
            this.syncEditorValue()
        }

        if (changed.has('language')) {
            this.syncLanguage()
        }
    }

    syncEditorValue() {
        if (!this.editor) return

        if (this.value !== this.editor.getModel().getValue()) {
            try {
                this.editor.getModel().setValue(this.value)
            } catch {
                //
            }
        }
    }

    fireOnInput() {
        this.value = this.editor.getValue()

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: this.value,
                },
            })
        )
    }

    async loadMonaco() {
        if (typeof window.monaco == 'undefined') {
            await this.loadMonacoScript()
        }

        await this.loadMoncoStyles()
    }

    loadMonacoScript() {
        return new Promise((resolve) => {
            window.require = {
                paths: { vs: '/assets/lib/monaco-editor/min/vs' },
            }

            let node

            node = document.createElement('script')

            node.onload = resolve

            node.src = '/assets/lib/monaco-editor/min/vs/loader.js'

            document.body.appendChild(node)
        })
    }

    async loadMoncoStyles() {
        let css

        if (!this.constructor.__monacoStyles) {
            css = await (
                await fetch(
                    '/assets/lib/monaco-editor/min/vs/editor/editor.main.css'
                )
            ).text()

            this.constructor.__monacoStyles = css
        } else {
            css = this.constructor.__monacoStyles
        }

        const style = document.createElement('style')

        style.innerHTML = css

        this.shadowRoot.appendChild(style)
    }

    hasValidLanguage() {
        return !!['css', 'html', 'javascript'].find((l) => l == this.language)
    }

    getLanguage() {
        if (!this.hasValidLanguage()) return 'html'

        return this.language
    }

    syncLanguage = () => {
        const model = this?.editor?.getMode()

        if (!model) return

        window?.monaco?.editor?.setModelLanguage(model, this.getLanguage())
    }

    renderErrors() {
        return !isEmpty(this.errors)
            ? html` <label class="error"> ${this.errors[0]} </label> `
            : html``
    }

    renderInstructions() {
        return html`
            <div class="instructions">
                <slot name="instructions"></slot>
            </div>
        `
    }

    render() {
        return html`
            <label>
                <slot></slot>
            </label>

            ${this.renderInstructions()}
            ${this.loading ? html`<qrcg-loader></qrcg-loader>` : null}

            <div id="editor-container"></div>

            ${this.renderErrors()}
        `
    }
}
window.defineCustomElement('qrcg-code-input', QrcgCodeInput)
