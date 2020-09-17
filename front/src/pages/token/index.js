import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Layout } from 'antd'
import { Spin } from 'antd'

import { getJWToken } from '~/states/modules/session'

function Token(props) {
	const history = useHistory()
	const dispatch = useDispatch()

	useEffect(() => {
		const query = new URLSearchParams(window.location.search)
		const state = query.get('state')
		const code = query.get('code')
		dispatch(getJWToken({ state, code, history }))
	}, [dispatch, history])

	return (
		<Layout
			style={{
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<Spin size="large" tip="loading" />
		</Layout>
	)
}

export default Token
