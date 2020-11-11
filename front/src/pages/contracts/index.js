import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, PageHeader } from 'antd'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'
import ContractModal from './components/modal'
import { getColumns } from './columns'
import { listContract, setShowModal } from '~/states/modules/contract'

const Contracts = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const { data: contracts, loading, pages, showModal } = useSelector(
		({ contract }) => contract
	)
	const { data: models } = useSelector(({ model }) => model)

	const handleCreate = (values) => {
		dispatch(setShowModal(false))
		return history.push({
			pathname: `/contracts/new/`,
			state: { values: { ...values, current: 0 } },
		})
	}

	const handleCancel = () => {
		dispatch(setShowModal(false))
	}

	const handleShowModal = () => {
		dispatch(setShowModal(true))
	}

	const handleToGo = (record) =>
		history.push({
			pathname: `/documentDetails`,
			state: { id: record.id },
		})

	const getContracts = ({ page, perPage, search }) =>
		dispatch(listContract({ page, perPage, search }))

	const handleSearch = ({ page, perPage, search }) =>
		dispatch(listContract({ page, perPage, search }))

	useEffect(() => {
		dispatch(listContract())
	}, [dispatch])

	return (
		<Layout>
			<PageHeader>
				<BreadCrumb parent="Contratos" current="Lista" />
			</PageHeader>
			<Layout>
				{models.length > 0 && (
					<ContractModal
						handleCancel={handleCancel}
						handleCreate={handleCreate}
						showModal={showModal}
						models={models}
					/>
				)}
				<DataTable
					columns={getColumns()}
					dataSource={contracts}
					pages={pages}
					onChangePageNumber={getContracts}
					onSearch={handleSearch}
					onClickButton={handleShowModal}
					textButton="+ Contrato"
					placeholderNoData={!loading ? 'Nenhum contrato encontrado' : ''}
					loading={loading}
					onClickRow={handleToGo}
				/>
			</Layout>
		</Layout>
	)
}

export default Contracts
