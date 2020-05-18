import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout } from 'antd'
import { Table, Button } from 'antd'
import moment from 'moment'
import 'moment/locale/pt-br'

import { listContract, viewContract } from '~/states/modules/contract'
import BreadCrumb from '~/components/breadCrumb'
import Loader from '~/components/loader'

function Contracts() {
	const dispatch = useDispatch()
	const contracts = useSelector(({ contract }) => contract.contracts)
	const loading = useSelector(({ contract }) => contract.loading)

	useEffect(() => {
		dispatch(listContract())
	}, [dispatch])

	const { Content } = Layout

	function handleViewContract({ documentId }) {
		dispatch(viewContract({ documentId }))
	}

	const columns = [
		{
			title: 'Nome',
			dataIndex: 'title',
			key: 'name',
			render: (text) => <a>{text}</a>,
		},
		{
			title: 'Autor',
			dataIndex: ['user', 'name'],
			key: 'author',
		},
		{
			title: 'Email',
			dataIndex: ['user', 'email'],
			key: 'email',
		},
		{
			title: 'Data de criação',
			dataIndex: 'created_at',
			key: 'createdAt',
			render: (date) => {
				moment.locale('pt-br')
				return moment(date).fromNow()
			},
		},
		{
			title: '',
			dataIndex: 'id',
			key: 'configs',
			render: (documentId) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-end',
					}}>
					<Button onClick={() => {}} style={{ marginRight: '15px' }}>
						Editar
					</Button>
					<Button
						type="primary"
						onClick={() => handleViewContract({ documentId })}>
						Download
					</Button>
				</div>
			),
		},
	]

	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<BreadCrumb current="Contratos" />
			<Content
				className="site-layout-background"
				style={{
					padding: 24,
					margin: 0,
					minHeight: 280,
					background: '#fff',
				}}>
				{(loading && <Loader />) || (
					<Table columns={columns} dataSource={contracts} />
				)}
			</Content>
		</Layout>
	)
}

export default Contracts
