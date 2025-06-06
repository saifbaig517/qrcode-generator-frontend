import { html } from 'lit'
import style from './demo-license-explainer.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { ConfigHelper } from '../../core/config-helper'

export class DemoLicenseExplainer extends BaseComponent {
    static tag = 'qrcg-demo-license-explainer'

    static styleSheets = [...super.styleSheets, style]

    render() {
        if (!ConfigHelper.isDemo()) return

        return html`
            <div class="container">
                <div>
                    Many features are exclusive to the
                    <strong>Extended License</strong>.
                </div>

                <qrcg-button
                    href="https://quickcode.digital/pricing"
                    target="_blank"
                >
                    See Differences
                </qrcg-button>
            </div>
        `
    }
}

DemoLicenseExplainer.register()
