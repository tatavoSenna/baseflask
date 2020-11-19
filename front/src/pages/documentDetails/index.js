import React, { useEffect } from 'react'
import { Layout, PageHeader, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Steps from '~/pages/documentDetails/components/steps'
import Tabs from '~/pages/documentDetails/components/tabs'
import Editor from '~/pages/documentDetails/components/editor'
import BreadCrumb from '~/components/breadCrumb'
import NewVersionModal from './components/modal'

import {
	getDocumentDetail,
	newVersion,
	updateTextVersion,
	previousStep,
	nextStep,
	setShowModal,
	updateDescription,
} from '~/states/modules/documentDetail'

const DocumentDetails = () => {
	const dispatch = useDispatch()
	const {
		data,
		loading,
		text,
		textUpdate,
		showModal,
		description,
	} = useSelector(({ documentDetail }) => documentDetail)
	const { id } = useHistory().location.state

	const createDocumentVersion = (form) => {
		dispatch(newVersion({ id, description, text: textUpdate }))
		dispatch(setShowModal(false))
		form.resetFields()
	}

	const updateText = (text) => dispatch(updateTextVersion({ text }))

	const getPreviousStep = () => dispatch(previousStep({ id }))

	const getNextStep = () => dispatch(nextStep({ id }))

	const handleDescription = (form) => {
		dispatch(updateDescription(form.getFieldsValue()))
	}

	const handleShowModal = () => {
		dispatch(setShowModal(true))
	}

	const handleCancel = () => {
		dispatch(setShowModal(false))
	}

	useEffect(() => {
		dispatch(getDocumentDetail({ id }))
	}, [dispatch, id])

	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<PageHeader>
				<BreadCrumb
					parent="Contratos"
					current={`${Object.keys(data).length > 0 ? data.title : 'Detalhe'}`}
				/>
			</PageHeader>
			<NewVersionModal
				handleCancel={handleCancel}
				handleCreate={createDocumentVersion}
				showModal={showModal}
				description={description}
				handleDescription={handleDescription}
			/>
			<Spin spinning={loading} />
			{Object.keys(data).length > 0 && (
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						paddingBottom: 50,
					}}>
					<div>
						<Steps
							current={data.workflow.current}
							steps={data.workflow.steps}
							onClickPrevious={getPreviousStep}
							onClickNext={getNextStep}
						/>
						<Editor
							text={text}
							textUpdate={textUpdate}
							onClickUpdate={handleShowModal}
							onUpdateText={updateText}
						/>
					</div>
					<Tabs
						signers={data.signers}
						versions={data.versions}
						infos={data.variables}
					/>
				</div>
			)}
		</Layout>
	)
}

export default DocumentDetails
