// eslint-disable-next-line
const h = require('change-case')

// eslint-disable-next-line
module.exports = {
    params: ({ args }) => {
        /**
         * Example usage:
         * docker compose exec frontend npm run hygen dashboard-module new --name blog-post-module
         */
        const moduleName = args.name.replace('-module', '')

        const className = h.pascalCase(moduleName)

        const pluralClassName = className + 's'

        const singularTitleCase = h.titleCase(moduleName)

        const pluralParamName = moduleName + 's'

        const pluralTitleCase = h.titleCase(moduleName) + 's'

        return {
            moduleName,
            className,
            singularTitleCase,
            pluralClassName,
            pluralParamName,
            pluralTitleCase,
        }
    },
}
