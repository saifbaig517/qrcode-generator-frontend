import { LitElement, html, css } from 'lit'

export class QrcgTheme extends LitElement {
    static styles = [
        css`
            :host {
                display: none;
            }
        `,
    ]

    static get globalStyle() {
        const tagStyleId = 'qrcg-theme-global-style'

        let style = document.getElementById(tagStyleId)

        if (!style) {
            style = document.createElement('style')

            style.id = tagStyleId

            style.innerHTML = `:root {

            }`

            document.head.appendChild(style)
        }

        return style
    }

    /**
     *
     * @param {String} name variable name
     * @param {HTMLElement} target defaults to body
     */
    static getCssVar(name, target = null) {
        if (!target) {
            target = document.body
        }

        return getComputedStyle(target).getPropertyValue(name)
    }

    static configToCssVarName(configKey) {
        // Example of config key: theme.primary_0
        return `--${configKey.replace('theme.', '').replace(/_/g, '-')}`
    }

    static setThemeConfig({ key, value }) {
        return this.setCssVar({
            key: this.configToCssVarName(key),
            value,
        })
    }

    static setCssVar({ key, value }) {
        if (this.globalStyle.innerHTML.match(new RegExp(key))) {
            // here there is a bug
            const updatedStyleText = this.globalStyle.innerHTML.replace(
                new RegExp(`${key}: .*`),
                `${key}: ${value};`
            )

            this.globalStyle.innerHTML = updatedStyleText
        } else {
            const newStyle = this.globalStyle.innerHTML.replace(
                '}',
                `
            ${key}: ${value}; 
        }
        `
            )

            this.globalStyle.innerHTML = newStyle
        }
    }

    render() {
        return html``
    }
}

window.defineCustomElement('qrcg-theme', QrcgTheme)
