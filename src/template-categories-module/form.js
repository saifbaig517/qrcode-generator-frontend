import { html } from 'lit'
import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import style from './form.scss?inline'

export class TemplateCategoryForm extends QrcgDashboardForm {
    static tag = 'qrcg-template-category-form'

    static styleSheets = [...super.styleSheets, style]

    constructor() {
        super({
            apiBaseRoute: 'template-categories',
            bindEvents: true,
        })
    }

    renderFormFields() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Record Details`}</h2>

                <qrcg-input name="name" placeholder="${t`Enter name`}">
                    ${t`Name`}
                </qrcg-input>

                <qrcg-color-picker name="text_color">
                    ${t`Color`}
                </qrcg-color-picker>

                <qrcg-file-input name="image_id"> ${t`Image`} </qrcg-file-input>

                <qrcg-input
                    name="sort_order"
                    type="number"
                    step="1"
                    placeholder=${t`Enter sort order`}
                >
                    ${t`Sort Order`}
                </qrcg-input>
            </qrcg-form-section>
        `
    }
}

TemplateCategoryForm.register()
