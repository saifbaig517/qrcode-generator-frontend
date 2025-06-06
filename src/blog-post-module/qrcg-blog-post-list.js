import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

export class QrcgBlogPostList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'blog-posts',
            singularRecordName: 'Blog Post',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'title', label: 'Title' },
        { key: 'translation.name', label: 'Language' },
        { key: 'published_at', label: 'Published at' },
        { key: 'actions', label: 'Actions', width: '7rem' },
    ]

    searchPlaceholder() {
        return 'By title'
    }

    cellContentRenderer = (row, column) => {
        const value = row[column.key]

        switch (column.key) {
            case 'published_at':
                return this.renderPublishedBadge(value)
            default:
                return super.cellContentRenderer(row, column)
        }
    }

    renderPublishedBadge = (value) => {
        if (typeof value === 'object') {
            return value
        }

        const text = value ? value : '---'

        return text
    }
}

window.defineCustomElement('qrcg-blog-post-list', QrcgBlogPostList)
