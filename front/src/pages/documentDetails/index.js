import React, { useEffect } from 'react'
import { Layout, PageHeader, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Steps from '~/pages/documentDetails/components/steps'
import Tabs from '~/pages/documentDetails/components/tabs'
import Editor from '~/pages/documentDetails/components/editor'
import BreadCrumb from '~/components/breadCrumb'
import NewVersionModal from './components/modal'
import ConnectDocusignModal from './components/modalDocusignConnect'
import AssignModal from './components/tabs/assignModal'

import {
	getDocumentDetail,
	newVersion,
	updateTextVersion,
	previousStep,
	nextStep,
	setShowModal,
	setShowAssignModal,
	setShowConnectModal,
	updateDescription,
	newAssign,
	sentAssign,
	selectVersion,
} from '~/states/modules/documentDetail'

const DocumentDetails = () => {
	const dispatch = useDispatch()
	const {
		data,
		loading,
		text,
		textUpdate,
		showModal,
		showAssignModal,
		showConnectModal,
		description,
		loadingSign,
		loadingVersion,
		version_id,
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

	const handleSentAssign = () => {
		dispatch(sentAssign({ id }))
	}

	const handleDescription = (form) => {
		dispatch(updateDescription(form.getFieldsValue()))
	}

	const handleAssign = (form) => {
		dispatch(newAssign({ id, signers: form.getFieldsValue() }))
	}

	const handleShowModal = () => {
		dispatch(setShowModal(true))
	}

	const handleShowAssignModal = () => {
		dispatch(setShowAssignModal(true))
	}

	const handleCancelModal = () => {
		dispatch(setShowModal(false))
	}

	const handleCancelConnectModal = () => {
		dispatch(setShowConnectModal(false))
	}

	const handleCancelAssignModal = () => {
		dispatch(setShowAssignModal(false))
	}

	const handleVersion = (id) => {
		dispatch(selectVersion({ id }))
	}

	useEffect(() => {
		dispatch(getDocumentDetail({ id }))
	}, [dispatch, id])

	return (
		<Layout style={{ padding: '0 24px 24px', background: '#fff' }}>
			<PageHeader>
				<BreadCrumb
					parent="Contratos"
					current={`${Object.keys(data).length > 0 ? data.title : 'Detalhe'}`}
				/>
			</PageHeader>
			<NewVersionModal
				handleCancel={handleCancelModal}
				handleCreate={createDocumentVersion}
				showModal={showModal}
				description={description}
				handleDescription={handleDescription}
			/>
			<ConnectDocusignModal
				handleCancel={handleCancelConnectModal}
				showModal={showConnectModal}
			/>
			<AssignModal
				handleCancel={handleCancelAssignModal}
				handleAssign={handleAssign}
				signers={data.signers}
				showModal={showAssignModal}
			/>
			{Object.keys(data).length < 1 && <Spin spinning={loading} />}
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
							block={loadingSign || loading}
						/>
						<Editor
							text={text}
							textUpdate={textUpdate}
							onClickUpdate={handleShowModal}
							onUpdateText={updateText}
							block={loadingSign || loading || data.sent}
							versionLoading={loadingVersion}
						/>
					</div>
					<Tabs
						signers={data.signers}
						versions={data.versions}
						showAssignModal={handleShowAssignModal}
						infos={data.info}
						variables={data.variables}
						signed={data.sent}
						sentAssign={handleSentAssign}
						loadingSign={loadingSign}
						handleVersion={handleVersion}
						versionId={version_id}
					/>
				</div>
			)}
		</Layout>
	)
}

export default DocumentDetails
