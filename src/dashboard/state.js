import { LitState } from 'lit-element-state'

class DashboardState extends LitState {
    static get stateVars() {
        return {
            sidebarClosed: false,
        }
    }
}

export const state = new DashboardState()
