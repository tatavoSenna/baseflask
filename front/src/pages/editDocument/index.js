import React, { useCallback, useEffect } from 'react'
import { Layout } from 'antd'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import FormFactory from 'components/formFactory'
import { answerModify } from 'states/modules/answer'
import { editContract } from 'states/modules/editContract'

const EditDocument = () => {
	const dispatch = useDispatch()
	const { id } = useParams()

	useEffect(() => {
		dispatch(editContract({ id }))
	}, [dispatch, id])

	const { loading } = useSelector(({ editContract }) => editContract)

	const handleFinish = useCallback(
		(visible, history) => {
			dispatch(answerModify({ id, history, visible }))
		},
		[dispatch, id]
	)

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			{!loading ? (
				<FormFactory onFinish={handleFinish} cancelRoute={`/documents/${id}`} />
			) : null}
		</Layout>
	)
}

export default EditDocument
