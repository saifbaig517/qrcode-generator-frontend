import { mdiAccount } from '@mdi/js'
import { css, html } from 'lit'
import { t } from '../../../../core/translate'

import { LinkBlock } from './link-block'

// eslint-disable-next-line
import { vCardForm } from '../../../../type-forms/qrcg-vcard-form'
import { isEmpty, isNotEmpty } from '../../../../core/helpers'

export class VCardBlock extends LinkBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`vCard`
    }

    static slug() {
        return 'vcard'
    }

    static icon() {
        return mdiAccount
    }

    syncInputs() {
        super.syncInputs()

        this.syncFormData()
    }

    syncFormData() {
        if (!this.getForm()) return

        if (isEmpty(this.getForm().data)) {
            this.getForm().data = this.model.getData()
        }
    }

    getTabs() {
        return [
            {
                name: t`Data`,
                value: 'data',
            },
            {
                name: t`Appearance`,
                value: 'appearance',
            },
            {
                name: t`Image`,
                value: 'image',
            },
        ]
    }

    /**
     *
     * @returns {vCardForm}
     */
    getForm() {
        return this.$('qrcg-vcard-form')
    }

    renderDataTab() {
        const tab = this.model.field('tab')

        if (isNotEmpty(tab) && tab !== 'data') {
            return
        }

        return html` <qrcg-vcard-form multi-websites></qrcg-vcard-form> `
    }

    renderAppearanceTab() {
        if (this.model.field('tab') != 'appearance') {
            return
        }

        return super.renderEditForm()
    }

    renderImageTab() {
        if (this.model.field('tab') !== 'image') return

        return this.renderFileInput(
            'logo',
            t`Image`,
            t`Will be displayed in the contacts app. Should be small size. Recommended size 200x200`
        )
    }

    renderUrlInput() {}

    renderEditForm() {
        return html`
            <qrcg-balloon-selector .options=${this.getTabs()} name="tab">
            </qrcg-balloon-selector>

            ${this.renderAppearanceTab()}
            <!--  -->
            ${this.renderDataTab()}
            <!--  -->
            ${this.renderImageTab()}
        `
    }
}

VCardBlock.register()
