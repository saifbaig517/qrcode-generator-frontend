import { css } from 'lit'

import { QrcgBaseChart } from './base-chart'

export class QrcgChartHorizontalBarChart extends QrcgBaseChart {
    static styles = [super.styles, css``]

    static get properties() {
        return {
            ...super.properties,
        }
    }

    type() {
        return 'bar'
    }

    dataSet() {
        return {
            data: this.data.map((r) => r.number),
            backgroundColor: this.transparentizeColors(0.5),
            borderColor: this.colors(),
            hoverBackgroundColor: this.colors(),
            maxBarThickness: 55,
        }
    }

    options() {
        return {
            indexAxis: 'y',
            elements: {
                bar: {
                    borderWidth: 2,
                },
            },

            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        stepSize: 1,
                    },
                },
                y: {
                    grid: {
                        display: false,
                    },
                },
            },
        }
    }
}

window.defineCustomElement(
    'qrcg-chart-horizontal-bar-chart',
    QrcgChartHorizontalBarChart
)
