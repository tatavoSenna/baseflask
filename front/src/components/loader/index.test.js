import React from 'react'
import { render } from '@testing-library/react'

import Loader from './index.js'

describe('<Loader />', () => {
	it('Snapshot testing', () => {
		const { asFragment } = render(<Loader />)

		expect(asFragment()).toMatchSnapshot()
	})
})
