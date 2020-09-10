import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, Spin } from 'antd'

import { setDocusignRequest } from '~/states/modules/docusign'

function DocusignToken(props) {
	const dispatch = useDispatch()
	const history = useHistory()
	const { connected, error } = useSelector(({ docusign }) => docusign)

	useEffect(() => {
		const query = new URLSearchParams(window.location.search)
		const code = query.get('code')
		dispatch(setDocusignRequest({ code, history }))
	}, [dispatch])

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

export default DocusignToken
