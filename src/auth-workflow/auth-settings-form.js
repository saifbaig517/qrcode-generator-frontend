import { html } from 'lit'
import { QrcgSystemSettingsFormBase } from '../system-module/qrcg-system-settings-form/base'
import { AuthManager } from './auth-manager'
import { url } from '../core/helpers'

export class AuthSettingsForm extends QrcgSystemSettingsFormBase {
    authManager = AuthManager.instance()

    renderAuthInstructions(workflow) {
        return this.renderInstructionsWithCopyDetails(
            workflow.renderCallbackInstructions(),
            url(`/auth-workflow/${workflow.name()}/callback`)
        )
    }

    renderSections() {
        return this.authManager
            .getWorkflows()
            .map((workflow) => this.renderWorkflowForm(workflow))
    }

    renderWorkflowForm(workflow) {
        return html`
            <section>
                <h2 class="section-title">${workflow.title()}</h2>

                <div class="form-fields">
                    ${this.renderAuthInstructions(workflow)}
                    ${workflow.renderConfigs()}
                </div>
            </section>
        `
    }

    renderForm() {
        return this.renderSections()
    }
}

window.defineCustomElement('qrcg-auth-settings-form', AuthSettingsForm)
