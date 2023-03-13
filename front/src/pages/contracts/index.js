import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, PageHeader, Breadcrumb } from 'antd'
import DataTable from '~/components/dataTable'
import ContractModal from './components/modal'
import FolderModal from './components/modalFolder'
import MoveFolderModal from './components/moveFolder'
import LinkModal from './components/modalLink'
import StripeModal from './components/modalStripe'
import { getColumns } from './columns'
import { listModel } from '~/states/modules/model'
import {
	listContract,
	deleteContract,
	deleteFolder,
	deleteSelected,
	createLink,
	setShowModal,
	setShowLinkModal,
	setShowStripeModal,
} from '~/states/modules/contract'
import { getCompanyInfo } from '~/states/modules/companies'

import {
	setShowModalFolder,
	createFolder,
	setChooseFolder,
	updateNewFolder,
	setInitialFolder,
	setRollBackFolder,
	setMoveFolderModal,
	setMoveFolder,
	setSelectChildren,
	listFolder,
} from '~/states/modules/folder'

import styles from './index.module.scss'
import MainLayout from '~/components/mainLayout'

const Contracts = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const [chosenMoveRow, setchosenMoveRow] = useState({ id: -1, title: '' })

	const {
		data: contracts,
		loading,
		pages,
		showModal,
		showLinkModal,
		showStripeModal,
		link,
		parent,
		order,
		order_by,
	} = useSelector(({ contract }) => contract)

	const loggedUser = useSelector(({ session }) => session)

	const { showFolderModal, newFolder, accessFolders, moveFolderModal } =
		useSelector(({ folder }) => folder)

	const { companyInfo } = useSelector(({ companies }) => companies)

	const { data: models } = useSelector(({ model }) => model)

	const { company_id, is_financial } = useSelector(({ session }) => session)

	useEffect(() => {
		dispatch(getCompanyInfo({ id: company_id }))
	}, [dispatch, company_id])

	const handleCreate = (values) => {
		dispatch(setShowModal(false))
		if (companyInfo['remainingDocuments'] > 0) {
			return history.push({
				pathname: `/documents/new`,
				state: {
					modelId: values.modelId,
					title: values.title,
					parent: values.parent,
				},
			})
		} else {
			dispatch(setShowStripeModal(true))
		}
	}

	const handleCreateInFolder = (values) => {
		dispatch(setShowModal(false))

		return history.push({
			pathname: `/documents/new`,
			state: {
				modelId: values.modelId,
				title: values.title,
				parent: accessFolders[accessFolders.length - 1].id,
			},
		})
	}

	const handleCreateLinkExternal = (values) => {
		dispatch(createLink(values))
	}

	const handleCancel = () => {
		dispatch(setShowModal(false))
	}

	const handleShowModal = () => {
		dispatch(listModel())
		dispatch(setShowModal(true))
	}

	const handleCreateFolder = (values) => {
		dispatch(createFolder(values))
	}

	const handleUpdate = (form) => {
		dispatch(updateNewFolder(form.getFieldsValue()))
	}

	const handleShowModalFolder = () => {
		dispatch(setShowModalFolder(true))
	}

	const handleCancelFolder = () => {
		dispatch(setShowModalFolder(false))
	}

	const handleCancelLinkModal = () => {
		dispatch(setShowLinkModal(false))
	}

	const handleCancelStripeModal = () => {
		dispatch(setShowStripeModal(false))
	}

	const handleChooseModal = () => {
		dispatch(getCompanyInfo({ id: company_id }))
		companyInfo['remainingDocuments'] > 0
			? handleShowModal()
			: dispatch(setShowStripeModal(true))
	}

	function handleGoTo(path) {
		dispatch(setShowStripeModal(false))
		return history.push(path)
	}

	const handleMoveFolderModal = (value) => {
		dispatch(setMoveFolderModal(value))
	}

	const handleToGo = (record) => {
		if (record.is_folder) {
			dispatch(listContract({ parent: record.id }))
			dispatch(setChooseFolder(record))
		} else {
			history.push({
				pathname: `/documents/${record.id}`,
			})
		}
	}

	const handleDelete = (record) => {
		if (Array.isArray(record)) dispatch(deleteSelected({ ids: record, pages }))
		else if (record.is_folder) dispatch(deleteFolder({ id: record.id, pages }))
		else dispatch(deleteContract({ id: record.id, pages }))
	}

	const getContracts = ({ page, perPage, search }) =>
		dispatch(listContract({ page, perPage, search, parent, order_by, order }))

	const handleSearch = ({ page, perPage, search }) =>
		dispatch(listContract({ page, perPage, search, parent, order_by, order }))

	const sortTable = (parameter) => {
		var currentOrder
		order === 'ascend'
			? (currentOrder = 'descend')
			: order === 'descend'
			? (currentOrder = null)
			: (currentOrder = 'ascend')
		if (parameter !== order_by) currentOrder = 'ascend'
		dispatch(listContract({ parent, order_by: parameter, order: currentOrder }))
	}

	const handleInitialFolder = () => {
		if (accessFolders.length !== 0) {
			dispatch(listContract())
			dispatch(setInitialFolder())
		}
	}

	const handleFolderRowBack = (index) => {
		dispatch(setRollBackFolder(index))
	}

	const setMoveNode = (row) => {
		if (accessFolders.length) {
			dispatch(listFolder({ id: row.id, source: true }))
		} else {
			dispatch(listFolder({ id: row.id }))
		}
		dispatch(setMoveFolderModal(true))
		setchosenMoveRow(row)
	}

	const handleMoveFolder = ({ destination, parent }) => {
		dispatch(setMoveFolderModal(false))
		if (destination) {
			dispatch(
				setMoveFolder({
					document_id: chosenMoveRow.id,
					destination_id: destination[0],
					parent: parent,
				})
			)
		} else {
			dispatch(
				setMoveFolder({
					document_id: chosenMoveRow.id,
					destination_id: null,
					parent: parent,
				})
			)
		}
		dispatch(setSelectChildren({ parent }))
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
		!accessFolders.length
			? dispatch(listContract())
			: dispatch(
					listContract({ parent: accessFolders[accessFolders.length - 1].id })
			  )
	}, [dispatch, accessFolders])

	const [selectedContracts, setSelectedContracts] = useState([])

	return (
		<MainLayout selectedKey={'/'}>
			<Layout style={{ backgroundColor: '#fff' }}>
				<PageHeader>
					<Breadcrumb>
						<Breadcrumb.Item
							onClick={handleInitialFolder}
							className={styles.breadcrumbs}>
							Documentos
						</Breadcrumb.Item>
						{accessFolders.length ? listFolders : null}
					</Breadcrumb>
				</PageHeader>
				<Layout style={{ backgroundColor: '#fff' }}>
					{models.length > 0 && (
						<ContractModal
							handleCancel={handleCancel}
							handleCreate={
								accessFolders.length ? handleCreateInFolder : handleCreate
							}
							handleCreateLink={handleCreateLinkExternal}
							showModal={showModal}
							models={models}
						/>
					)}
					<FolderModal
						handleCancel={handleCancelFolder}
						parent={
							accessFolders.length
								? accessFolders[accessFolders.length - 1].id
								: null
						}
						handleNewFolder={handleCreateFolder}
						handleUpdate={handleUpdate}
						showModal={showFolderModal}
						newFolder={newFolder}
					/>
					<MoveFolderModal
						handleCancel={handleMoveFolderModal}
						showModal={moveFolderModal}
						handleMoveFolder={handleMoveFolder}
						parent={
							accessFolders.length
								? accessFolders[accessFolders.length - 1].id
								: null
						}
						chosenMoveRow={chosenMoveRow}
					/>
					<LinkModal
						handleOk={handleCancelLinkModal}
						showModal={showLinkModal}
						link={link}
					/>
					<StripeModal
						handleCancel={handleCancelStripeModal}
						showModal={showStripeModal}
						handleConfirm={handleGoTo}
						isFinancial={is_financial}
						modalText={
							is_financial
								? 'Se deseja criar um novo documento, por favor faça o upgrade de seu plano.'
								: 'Se deseja criar um novo documento, por favor peça para o responsável financeiro de sua empresa fazer o upgrade de seu plano.'
						}
					/>
					<DataTable
						columns={getColumns(
							handleToGo,
							handleDelete,
							setMoveNode,
							sortTable,
							selectedContracts,
							loggedUser
						)}
						dataSource={contracts}
						pages={pages}
						onChangePageNumber={getContracts}
						onSearch={handleSearch}
						onClickButton={handleChooseModal}
						textButton="Novo Documento"
						placeholderSearch="Buscar Documento"
						placeholderNoData={!loading ? 'Nenhum documento encontrado' : ''}
						loading={loading}
						buttons={[
							{
								title: 'Nova Pasta',
								onClick: handleShowModalFolder,
							},
						]}
						sortTable={sortTable}
						rowSelection={{
							columnWidth: '64px',
							selectedRowKeys: selectedContracts,
							onChange: (keys) => setSelectedContracts(keys),
							getCheckboxProps: (record) => {
								if (record.is_folder) return { disabled: true }
								else return {}
							},
							renderCell: (checked, record, index, originNode) => {
								if (record.is_folder) return null
								else return originNode
							},
						}}
					/>
				</Layout>
			</Layout>
		</MainLayout>
	)
}

export default Contracts
