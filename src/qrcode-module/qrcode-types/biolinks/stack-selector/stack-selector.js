import { html } from 'lit'
import style from './stack-selector.scss?inline'
import { BaseComponent } from '../../../../core/base-component/base-component'
import { WebpageDesigner } from '../../webpage-designer'
import { isEmpty } from '../../../../core/helpers'
import { t } from '../../../../core/translate'

export class StackSelector extends BaseComponent {
    static tag = 'qrcg-stack-selector'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            name: {},
            value: {},
        }
    }

    getStackOptions() {
        let options = [
            {
                name: t`No Stack`,
                value: '*',
            },
        ]

        options = options.concat(
            WebpageDesigner.data.design.stack_data.map((item) => {
                return {
                    name: item.title,
                    value: item.id,
                }
            })
        )

        return options
    }

    updated(changed) {
        if (changed.has('value')) {
            this.$('[name=stack]').value = this.value
        }
    }

    render() {
        if (isEmpty(WebpageDesigner.data.design.stack_data)) {
            return
        }

        return html`
            <qrcg-balloon-selector
                name="stack"
                .options=${this.getStackOptions()}
            >
                ${t`Stack`}
            </qrcg-balloon-selector>
        `
    }
}

StackSelector.register()
