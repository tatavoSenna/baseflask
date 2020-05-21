import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Skeleton, Card, Layout } from 'antd'
import {
	EditOutlined,
	DownloadOutlined,
	SettingOutlined,
} from '@ant-design/icons'

import { listContract, viewContract } from '~/states/modules/contract'
import BreadCrumb from '~/components/breadCrumb'

function Contracts() {
	const dispatch = useDispatch()
	const contracts = useSelector(({ contract }) => contract.contracts)
	const loading = useSelector(({ contract }) => contract.loading)

	useEffect(() => {
		dispatch(listContract())
	}, [dispatch])

	const { Meta } = Card

	function handleViewContract({ documentId }) {
		dispatch(viewContract({ documentId }))
	}

	function getDescription({ email, createdAt }) {
		return (
			<div>
				<p>{email}</p>
				<span>{createdAt}</span>
			</div>
		)
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
						<Skeleton loading={loading} active>
							<Meta
								title={contract.title}
								description={getDescription({
									email: contract.authorEmail,
									createdAt: contract.createdAt,
								})}
							/>
						</Skeleton>
					</Card>
				))}
			</Layout>
		</Layout>
	)
}

export default Contracts
