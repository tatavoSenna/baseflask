import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, PageHeader } from 'antd'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'
import ContractModal from './components/modal'
import LinkModal from './components/modalLink'
import { getColumns } from './columns'
import { listModel } from '~/states/modules/model'
import {
	listContract,
	deleteContract,
	createLink,
	setShowModal,
	setShowLinkModal,
} from '~/states/modules/contract'

const Contracts = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const {
		data: contracts,
		loading,
		pages,
		showModal,
		showLinkModal,
		link,
	} = useSelector(({ contract }) => contract)

	const { data: models } = useSelector(({ model }) => model)

	const handleCreate = (values) => {
		dispatch(setShowModal(false))
		return history.push({
			pathname: `/contracts/new/`,
			state: { values: { ...values, current: 0 } },
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

	const handleCancelLinkModal = () => {
		dispatch(setShowLinkModal(false))
	}

	const handleToGo = (record) =>
		history.push({
			pathname: `/documentDetails`,
			state: { id: record.id },
		})

	const handleDeleteContract = (record) =>
		dispatch(deleteContract({ id: record.id, pages }))

	const getContracts = ({ page, perPage, search }) =>
		dispatch(listContract({ page, perPage, search }))

	const handleSearch = ({ page, perPage, search }) =>
		dispatch(listContract({ page, perPage, search }))

	useEffect(() => {
		dispatch(listContract())
	}, [dispatch])

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			<PageHeader>
				<BreadCrumb parent="Documentos" current="Lista" />
			</PageHeader>
			<Layout style={{ backgroundColor: '#fff' }}>
				{models.length > 0 && (
					<ContractModal
						handleCancel={handleCancel}
						handleCreate={handleCreate}
						handleCreateLink={handleCreateLinkExternal}
						showModal={showModal}
						models={models}
					/>
				)}
				<LinkModal
					handleOk={handleCancelLinkModal}
					showModal={showLinkModal}
					link={link}
				/>
				<DataTable
					columns={getColumns(handleToGo, handleDeleteContract)}
					dataSource={contracts}
					pages={pages}
					onChangePageNumber={getContracts}
					onSearch={handleSearch}
					onClickButton={handleShowModal}
					textButton="Novo Documento"
					placeholderSearch="Buscar Documento"
					placeholderNoData={!loading ? 'Nenhum documento encontrado' : ''}
					loading={loading}
				/>
			</Layout>
		</Layout>
	)
}

export default Contracts
