import { LitState } from 'lit-element-state'
import { t } from '../core/translate'
import { StepsManager } from './qrcg-steps-manager'

const black = '#000000'

const white = '#ffffff'

const primaryColor = '#1c57cb'

const stepsManager = new StepsManager()

export const defaultState = {
    id: null,
    name: '',
    data: {
        url: '',
    },
    type: 'url',
    currentStep: stepsManager.getFirstStepSlug(),
    design: {
        fillType: 'solid',
        module: 'square',
        gradientType: 'RADIAL',
        eyeExternalColor: black,
        eyeInternalColor: black,
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
        ai_strength: 1.8,
        ai_steps: 18,
    },
    remoteRecord: null,
    loading: false,
}

class QRCodeModuleState extends LitState {
    static get stateVars() {
        return defaultState
    }
}

export const state = new QRCodeModuleState()
