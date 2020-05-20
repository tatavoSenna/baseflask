import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Skeleton, Card, Layout } from 'antd'
import {
	EditOutlined,
	DownloadOutlined,
	SettingOutlined,
} from '@ant-design/icons'
// import moment from 'moment'
// import 'moment/locale/pt-br'

import { listContract, viewContract } from '~/states/modules/contract'
import BreadCrumb from '~/components/breadCrumb'

function Contracts() {
	const dispatch = useDispatch()
	const contracts = useSelector(({ contract }) => contract.contracts)
	const loading = useSelector(({ contract }) => contract.loading)

	useEffect(() => {
		dispatch(listContract())
	}, [dispatch])

	// const { Content } = Layout
	const { Meta } = Card

	function handleViewContract({ documentId }) {
		dispatch(viewContract({ documentId }))
	}

	return (
		<Layout
			style={{
				padding: '0 24px 24px',
			}}>
			<BreadCrumb parent="Contratos" current="Lista" />
			<Layout
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
				}}>
				{contracts.map((contract) => (
					<Card
						style={{ width: '100%', marginTop: 16, maxWidth: 800 }}
						actions={[
							<SettingOutlined key="setting" />,
							<EditOutlined key="edit" />,
							<DownloadOutlined
								key="download"
								onClick={() => handleViewContract({ documentId: contract.id })}
							/>,
						]}>
						<Skeleton loading={loading} avatar active>
							<Meta title={contract.title} description={contract.user.email} />
						</Skeleton>
					</Card>
				))}
			</Layout>
		</Layout>
	)
}

export default Contracts
