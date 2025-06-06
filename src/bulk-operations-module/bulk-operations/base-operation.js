import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

import { t } from '../../core/translate'
import { get } from '../../core/api'
import { isEmpty, parentMatches } from '../../core/helpers'
import { mdiSquareEditOutline } from '@mdi/js'
import { QrcgBulkOperationInstanceNameModal } from '../qrcg-bulk-operation-instance-name-modal'

export class BaseOperation extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .instance {
                background-color: var(--gray-0);
                padding: 0.5rem 1rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
            }

            @media (max-width: 900px) {
                .instance {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .instance > * {
                    margin: 0.5rem 0;
                }
            }

            .instance-id {
                background-color: var(--gray-1);
                font-size: 0.8rem;
                padding: 0.1rem;
                margin-right: 1rem;
            }

            .instance-date {
                width: 10rem;
                font-size: 0.8rem;
            }

            .instance-name {
                display: flex;
                align-items: center;
            }

            .edit-instance-name-icon {
                margin-left: 1rem;
                padding: 0.25rem;
                cursor: pointer;
            }

            .instance-progress {
                margin-right: 1rem;
                font-size: 0.8rem;
            }

            .push {
                flex: 1;
            }

            .badge {
                background-color: var(--gray-1);
                font-size: 0.8rem;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
            }

            .badge.warning {
                background-color: var(--warning-0);
                color: black;
            }

            .badge.success {
                background-color: var(--success-0);
                color: white;
            }

            .instance-status {
                margin-right: 1rem;
            }

            .no-instances-message {
                padding: 1rem;
                text-align: center;
                background-color: var(--gray-0);
                color: var(--gray-2);
            }

            .instances-section .section-title {
                position: relative;
            }

            .instances-loading-container {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 1;
                transform: scale(0.5);
                top: -1rem;
            }

            .instances-container {
                position: relative;
                user-select: none;
                -webkit-user-select: none;
            }

            .instance-actions {
                display: flex;
                align-items: center;
                margin-left: 1rem;
            }

            .instance-actions .action {
                cursor: pointer;
                color: var(--primary-0);
                font-size: 0.6rem;
                padding: 0.25rem;
                font-weight: bold;
            }

            .instructions {
                padding: 1rem;
                background-color: var(--gray-0);
                margin-bottom: 1rem;
                line-height: 1.7;
            }

            .instructions a {
                color: var(--primary-0);
            }

            .variables-container {
                margin: 1rem 0;
                font-size: 0.8rem;
                padding: 0.5rem;
                background-color: white;
            }

            .var-container {
                display: flex;
            }

            .var-name {
                margin-right: 1rem;
                font-weight: bold;
            }
        `,
    ]

    static get properties() {
        return {
            data: {},
            mode: {},
            instances: {
                type: Array,
            },
            instancesLoading: {
                type: Boolean,
            },
        }
    }

    static tag() {
        return `qrcg-${this.type()}`
    }

    static type() {
        throw new Error('Must be defined in child')
    }

    static name() {
        throw new Error('Must be defined in child')
    }

    constructor() {
        super()

        this.data = {}

        this.mode = 'form'

        this.instances = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        document.addEventListener(
            this.onInstanceCreatedEventName(),
            this.onInstanceCreated
        )

        this.addEventListener('click', this.onClick)

        this.bindRealTimeInstanceUpdates()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)

        document.removeEventListener(
            this.onInstanceCreatedEventName(),
            this.onInstanceCreated
        )

        this.removeEventListener('click', this.onClick)

        this.disconnectRealTimeInstanceUpdates()
    }

    // #region Events

    updated(changed) {
        if (changed.has('mode') && this.mode === 'instances') {
            this.fetchInstances()
        }
    }

    onClick = (e) => {
        const elem = e.composedPath()[0]

        const action = parentMatches(elem, '.action')

        if (action) {
            this.onActionClick(
                action.getAttribute('action-id'),
                action.instance
            )
        }

        const editIcon = parentMatches(elem, '.edit-instance-name-icon')

        if (editIcon) {
            return this.onEditInstanceNameClick(editIcon)
        }
    }

    async onEditInstanceNameClick(icon) {
        const { operationInstance } = icon

        await QrcgBulkOperationInstanceNameModal.open({
            operationInstance,
        })

        this.fetchInstances()
    }

    // eslint-disable-next-line
    onActionClick(actionId, instance) {}

    onInput = (e) => {
        if (e.detail.name === this.operationCreationFileInputName()) {
            this.fireOnInstanceCreatedEvent()
        }
    }

    onInstanceCreated = () => {
        this.fetchInstances()
    }

    fireOnInstanceCreatedEvent() {
        document.dispatchEvent(
            new CustomEvent(this.onInstanceCreatedEventName())
        )
    }

    bindRealTimeInstanceUpdates() {
        this.__instanceUpdatesInterval = setInterval(() => {
            this.fetchInstances()
        }, 2000)
    }

    disconnectRealTimeInstanceUpdates() {
        clearTimeout(this.__instanceUpdatesInterval)
    }

    // #endregion

    // #region Network Communication

    async fetchInstances() {
        this.instancesLoading = true

        try {
            const { response } = await get(this.instancesRoute())

            this.instances = await response.json()
        } catch {
            ///
        }

        this.instancesLoading = false
    }

    async fetchInstanceResults(instance) {
        const { response } = await get(
            'bulk-operations/instance-results/' + instance.id
        )

        return await response.json()
    }

    // #endregion

    // #region Overridable Property Methods

    onInstanceCreatedEventName() {
        return `${this.constructor.tag()}:instance-created`
    }

    createRoute() {
        return `bulk-operations/${this.constructor.type()}/create`
    }

    instancesRoute() {
        return `bulk-operations/${this.constructor.type()}/instances`
    }

    operationCreationFileInputName() {
        return 'operation_creation_input'
    }

    getVariables() {
        return {}
    }

    hasVariables() {
        return Object.keys(this.getVariables()).length > 0
    }

    // #endregion

    // #region Helpers

    time(date) {
        return new Date(date).toLocaleString()
    }

    // #endregion

    // #region Renderers

    renderFormFields() {}

    renderInstructions() {}

    renderVariablesInstructionsMessage() {
        throw new Error(
            'You must define renderVariablesInstructionsMessage in child operation'
        )
    }

    renderVariablesInstructions() {
        if (!this.hasVariables()) return

        return html`
            <div class="variables-container">
                ${this.renderVariablesInstructionsMessage()}
                ${this.renderVariables()}
            </div>
        `
    }

    renderVariables() {
        return Object.keys(this.getVariables()).map(
            (key) => html`
                <div class="var-container">
                    <div class="var-name">${key}</div>
                    <div class="var-description">
                        ${this.getVariables()[key]}
                    </div>
                </div>
            `
        )
    }

    renderForm() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Create New`}</h2>

                ${this.renderInstructions()}

                <!-- -->

                ${this.renderFormFields()}
            </qrcg-form-section>
        `
    }

    renderInstancesSection() {
        return html`
            <qrcg-form-section class="instances-section">
                <h2 class="section-title">${t`Instances`}</h2>

                <div class="instances-container">
                    <!-- -->
                    ${this.renderInstances()}
                </div>
            </qrcg-form-section>
        `
    }

    renderInstance(instance) {
        const badgeClasses = classMap({
            warning: instance.status === 'running',
            success: instance.status === 'completed',
        })

        return html`
            <div class="instance">
                <div class="instance-id badge">${instance.id}</div>

                <div class="instance-name">
                    ${instance.name}

                    <qrcg-icon
                        mdi-icon=${mdiSquareEditOutline}
                        class="edit-instance-name-icon"
                        .operationInstance=${instance}
                    ></qrcg-icon>
                </div>

                <div class="push"></div>

                <div class="instance-progress">${instance.progress}</div>

                <div class="instance-status badge ${badgeClasses}">
                    ${instance.status}
                </div>

                <div class="instance-date">
                    ${this.time(instance.created_at)}
                </div>

                <div class="instance-actions">
                    ${this.renderActions(instance)}
                </div>
            </div>
        `
    }

    // eslint-disable-next-line
    renderActions(instance) {}

    renderInstances() {
        if (isEmpty(this.instances)) {
            return html`
                <div class="no-instances-message">
                    ${t`There is no running instances of this operation`}
                </div>
            `
        }

        return html`
            ${this.instances.map((instance) => this.renderInstance(instance))}
        `
    }

    render() {
        if (this.mode === 'form') {
            return html` ${this.renderForm()} `
        }

        if (this.mode === 'instances') {
            return html`
                <!-- -->
                ${this.renderInstancesSection()}
            `
        }
    }

    // #endregion
}
