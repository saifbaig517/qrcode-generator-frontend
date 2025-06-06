import { isEmpty, equals } from '../src/core/helpers.js'

import assert from 'assert'

suite('helpers', () => {
    test('is empty', () => {
        assert.equal(isEmpty(null), true)
        assert.equal(isEmpty(undefined), true)
        assert.equal(isEmpty('123124'), false)
        assert.equal(isEmpty(''), true)
        assert.equal(isEmpty([]), true)
        assert.equal(isEmpty([null, undefined]), true)
        assert.equal(isEmpty([2]), false)
        assert.equal(isEmpty({}), true)
        assert.equal(isEmpty({ test: null }), true)
        assert.equal(isEmpty({ test: 1 }), false)
        assert.equal(
            isEmpty({
                test: {
                    nested: null,
                    anotherNested: { doesntHaveValue: null },
                },
            }),
            true
        )
        assert.equal(
            isEmpty({ test: { nested: null, anotherNested: { hasValue: 3 } } }),
            false
        )
    })

    test('equals', () => {
        assert.equal(equals(5, 5), true)
        assert.equal(equals(6, 5), false)
        assert.equal(equals('test', 'test'), true)
        assert.equal(equals('test', 'test1'), false)

        assert.equal(equals({ test: 1 }, { test: 1 }), true)
        assert.equal(equals({ test: 1 }, { test: 2 }), false)
        assert.equal(
            equals({ test: 1, other: { val: true } }, { test: 2 }),
            false
        )

        assert.equal(
            equals(
                { test: 1, other: { val: true } },
                { test: 1, other: { val: true } }
            ),
            true
        )

        assert.equal(
            equals(
                { test: 1, other: { val: true } },
                { test: 1, other: { val: true, another: 1 } }
            ),
            false
        )
    })
})
