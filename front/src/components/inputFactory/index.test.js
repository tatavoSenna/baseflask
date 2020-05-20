import React from 'react'
import { render } from '@testing-library/react'

import InputFactory from './index.js'

const test = [{ name: 'test', label: 'test label', type: 'radio' }]

describe('<Header />', () => {
	it('Snapshot testing', () => {
		const { asFragment } = render(
			<div>
				{test.map((t) => (
					<InputFactory name={t.name} label={t.label} type={t.type} />
				))}
			</div>
		)

		expect(asFragment()).toMatchSnapshot()
	})
})
