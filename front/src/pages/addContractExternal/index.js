import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, Result } from 'antd'
import { useParams, useLocation } from 'react-router-dom'
import { SmileOutlined, AlertOutlined } from '@ant-design/icons'

import FormFactory from '~/components/formFactory'

import {
	verifyToken,
	storeURLVariables,
} from '~/states/modules/externalContract'

const getMessage = (success) => (
	<Result
		status={success ? 'success' : 'warning'}
		icon={success ? <SmileOutlined /> : <AlertOutlined />}
		title={
			success
				? 'Documento criado com sucesso!'
				: 'Atenção! Documento já foi criado!'
		}
	/>
)

const AddContractExternal = () => {
	const { token } = useParams()
	const { search } = useLocation()
	const searchParams = new URLSearchParams(search)

	const dispatch = useDispatch()
	const { created, authorized, filledVars } = useSelector(
		({ externalContract }) => externalContract
	)

	useEffect(() => {
		const variables = {}
		for (var p of searchParams) {
			variables[p[0]] = p[1]
		}
		dispatch(storeURLVariables({ variables }))
		// eslint-disable-next-line
	}, [dispatch])

	useEffect(() => {
		dispatch(verifyToken({ token }))
	}, [dispatch, token])

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			{authorized && !created ? (
				<FormFactory token={token} initialValues={filledVars} />
			) : (
				getMessage(created)
			)}
		</Layout>
	)
}

export default AddContractExternal
