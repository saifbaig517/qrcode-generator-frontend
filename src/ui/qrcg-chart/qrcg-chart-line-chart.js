import { css } from 'lit'

import { QrcgBaseChart } from './base-chart'

export class QrcgChartLineChart extends QrcgBaseChart {
    static styles = [super.styles, css``]

    static get properties() {
        return {
            ...super.properties,
        }
    }

    type() {
        return 'line'
    }

    dataSet() {
        return {
            data: this.data.map((r) => r.number),
            borderColor: this.primaryColor(),
            backgroundColor: this.primary1Color(),
            borderWidth: 2,
            cubicInterpolationMode: 'monotone',
            tension: 0.5,
            pointStyle: 'circle',
            pointRadius: 4,
            pointHoverRadius: 8,
        }
    }

    scales() {
        return {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false,
                },
                ticks: {
                    stepSize: 1,
                },
            },
        }
    }
}

window.defineCustomElement('qrcg-chart-line-chart', QrcgChartLineChart)
