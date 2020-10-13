import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Layout, PageHeader } from 'antd'

import { listContract } from '~/states/modules/contract'
import BreadCrumb from '~/components/breadCrumb'
import DataTable from '~/components/dataTable'

const COLUMNS = [
	{
		title: 'Descrição',
		dataIndex: 'title',
		key: 'title',
	},
	{
		title: 'Criado por',
		dataIndex: 'author',
		key: 'author',
	},
	{
		title: 'Data Criação',
		dataIndex: 'createdAt',
		key: 'createdAt',
	},
	{
		title: 'Status',
		dataIndex: 'address',
		key: 'address',
	},
]

function getDescription({ email, createdAt }) {
	return (
		<div>
			<p>{email}</p>
			<span>{createdAt}</span>
		</div>
	)
}

getDescription.propTypes = {
	email: PropTypes.string,
	createdAt: PropTypes.string,
}

getDescription.defaultProps = {
	email: '',
	createdAt: '',
}

const Contracts = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const { data: contracts, loading, pages } = useSelector(
		({ contract }) => contract
	)

	const handleToGo = () => history.push('/documentDetails')

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
				<DataTable
					columns={COLUMNS}
					dataSource={contracts}
					pages={pages}
					onChangePageNumber={getContracts}
					onSearch={handleSearch}
					onClickButton={() => {}}
					textButton="Novo Contrato"
					placeholderNoData={!loading ? 'Nenhum contrato encontrado' : ''}
					loading={loading}
					onClickRow={handleToGo}
				/>
			</Layout>
		</Layout>
	)
}

export default Contracts
