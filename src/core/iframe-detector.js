import { LitElement, html, css } from 'lit'
import { styled } from './helpers'
import { Config } from './qrcg-config'
import { ConfigHelper } from './config-helper'

export class IframeDetector extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .content {
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                background-color: rgba(0, 0, 0, 0.8);
                align-items: center;
                justify-content: center;
            }

            a {
                font-size: 2rem;
                color: white;
                text-decoration: none;
                font-weight: bold;
                text-align: center;
                line-height: 1.7;
            }
        `,
    ]

    constructor() {
        super()

        if (ConfigHelper.isLocal()) return

        if (!window.parent) return

        if (window.parent === window) {
            return
        }

        try {
            if (window.parent.location.hostname == window.location.hostname) {
                return
            }

            if (window.location.hostname.match(/localhost/)) {
                return
            }
        } catch {
            //
        }

        this.inIframe = window.parent !== window

        this.injectGlobalStyles()
    }

    injectGlobalStyles() {
        if (!this.inIframe) return

        const style = styled`
            body > *:not(iframe-detector){
                filter: blur(.2rem);
            }
        `

        const styleNode = document.createElement('style')

        styleNode.innerHTML = style

        document.head.appendChild(styleNode)
    }

    static async boot() {
        const config = Config.get('app.allow_iframe_embed')

        if (config === 'enabled') {
            return
        }

        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        document.body.appendChild(document.createElement('iframe-detector'))
    }

    render() {
        if (!this.inIframe) return null

        return html`
            <div class="content">
                <a href=${location.toString()} target="_blank">
                    Click here to view the application.
                </a>
            </div>
        `
    }
}

IframeDetector.boot()

window.defineCustomElement('iframe-detector', IframeDetector)
