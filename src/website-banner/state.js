import { LitState } from 'lit-element-state'

import { QRCGColorPicker } from '../ui/qrcg-color-picker'

import { t } from '../core/translate'
import { qrTypes } from '../models/qr-types'

const black = '#000000'

const white = '#ffffff'

const primaryColor = '#1c57cb'

class BannerState extends LitState {
    static get stateVars() {
        return {
            data: {},
            type: qrTypes[0].id,
            design: {
                fillType: 'solid',
                module: 'square',
                gradientType: 'RADIAL',
                eyeExternalColor: black,
                eyeInternalColor: black,
                gradientStartColor: QRCGColorPicker.presetColors[1],
                gradientEndColor: QRCGColorPicker.presetColors[0],
                eyeColor: black,
                foregroundColor: black,
                frame: 'none',
                logoScale: 0.2,
                logoPositionX: 0.5,
                logoPositionY: 0.5,
                logoRotate: 0,
                logoBackground: true,
                logoBackgroundFill: '#fff',
                logoUrl: '',
                logoType: 'preset',
                logoBackgroundScale: 1.3,
                logoBackgroundShape: 'circle',
                backgroundEnabled: true,
                backgroundColor: white,
                finder: 'default',
                finderDot: 'default',
                advancedShape: 'none',
                advancedShapeDropShadow: true,
                advancedShapeFrameColor: black,
                fontFamily: 'Raleway',
                text: t('SCAN ME'),
                textColor: white,
                textBackgroundColor: primaryColor,
                textSize: 1,
            },
        }
    }
}

export const state = new BannerState()
