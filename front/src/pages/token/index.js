import React, { useEffect }from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from 'antd'
import { Spin } from 'antd';

import { getJWToken } from '~/states/modules/session'
import { Redirect } from 'react-router-dom';


function Token(props) {
	const dispatch = useDispatch()

	const { signed } = useSelector(({session}) => session)

	useEffect(() => {
		const query = new URLSearchParams(window.location.search)
		const state = query.get('state');
		const code = query.get('code');
		dispatch(getJWToken({state, code, }))
	}, [dispatch])

	return (
		<Layout
			style={{
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			{signed && 
				<Redirect
					to='/'
				/>	
			}
			<Spin 
				size='large'
				tip='loading'
			/>
		</Layout>
	)
}

export default Token
