import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render } from '@testing-library/react'

import Header from './index.js'

jest.mock('react-redux', () => ({
	useDispatch: () => jest.fn(),
}))

describe('<Header />', () => {
	it('Snapshot testing', () => {
		const { asFragment } = render(
			<Router>
				<Header />
			</Router>
		)

		expect(asFragment()).toMatchSnapshot()
	})
})
