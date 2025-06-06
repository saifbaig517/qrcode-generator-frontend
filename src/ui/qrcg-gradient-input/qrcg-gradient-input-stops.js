import { mdiPlusThick } from '@mdi/js'

import { LitElement, html, css } from 'lit'

import { rgbToHex } from '../../core/helpers'

import { repeat } from 'lit/directives/repeat.js'

import './qrcg-gradient-input-handle'

export class QrcgGradientInputStops extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                box-sizing: border-box;
                padding-bottom: 2rem;
                position: relative;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            }

            :host([can-add-color]) {
                cursor: pointer;
            }

            .preview-container {
                position: relative;
                display: flex;
            }

            .preview-image {
                height: 3rem;
                width: 100%;
                pointer-events: none;
            }

            .add-icon {
                position: absolute;
                bottom: 0;
                z-index: 2;
                color: white;
                background-color: black;
                border-radius: 50%;
                padding: 0.25rem;
                transition: opacity 0.5s ease;
                opacity: 0;
                transform: translateX(-50%);
                width: 1rem;
                height: 1rem;
            }
            :host([can-add-color]) .add-icon {
                opacity: 1;
            }

            @media (hover: none) and (pointer: coarse) {
                .add-icon {
                    display: none;
                }
            }
        `,
    ]

    static get properties() {
        return {
            colors: { type: Array },
            canAddColor: {
                type: Boolean,
                reflect: true,
                attribute: 'can-add-color',
            },
        }
    }

    constructor() {
        super()
        this.colors = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
        this.addEventListener('mousedown', this.onMouseDown)
        this.addEventListener('mouseup', this.onMouseUp)
        this.addEventListener('mousemove', this.onMouseMove)
        this.addEventListener('mouseleave', this.onMouseLeave)

        this.addEventListener(
            'qrcg-gradient-input-handle:on-input',
            this.onHandleInput
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
        this.removeEventListener('mousedown', this.onMouseDown)
        this.removeEventListener('mouseup', this.onMouseUp)
        this.removeEventListener('mousemove', this.onMouseMove)
        this.removeEventListener('mouseleave', this.onMouseLeave)
        this.removeEventListener(
            'qrcg-gradient-input-handle:on-input',
            this.onHandleInput
        )
    }

    onHandleInput(e) {
        const color = e.detail.color

        this.fireShouldUpdateColors(
            this.colors.map((c) => {
                if (c.id === color.id) {
                    return {
                        ...c,
                        stop: color.stop,
                    }
                }

                return c
            })
        )
    }

    onClick(e) {
        if (this.canAddColor) {
            this.addColorAtPosition(e.clientX)
        }
    }

    onMouseUp() {}

    onMouseDown() {}

    onMouseMove(e) {
        this.syncAddIconPosition(e)
    }

    onMouseLeave() {
        this.canAddColor = false
    }

    addColorAtPosition(x) {
        const percent = this.positionToPercent(x)

        if (percent < 0 || percent > 100) return

        const lastHandle = this.handles.reduce((lastHandle, handle) => {
            if (+lastHandle.value < +handle.value) {
                return handle
            }

            return lastHandle
        }, this.handles[0])

        const firstHandle = this.handles.reduce((firstHandle, handle) => {
            if (+firstHandle.value > +handle.value) {
                return handle
            }
            return firstHandle
        }, this.handles[0])

        let closestNext = lastHandle

        let closestPrev = firstHandle

        for (const handle of this.handles) {
            const value = +handle.value
            if (value > percent) {
                if (value - percent < closestNext.value - percent) {
                    closestNext = handle
                }
            }

            if (value < percent) {
                if (percent - value < percent - closestPrev.value) {
                    closestPrev = handle
                }
            }
        }

        const newColor = rgbToHex({
            r: 155,
            g: 155,
            b: 155,
        })

        const colors = [...this.colors]

        colors.push({
            color: newColor,
            stop: percent,
            opacity: 1,
        })

        this.fireShouldUpdateColors(colors)
    }

    syncAddIconPosition(e) {
        const x = e.clientX

        const elemLeft = this.getBoundingClientRect().left

        this.addIcon.style.left = `${x - elemLeft}px`

        const percent = this.positionToPercent(x)

        const isCloseToAnyHandle = this.handles.find(
            (h) => Math.abs(h.value - percent) < 5
        )

        if (!isCloseToAnyHandle) {
            this.canAddColor = true
        } else {
            this.canAddColor = false
        }
    }

    positionToPercent(x, debug = false) {
        const elemLeft = this.getBoundingClientRect().left

        const elemWidth = this.getBoundingClientRect().width

        const percent = Math.round((100 * (x - elemLeft)) / elemWidth)

        if (debug)
            console.log({
                x,
                elemLeft,
                elemWidth,
                percent,
            })

        return percent
    }

    get handles() {
        return Array.from(
            this.shadowRoot.querySelectorAll('qrcg-gradient-input-handle')
        )
    }

    get addIcon() {
        return this.shadowRoot.querySelector('.add-icon')
    }

    fireShouldUpdateColors(colors) {
        this.dispatchEvent(
            new CustomEvent('should-update-colors', {
                detail: {
                    colors,
                },
            })
        )
    }

    static sortColors(colors) {
        const sorted = [...colors]

        sorted.sort((c1, c2) => {
            return c1.stop - c2.stop
        })

        return sorted
    }

    get sortedColors() {
        return this.constructor.sortColors(this.colors)
    }

    generateSvgGradient() {
        return `
            <linearGradient id="gradient">
                ${this.sortedColors.map(
                    (color) =>
                        `<stop
                            stop-color="${color.color}"
                            offset="${color.stop}%"
                            stop-opacity="${color.opacity}"
                        ></stop>`
                )}
            </linearGradient>
        `
    }

    onRequestRemove(e) {
        const color = e.target.color

        this.fireShouldUpdateColors(
            this.colors.map((c) => JSON.stringify(c) != JSON.stringify(color))
        )
    }

    render() {
        const svg = `<svg viewBox="0 0 500 200" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <defs>${this.generateSvgGradient()}</defs>
                <rect
                    style="fill:url(#gradient);"
                    x="0"
                    y="0"
                    width="500"
                    height="200"
                />
            </svg>
        `

        return html`
            <div class="preview-container">
                ${repeat(
                    this.colors,
                    (c) => c.id,
                    (color) => html`<qrcg-gradient-input-handle
                        .color=${color}
                        @request-remove=${this.onRequestRemove}
                    ></qrcg-gradient-input-handle>`
                )}

                <img
                    class="preview-image"
                    src=${'data:image/svg+xml;base64,' + btoa(svg)}
                />
            </div>
            <qrcg-icon mdi-icon=${mdiPlusThick} class="add-icon"></qrcg-icon>
        `
    }
}
window.defineCustomElement('qrcg-gradient-input-stops', QrcgGradientInputStops)
