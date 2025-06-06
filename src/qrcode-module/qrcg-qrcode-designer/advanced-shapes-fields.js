import { html } from 'lit'

import {
    isEmpty,
    isFunction,
    studlyCase,
    titleCase,
    url,
} from '../../core/helpers'

import { t } from '../../core/translate'

import { advancedShapes } from '../../models/advanced-shapes'

import { featureAllowed } from '../../core/subscription/logic'

import { defaultState } from '../state'

export class AdvancedShapeFields {
    constructor(host) {
        this.host = host

        host.addController(this)
    }

    hostConnected() {
        this.host.addEventListener(
            'advancedShapeChanged',
            this.onAdvancedShapeChanged
        )
    }

    hostDisconnected() {
        this.host.removeEventListener(
            'advancedShapeChanged',
            this.onAdvancedShapeChanged
        )

        this.host = null
    }

    onAdvancedShapeChanged = (event) => {
        const {
            detail: { originalEvent: e },
        } = event

        const shape = e.detail.value

        if (shape === 'healthcare') {
            this.onHealthcareAdvancedShapeSelected()
        } else {
            this.onHealtcareAdvancedShapeNotSelected()
        }
    }

    onHealthcareAdvancedShapeSelected() {
        setTimeout(() => {
            this.host.updateDesignObject({
                ...this.host.design,
                textBackgroundColor: '#fff',
                textColor: '#000',
            })
        }, 50)
    }

    onHealtcareAdvancedShapeNotSelected() {
        setTimeout(() => {
            this.host.updateDesignObject({
                ...this.host.design,
                textBackgroundColor: defaultState.design.textBackgroundColor,
                textColor: defaultState.design.textColor,
            })
        }, 50)
    }

    advancedShapeIsEnabled(shape) {
        if (this.host.constructor.advancedShapeValidator)
            return this.host.constructor.advancedShapeValidator(shape)
        return featureAllowed(`advancedShape.${shape.value}`)
    }

    renderAdvancedShapeFields() {
        const functionName = `render${studlyCase(
            this.host.design.advancedShape
        )}AdvancedShapeFields`

        if (isFunction(this[functionName])) {
            return this[functionName]()
        }
    }

    renderHealthcareAdvancedShapeFields() {
        return html`
            <label>${t`Frame Color`}</label>
            <qrcg-color-picker name="healthcareFrameColor"></qrcg-color-picker>

            <label>${t`Heart Color`}</label>
            <qrcg-color-picker name="healthcareHeartColor"></qrcg-color-picker>
        `
    }

    renderReviewCollectorAdvancedShapeFields() {
        return html`
            <label> ${t`Circle Color`} </label>
            <qrcg-color-picker name="reviewCollectorCircleColor">
            </qrcg-color-picker>

            <label>${t`Stars Color`}</label>
            <qrcg-color-picker
                name="reviewCollectorStarsColor"
            ></qrcg-color-picker>

            <label> ${t`Select Logo`}</label>

            <qrcg-img-selector
                name="reviewCollectorLogoSrc"
                value="airbnb"
                .options=${'airbnb,ebay,linkedin,tripadvisor,yelp,aliexpress,facebook,pinterest,trustpilot,yemeksepeti,amazon,foursquare,skype,twitch,youtube,appstore,google-maps,snapchat,twitter,zoom,bitcoin,google,telegram,wechat,booking,googleplay,tiktok,whatsapp,discord,instagram,trendyol,yellowpages'
                    .split(',')
                    .map((value) => {
                        return {
                            value,
                            src: `${value}.png`,
                        }
                    })}
                base="${url('assets/images/review-collector-logos')}"
            ></qrcg-img-selector>

            <label> ${t`Or Upload Your Own`} </label>

            <qrcg-file-input
                upload-endpoint="qrcodes/${this.host.remoteRecord
                    ?.id}/upload-design-file"
                accept=".png,.jpg,.jpeg"
                name="reviewCollectorLogo"
            ></qrcg-file-input>
        `
    }

    renderRectFrameTextBottomAdvancedShapeFields() {
        return this.renderRectFrameTextTopAdvancedShapeFields()
    }

    renderRectFrameTextTopAdvancedShapeFields() {
        return html`
            <label>${t`Drop shadow`}</label>

            <qrcg-checkbox name="advancedShapeDropShadow">
                ${this.host.design.advancedShapeDropShadow
                    ? t`Enabled`
                    : t`Disabled`}
            </qrcg-checkbox>
        `
    }

    renderCouponAdvancedShapeFields() {
        return html`
            <label>${t`Left color`}</label>

            <qrcg-color-picker name="couponLeftColor"></qrcg-color-picker>

            <label>${t`Right color`}</label>

            <qrcg-color-picker name="couponRightColor"></qrcg-color-picker>
        `
    }

    renderFourCornersTextBottomAdvancedShapeFields() {
        return this.renderFourCornersTextTopAdvancedShapeFields()
    }

    renderFourCornersTextTopAdvancedShapeFields() {
        return html`
            <label>${t`Frame color`}</label>

            <qrcg-color-picker
                name="advancedShapeFrameColor"
            ></qrcg-color-picker>
        `
    }

    renderTextInputsForField(field = '') {
        const name = isEmpty(field) ? t`Text` : t(titleCase(field))

        return html`
            <label>${name}</label>
            <qrcg-sticker-text-input
                name=${field}
                .designData=${this.host.design}
                ?show-text-background-color-input=${this.host.design
                    .advancedShape != 'coupon'}
            ></qrcg-sticker-text-input>
        `
    }

    renderTextInputs() {
        const noTextStickers = [
            'review-collector',
            'pincode-protected',
            'qrcode-details',
        ]

        if (noTextStickers.find((id) => id == this.host.design.advancedShape))
            return

        if (this.host.design.advancedShape === 'coupon') {
            return html`
                ${this.renderTextInputsForField('coupon_text_line_1')}
                ${this.renderTextInputsForField('coupon_text_line_2')}
                ${this.renderTextInputsForField('coupon_text_line_3')}
            `
        }

        return this.renderTextInputsForField('')
    }

    renderFields() {
        const sticker = this.host.design.advancedShape

        if (!sticker || sticker == 'none') return

        return html`
            <!-- -->
            ${this.renderAdvancedShapeFields()}
            <!-- -->
            ${this.renderTextInputs()}
        `
    }

    render() {
        return html`
            <label>${t`Sticker`}</label>
            <qrcg-img-selector
                name="advancedShape"
                .options=${advancedShapes.map((shape) => ({
                    value: shape.value,
                    src: `${shape.value}.png`,
                    title: shape.name,
                    disabled: !this.advancedShapeIsEnabled(shape),
                }))}
                narrow-padding
                base="${url('assets/images/advanced-shapes')}"
            ></qrcg-img-selector>

            ${this.renderFields()}
        `
    }
}
