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

	const { loading, draft } = useSelector(({ editContract }) => editContract)

	const handleFinish = useCallback(
		(draft, history) => {
			dispatch(answerModify({ id, history, draft }))
		},
		[dispatch, id]
	)

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			{!loading ? (
				<FormFactory
					onFinish={handleFinish}
					cancelRoute={`/documents/${id}`}
					allowDraft={draft}
				/>
			) : null}
		</Layout>
	)
}

export default EditDocument
