import { glob } from 'glob'

import { exec } from 'node:child_process'

import fs from 'fs/promises'

export class BundleBuilder {
    constructor() {}

    exec(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return reject(error)
                }

                if (stderr) return reject(stderr)

                resolve(stdout)
            })
        })
    }

    async getBundleHash() {
        if (this.hash) {
            return this.hash
        }

        const fileName = await this.fileName('build/**.js')

        const hash = fileName.match(/index-(.*?).js/)[1]

        this.hash = hash

        return this.hash
    }

    async keepOnlyBundleFile() {
        await this.exec('rm -f build/index.html')

        await this.exec('mv build/assets/index*.js build/')

        await this.exec('rm -rf build/assets')
    }

    /**
     *
     * @param {String} pattern glob pattern
     * @return {String} name of the first matched file.
     */
    async fileName(pattern) {
        return (await glob(pattern))[0].split('/').splice(-1)[0]
    }

    async addIIF() {
        const bundleName = await this.fileName('build/index-*.js')

        let content = await fs.readFile(`build/${bundleName}`, {
            encoding: 'utf-8',
        })

        content = `(function() {${content}})()`

        await fs.writeFile('build/' + bundleName, content)
    }

    async renameBundle() {
        const hash = await this.getBundleHash()

        await this.exec(`mv build/index*.js build/dashboard-${hash}.js`)
    }

    async generateDashboadAssetsBladeTemplate() {
        const bundleName = `dashboard-${await this.getBundleHash()}.js`

        const scriptTag = `<script async src="{{ asset('${bundleName}') }}"></script>`

        await fs.writeFile('build/dashboard-assets.blade.php', scriptTag)
    }

    async build() {
        await this.keepOnlyBundleFile()

        await this.addIIF()

        await this.renameBundle()

        await this.generateDashboadAssetsBladeTemplate()
    }
}

const builder = new BundleBuilder()

builder.build()
