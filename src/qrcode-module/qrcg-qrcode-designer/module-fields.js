import { html } from 'lit'
import { t } from '../../core/translate'
import { url } from '../../core/helpers'

export class ModuleFields {
    constructor(host) {
        this.host = host
        host.addController(this)
    }

    hostDisconnected() {
        this.host = null
    }

    renderCustomEyeShapes() {
        return html`
            <label>${t`Select finder`}</label>

            <qrcg-img-selector
                name="finder"
                value="default"
                .options=${'default,eye-shaped,octagon,rounded-corners,whirlpool,water-drop,circle,zigzag,circle-dots'
                    .split(',')
                    .map((value) => {
                        return {
                            value,
                            src: `${value}.png`,
                        }
                    })}
                base="${url('assets/images/finders')}"
            ></qrcg-img-selector>

            <label>${t`Select finder dot`}</label>

            <qrcg-img-selector
                name="finderDot"
                value="default"
                .options=${'default,eye-shaped,octagon,rounded-corners,whirlpool,water-drop,circle,zigzag'
                    .split(',')
                    .map((value) => {
                        return {
                            value,
                            src: `${value}.png`,
                        }
                    })}
                base="${url('assets/images/finders/dots')}"
            ></qrcg-img-selector>
        `
    }

    render() {
        if (this.host.isAiDesign()) return

        return html`
            <label>${t`Select module`}</label>

            <qrcg-img-selector
                name="module"
                value="square"
                .options=${'square,dots,triangle,rhombus,star-5,star-7,roundness,vertical-lines,horizontal-lines,diamond,fish,tree,twoTrianglesWithCircle,fourTriangles,triangle-end'
                    .split(',')
                    .map((value) => {
                        return {
                            value,
                            src: `${value}.png`,
                        }
                    })}
                base="${url('assets/images/modules')}"
            ></qrcg-img-selector>

            ${this.renderCustomEyeShapes()}
        `
    }
}
