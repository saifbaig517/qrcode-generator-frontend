// eslint-disable-next-line
import { AbstractAuthWorkflow } from './workflows/abstract-auth-workflow'
import { FacebookAuthWorkflow } from './workflows/facebook-auth-workflow'

import { GoogleAuthWorkflow } from './workflows/google-auth-workflow'
import { TwitterAuthWorkflow } from './workflows/twitter-auth-workflow'

export class AuthManager {
    /**
     * @type {[AuthWorkflow]}
     */
    #registeredAuths = []

    /**
     * @type {AuthManager}
     */
    static #singleton

    static instance() {
        if (!this.#singleton) {
            this.#singleton = new this()
        }

        return this.#singleton
    }

    registerAuthWorkflow(Workflow) {
        this.#registeredAuths.push(Workflow)
    }

    /**
     *
     * @returns {[AbstractAuthWorkflow]}
     */
    getWorkflows() {
        return this.#registeredAuths.map((Workflow) => new Workflow())
    }

    getEnabledWorkflows() {
        return this.getWorkflows().filter((workflow) =>
            this.isEnabled(workflow)
        )
    }

    isEnabled(workflow) {
        return this.enabledWorkflowsArray().indexOf(workflow.name()) > -1
    }

    enabledWorkflowsArray() {
        return window.QRCG_ENABLED_WORKFLOWS ?? []
    }

    renderButtons(context) {
        return this.getEnabledWorkflows().map((workflow) => {
            return workflow.renderButton(context)
        })
    }

    hasButtons() {
        return this.getEnabledWorkflows().length > 0
    }
}

AuthManager.instance().registerAuthWorkflow(GoogleAuthWorkflow)
AuthManager.instance().registerAuthWorkflow(TwitterAuthWorkflow)
AuthManager.instance().registerAuthWorkflow(FacebookAuthWorkflow)
