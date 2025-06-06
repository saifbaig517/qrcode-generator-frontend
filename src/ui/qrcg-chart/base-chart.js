import { LitElement, html, css } from 'lit'

import { isEmpty } from '../../core/helpers'
import { QrcgWindowResizeController } from '../../core/qrcg-window-resize-controller'

import Color from '@kurkle/color'

export class QrcgBaseChart extends LitElement {
    resizeController = new QrcgWindowResizeController(this)

    static styles = [
        css`
            :host {
                display: block;
                position: relative;
                max-width: 100%;
            }

            .loader-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            :host([resizing]) {
                opacity: 0;
            }
        `,
    ]

    static get properties() {
        return {
            data: { type: Array },
            chartTitle: { attribute: 'chart-title' },
            resizing: {
                type: Boolean,
                reflect: true,
            },
        }
    }

    constructor() {
        super()

        this.data = [
            {
                label: '1/1/2000',
                number: 10,
            },
            {
                label: '2/1/2000',
                number: 20,
            },
            {
                label: '3/1/2000',
                number: 40,
            },
            {
                label: '4/1/2000',
                number: 10,
            },
        ]

        this.data = []
    }

    firstUpdated() {}

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('resize-start-x', this.onResizeStart)
        this.addEventListener('resize-end-x', this.onResizeEnd)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        if (this.chart) this.chart.destroy()

        this.removeEventListener('resize-start-x', this.onResizeStart)
        this.removeEventListener('resize-end-x', this.onResizeEnd)
    }

    onResizeStart = () => {
        this.resizing = true

        try {
            this.chart.destroy()
        } catch {
            //
        }
    }

    onResizeEnd = async () => {
        this.resizing = false

        try {
            await new Promise((resolve) => setTimeout(resolve, 350))

            this.initChart()
        } catch {
            //
        }
    }

    updated(changed) {
        if (changed.has('data')) {
            if (!isEmpty(this.data)) {
                if (this.chart) {
                    this.chart.destroy()
                }
                setTimeout(() => {
                    this.initChart()
                }, 1)
            }
        }
    }

    loadChartJsScript() {
        const promise = new Promise((resolve) => {
            const id = this.tagName.toLowerCase() + '-chartjs'

            let script = document.getElementById(id)

            script = document.createElement('script')

            script.src = '/assets/lib/chart.umd.js'

            script.onload = () => {
                resolve()
            }

            document.head.appendChild(script)
        })

        return promise
    }

    chartJsIsLoaded() {
        return typeof Chart != 'undefined'
    }

    dataSet() {
        throw new Error(
            'You must define dataSet function in child chart implementation'
        )
    }

    type() {
        throw new Error(
            'You must define type function in child chart implementation'
        )
    }

    primaryColor() {
        return getComputedStyle(document.documentElement).getPropertyValue(
            '--primary-0'
        )
    }

    primary1Color() {
        return getComputedStyle(document.documentElement).getPropertyValue(
            '--primary-1'
        )
    }

    getCssVar(name) {
        const value = getComputedStyle(
            document.documentElement
        ).getPropertyValue(name)

        return value
    }

    colors() {
        const colors = [
            this.primaryColor(),
            this.primary1Color(),
            this.getCssVar('--accent-1'),
            this.getCssVar('--warning-1'),
            this.getCssVar('--dark'),
        ].map((c) => c.trim())

        return Object.keys(this.data).map((_, i) => {
            return colors[i % colors.length]
        })
    }

    transparentize(value, opacity) {
        var alpha = opacity === undefined ? 0.5 : 1 - opacity

        return new Color(value).alpha(alpha).rgbString()
    }

    transparentizeColors(opacity) {
        return this.colors().map((c) => {
            return this.transparentize(c, opacity)
        })
    }

    downloadPng(fileName) {
        var a = document.createElement('a')
        a.href = this.chart.toBase64Image()
        a.download = fileName + '.png'

        // Trigger the download
        a.click()
    }

    async initChart() {
        if (typeof Chart == 'undefined') {
            await this.loadChartJsScript()
        }

        const ctx = this.renderRoot.getElementById('chart').getContext('2d')

        if (this.data == null) {
            console.error('Data is null')
            console.trace()
            return
        }

        // eslint-disable-next-line
        this.chart = new Chart(ctx, {
            type: this.type(),
            resopnsive: true,

            data: {
                labels: this.data.map((record) => record.label),
                datasets: [this.dataSet()],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    },
                },
                scales: this.scales(),
                ...this.options(),
            },
        })

        await this.updateComplete

        this.requestUpdate()
    }

    options() {
        return {}
    }

    scales() {
        return {}
    }

    renderLoader() {
        if (this.chartJsIsLoaded()) return null

        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    render() {
        return html`
            ${this.renderLoader()}
            <canvas id="chart"></canvas>
        `
    }
}
