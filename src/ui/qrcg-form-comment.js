import { html, LitElement, css } from 'lit'
import { mdiHelpCircle } from '@mdi/js'
import './qrcg-icon'
import { t } from '../core/translate'

class QRCGFormComment extends LitElement {
    static get styles() {
        return css`
            :host {
                display: grid;
                grid-template-columns: 1fr;
                padding: 1rem;
                background-color: var(--gray-0);
                color: var(--dark);
                grid-gap: 0.25rem;
                line-height: 1.6;
                font-size: 0.8rem;
            }

            qrcg-icon {
                display: none;
                width: 1.5rem;
                height: 1.5rem;
            }

            .usecase {
                display: none;
            }

            @media (min-width: 850px) {
                :host {
                    align-items: center;
                    grid-gap: 1rem;
                    grid-template-areas: 'icon label content';
                    grid-template-columns: 24px auto 1fr;
                }

                qrcg-icon {
                    grid-area: icon;
                    display: block;
                }

                .content {
                    grid-area: content;
                }

                .usecase {
                    display: inline-block;
                    font-weight: bold;
                }
            }
        `
    }

    static get properties() {
        return {
            label: {},
            mdiIcon: {
                attribute: 'mdi-icon',
            },
        }
    }

    constructor() {
        super()

        this.label = t`Usecase`

        this.mdiIcon = mdiHelpCircle
    }

    render() {
        return html`
            <qrcg-icon mdi-icon=${this.mdiIcon}></qrcg-icon>
            <span class="usecase">${this.label}</span>
            <div class="content">
                <slot></slot>
            </div>
        `
    }
}

window.defineCustomElement('qrcg-form-comment', QRCGFormComment)
