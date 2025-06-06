import { ConfigHelper } from '../core/config-helper'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'

let firstStepSlug = ConfigHelper.isLocal() ? 'type' : 'type'

export class StepsManager {
    #steps = [
        {
            name: t('Type'),
            value: 'type',
        },
        {
            name: t('Data'),
            value: 'data',
        },
        {
            name: t('Design'),
            value: 'design',
        },
        { name: t('Download'), value: 'download' },
    ]

    getSteps() {
        if (this.shouldRenderTypeSelectionStep()) {
            return this.#steps
        }

        return this.#steps.filter((step) => step.value !== 'type')
    }

    isStepAvailable(slug) {
        return !isEmpty(this.getSteps().filter((step) => step.value == slug))
    }

    getStepsSlugs() {
        return this.getSteps().map((step) => step.value)
    }

    getSlugByIndex(index) {
        return this.getStepsSlugs()[index]
    }

    getFirstStepSlug() {
        if (!this.isStepAvailable(firstStepSlug)) {
            return this.getSlugByIndex(0)
        }

        return firstStepSlug
    }

    shouldRenderTypeSelectionStep() {
        return this.isQRCodeNew()
    }

    isQRCodeNew() {
        return window.location.pathname.match(/new/)
    }
}
