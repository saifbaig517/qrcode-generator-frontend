import { css } from 'lit'

import { QrcgBaseChart } from './base-chart'

export class QrcgChartDoughnutChart extends QrcgBaseChart {
    static styles = [super.styles, css``]

    static get properties() {
        return {
            ...super.properties,
        }
    }

    type() {
        return 'doughnut'
    }

    dataSet() {
        return {
            data: this.data.map((r) => r.number),
            backgroundColor: this.transparentizeColors(0.5),
            borderColor: this.colors(),
        }
    }
}

window.defineCustomElement('qrcg-chart-doughnut-chart', QrcgChartDoughnutChart)
