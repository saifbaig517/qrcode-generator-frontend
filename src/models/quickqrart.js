import { isArray, isEmpty, ucfirst } from '../core/helpers'
import { Config } from '../core/qrcg-config'
import { t } from '../core/translate'

export class QuickQRArtModel {
    static get ALL_WORKFLOWS() {
        const toName = (short) =>
            short.replace(/(\d)(\w\w+)/, (_, $1, $2) => `${$1} ${ucfirst($2)}`)

        return [
            '1.1',
            '2',
            '3a',
            '3b',
            '4',
            '4s',
            '4real',
            '4niji',
            '4dream',
            '5',
            '5s',
        ].map((short) => ({
            name: t`Version ${toName(short)}`,
            value: short,
        }))
    }

    getConfigWorkflows() {
        const config = Config.get('quickqr_art.available_workflows')

        if (!isArray(config)) {
            return []
        }

        return config
    }

    getAvailableWorkflows() {
        if (isEmpty(this.getConfigWorkflows()))
            return QuickQRArtModel.ALL_WORKFLOWS

        return QuickQRArtModel.ALL_WORKFLOWS.filter((workflow) => {
            return this.getConfigWorkflows().find(
                (value) => workflow.value == value
            )
        })
    }
}
