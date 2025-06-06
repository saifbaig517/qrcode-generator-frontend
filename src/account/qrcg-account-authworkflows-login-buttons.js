import { html } from 'lit'

import { BaseComponent } from '../core/base-component/base-component'
import { AbstractAuthWorkflow } from '../auth-workflow/workflows/abstract-auth-workflow'
import { AuthManager } from '../auth-workflow/auth-manager'

export class QrcgAccountAuthworkflowsLoginButtons extends BaseComponent {
    static tag = 'qrcg-account-authworkflows-login-buttons'

    render() {
        return AuthManager.instance().renderButtons(
            AbstractAuthWorkflow.CONTEXT_SIGNIN
        )
    }
}

QrcgAccountAuthworkflowsLoginButtons.register()
