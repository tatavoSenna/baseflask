import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, Spin } from 'antd'

import { setDocusignRequest } from '~/states/modules/docusign'

function Docusign(props) {
	const dispatch = useDispatch()
	const history = useHistory()

	useEffect(() => {
		const query = new URLSearchParams(window.location.search)
		const code = query.get('code')
		dispatch(setDocusignRequest({ code, history }))
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

export default Docusign
