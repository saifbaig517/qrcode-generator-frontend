import { html } from 'lit'
import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import '../ui/qrcg-input'
import '../ui/qrcg-textarea'
import '../ui/qrcg-balloon-selector'

import '../ui/qrcg-markdown-input'

import { t } from '../core/translate'

export class QrcgBlogPostForm extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: 'blog-posts',
        })
    }

    renderFormFields() {
        return html`
            <qrcg-input name="title"> ${t`Title`} </qrcg-input>

            <qrcg-markdown-input name="content" rows="10">
                ${t`Content`}
            </qrcg-markdown-input>

            <qrcg-textarea name="excerpt">
                ${t`Excerpt`}
                <div slot="instructions">
                    ${t`Optional excerpt to be shown on blog index page`}
                </div>
            </qrcg-textarea>

            <qrcg-textarea
                name="meta_description"
                placeholder="${t`Your meta description`}"
                maxLength="160"
            >
                ${t`Meta description`}
            </qrcg-textarea>

            <qrcg-file-input
                name="featured_image_id"
                ?disabled=${!this.data.id}
                upload-endpoint=${`blog-posts/${this.data.id}/upload-featured-image`}
                disabled-instructions=${t`Save the record before uploading a featured image.`}
            >
                ${t`Featured Image`}
            </qrcg-file-input>

            <qrcg-input type="date" name="published_at">
                ${t`Published at`}
                <div slot="instructions">
                    ${t`Only posts with publish date in the past will be available
                    on the front end.`}
                </div>
            </qrcg-input>

            <qrcg-relation-select
                name="translation_id"
                api-endpoint="translations?is_active=true&pagination=false"
            >
                ${t`Language`}
            </qrcg-relation-select>
        `
    }
}
window.defineCustomElement('qrcg-blog-post-form', QrcgBlogPostForm)
