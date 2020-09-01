import React from 'react'
import { render } from '@testing-library/react'

import Footer from './index.js'

describe('<Footer />', () => {
	it('Snapshot testing', () => {
		const { asFragment } = render(<Footer />)

		expect(asFragment()).toMatchSnapshot()
	})
})
