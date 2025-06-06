import { LitElement, html, css } from 'lit'
import { remToPx } from '../../core/helpers'

const appearanceNone = css`
    -webkit-appearance: none;
    appearance: none;
`

const trackStyle = css`
    width: 100%;
    height: 100%;
    background-color: transparent;
    pointer-events: none;
`

const thumbStyle = css`
    width: 0.8rem;
    height: 130%;

    border-radius: 1rem;
    background: black;

    pointer-events: auto;
    cursor: pointer;
    margin-top: -0.65rem;

    border: 0.1rem white solid;
    box-sizing: border-box;
    pointer-events: auto;
`

const activeThumb = css`
    background: white;
    border: 0.1rem black solid;
`

export class QrcgGradientInputHandle extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                z-index: 1;
                pointer-events: none;
            }

            :host([active]) {
                z-index: 2;
            }

            :host([mouseDown]) [type='range']::-webkit-slider-thumb {
                cursor: move;
            }

            [type='range'] {
                ${appearanceNone}
                width: 100%;
                height: 100%;
                background-color: transparent;
                pointer-events: none;
            }

            [type='range']::-webkit-slider-runnable-track,
            [type='range']::-webkit-slider-thumb {
                ${appearanceNone}
            }

            [type='range']::-webkit-slider-thumb {
                ${thumbStyle}
            }

            [type='range']::-webkit-slider-runnable-track {
                ${trackStyle};
            }

            [type='range']::-moz-range-thumb,
            [type='range']::-moz-range-track {
                ${appearanceNone}
            }
            [type='range']::-moz-range-thumb {
                ${thumbStyle};
            }
            [type='range']::-moz-range-track {
                ${trackStyle}
            }

            [type='range']::-ms-track,
            [type='range']::-ms-thumb {
                ${appearanceNone}
            }
            [type='range']::-ms-track {
                ${trackStyle}
            }
            [type='range']::-ms-thumb {
                ${thumbStyle}
            }

            [type='range']:focus::-webkit-slider-thumb {
                ${activeThumb}
            }

            [type='range']:focus::-moz-range-thumb {
                ${activeThumb};
            }
        `,
    ]

    static get properties() {
        return {
            color: {},
            mouseDown: { type: Boolean },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('touchstart', this.onMouseDown)
        this.addEventListener('touchmove', this.onMouseMove)
        this.addEventListener('touchend', this.onMouseUp)

        this.addEventListener('mousedown', this.onMouseDown)
        this.addEventListener('mouseup', this.onMouseUp)
        this.addEventListener('mousemove', this.onMouseMove)
        this.addEventListener('input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('touchstart', this.onMouseDown)
        this.removeEventListener('touchmove', this.onMouseMove)
        this.removeEventListener('touchend', this.onMouseUp)

        this.removeEventListener('mousedown', this.onMouseDown)
        this.removeEventListener('mouseup', this.onMouseUp)
        this.removeEventListener('mousemove', this.onMouseMove)

        this.removeEventListener('input', this.onInput)
    }

    onInput(e) {
        e.stopImmediatePropagation()

        this.dispatchEvent(
            new CustomEvent('qrcg-gradient-input-handle:on-input', {
                composed: true,
                bubbles: true,
                detail: {
                    color: {
                        ...this.color,
                        stop: this.input.value,
                    },
                },
            })
        )
    }

    get value() {
        return this.color.stop
    }

    onMouseDown() {
        this.mouseDown = true

        this.dispatchEvent(
            new CustomEvent('qrcg-gradient-input:request-color-focus', {
                detail: {
                    color: this.color,
                },
                bubbles: true,
                composed: true,
            })
        )
    }

    onMouseUp() {
        this.mouseDown = false
    }

    onMouseMove(e) {
        if (!this.mouseDown) return

        const r = this.getBoundingClientRect()

        const y = r.top + (r.bottom - r.top) / 2

        const x = r.left + (r.width * this.input.value) / 100

        const ex = e.clientX || e.touches[0].clientX

        const ey = e.clientY || e.touches[0].clientY

        const threshold = remToPx(4)

        if (Math.abs(ex - x) > threshold || Math.abs(ey - y) > threshold) {
            this.dispatchEvent(
                new CustomEvent('qrcg-gradient-input:request-remove-color', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        color: this.color,
                    },
                })
            )
        }
    }

    updated(changed) {
        if (changed.has('color')) {
            this.input.value = this.color.stop
        }
    }

    get input() {
        return this.shadowRoot.querySelector('input')
    }

    render() {
        return html`
            <input name="stop" type="range" min="0" max="100" step="1" />
        `
    }
}
window.defineCustomElement(
    'qrcg-gradient-input-handle',
    QrcgGradientInputHandle
)
