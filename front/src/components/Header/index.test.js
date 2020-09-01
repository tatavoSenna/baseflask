import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render } from '@testing-library/react'

import Header from './index.js'

jest.mock('react-redux', () => ({
	useDispatch: () => jest.fn(),
}))

describe('<Header />', () => {
	it('Snapshot testing', () => {
		const funcTest = jest.fn()
		const { asFragment } = render(
			<Router>
				<Header handleCollapsed={funcTest} isCollapsed={false} />
			</Router>
		)

		expect(asFragment()).toMatchSnapshot()
	})
})
