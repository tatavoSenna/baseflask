import React from 'react'
import { render } from '@testing-library/react'

import Footer from './index.js'

describe('<Footer />', () => {
	const currentTest = 'Current Test'
	it('Snapshot testing', () => {
		const { asFragment } = render(<Footer current={currentTest} />)

		expect(asFragment()).toMatchSnapshot()
	})

	it('Testing props:', () => {
		const { getByTestId, getByText } = render(<Footer current={currentTest} />)

		expect(getByTestId('current')).toContainElement(getByText('Current Test'))
	})
})
