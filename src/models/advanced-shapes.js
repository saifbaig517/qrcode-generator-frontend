import { titleCase } from '../core/helpers'

export const advancedShapes = [
    'none',
    'rect-frame-text-top',
    'rect-frame-text-bottom',
    'simple-text-bottom',
    'simple-text-top',
    'four-corners-text-top',
    'four-corners-text-bottom',
    'coupon',
    'review-collector',
    'healthcare',
    'pincode-protected',
    'qrcode-details',
].map((value) => {
    return {
        name: titleCase(value),
        value,
    }
})
