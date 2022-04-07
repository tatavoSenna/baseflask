import React, { useEffect } from 'react'
import { Layout, PageHeader, Spin, Breadcrumb } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Tabs from '~/pages/documentDetails/components/tabs'
import Editor from '~/pages/documentDetails/components/editor'
import PdfReader from '~/components/pdfFileReader'
import NewVersionModal from './components/modal'
import ConnectDocusignModal from './components/modalDocusignConnect'
import AssignModal from './components/tabs/assignModal'

import { listContract } from '~/states/modules/contract'
import { setInitialFolder, setRollBackFolder } from '~/states/modules/folder'
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
	downloadLink,
	getDocumentWordDownload,
	changeVariables,
	getDocumentCertificate,
} from '~/states/modules/documentDetail'

import styles from '../contracts/index.module.scss'
import MainLayout from '~/components/mainLayout'

const DocumentDetails = () => {
	const { id } = useParams()
	const dispatch = useDispatch()
	const history = useHistory()
	const {
		data,
		loading,
		text,
		comments,
		textUpdate,
		showModal,
		showAssignModal,
		showConnectModal,
		description,
		loadingSign,
		loadingVersion,
		version_id,
		file,
	} = useSelector(({ documentDetail }) => documentDetail)

	const { accessFolders } = useSelector(({ folder }) => folder)

	const createDocumentVersion = (form) => {
		dispatch(newVersion({ id, description, text: textUpdate }))
		dispatch(setShowModal(false))
		form.resetFields()
	}

	const updateText = (text, comments) =>
		dispatch(updateTextVersion({ text, comments }))

	const getPreviousStep = () => dispatch(previousStep({ id }))

	const getNextStep = () => dispatch(nextStep({ id }))

	const downloadDocument = () => dispatch(downloadLink({ id }))

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

	const getDocumentWord = () => {
		dispatch(getDocumentWordDownload({ id }))
	}

	const onSubmitChangeVariables = (values) => {
		dispatch(changeVariables({ id, values }))
	}

	const handleDownloadButton = () => {
		dispatch(getDocumentCertificate({ id }))
	}

	const handleInitialFolder = () => {
		dispatch(listContract())
		dispatch(setInitialFolder())
		history.push('/')
	}

	const handleFolderRowBack = (index) => {
		dispatch(setRollBackFolder(index))
		history.push('/')
	}

	var listFolders = accessFolders.map((folder, index) => (
		<Breadcrumb.Item
			key={index}
			className={styles.breadcrumbs}
			onClick={() => handleFolderRowBack(index)}>
			{folder ? folder.title : null}
		</Breadcrumb.Item>
	))

	useEffect(() => {
		dispatch(getDocumentDetail({ id }))
	}, [dispatch, id])

	return (
		<MainLayout>
			<Layout style={{ padding: '0', background: '#fff', width: '100%' }}>
				<PageHeader>
					<Breadcrumb>
						<Breadcrumb.Item
							onClick={handleInitialFolder}
							className={styles.breadcrumbs}>
							Documentos
						</Breadcrumb.Item>
						{accessFolders.length ? listFolders : null}
						<Breadcrumb.Item className={styles.breadcrumbs}>
							{data.title}
						</Breadcrumb.Item>
					</Breadcrumb>
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
							height: 'calc(100vh - 155px)',
							overflowY: 'hidden',
						}}>
						{file ? (
							<div
								style={{
									display: 'flex',
									width: '60%',
								}}>
								<PdfReader url={file} />
							</div>
						) : (
							<Editor
								text={text}
								comments={comments}
								onUpdateText={updateText}
								block={
									loadingSign ||
									loading ||
									data.sent ||
									version_id !== data.versions[0].id
								}
								versionLoading={loadingVersion}
								title={data.title}
							/>
						)}

						<Tabs
							textType={data.text_type}
							downloadDocument={getDocumentWord}
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
							onChangeVariables={onSubmitChangeVariables}
							current={data.workflow.current}
							steps={data.workflow.steps}
							onClickPrevious={getPreviousStep}
							onClickNext={getNextStep}
							onClickDownload={downloadDocument}
							block={loadingSign || loading}
							signedWorkflow={data.signed}
							text={text}
							textUpdate={textUpdate}
							onClickUpdate={handleShowModal}
							blockVersion={
								loadingSign ||
								loading ||
								data.sent ||
								version_id !== data.versions[0].id
							}
							versionLoading={loadingVersion}
							downloadButton={handleDownloadButton}
						/>
					</div>
				)}
			</Layout>
		</MainLayout>
	)
}

export default DocumentDetails
