import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Skeleton, Card, Layout, Empty, Button, PageHeader } from 'antd'
import {
	EditOutlined,
	DownloadOutlined,
	SettingOutlined,
} from '@ant-design/icons'

import { listContract, viewContract } from '~/states/modules/contract'
import { signContract } from '~/states/modules/docusign'
import BreadCrumb from '~/components/breadCrumb'

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

function Contracts() {
	const history = useHistory()
	const dispatch = useDispatch()
	const { data: contracts, loading } = useSelector(({ contract }) => contract)

	useEffect(() => {
		dispatch(listContract())
	}, [dispatch])

	const { Meta } = Card

	function handleViewContract({ documentId }) {
		dispatch(viewContract({ documentId }))
	}

	function handleSignContract({ documentId }) {
		dispatch(signContract(documentId))
	}

	return (
		<Layout>
			<PageHeader>
				<BreadCrumb parent="Contratos" current="Lista" />
			</PageHeader>
			<Layout>
				{contracts.map((contract) => (
					<Card
						style={{ width: '100%', marginTop: 16, maxWidth: 800 }}
						actions={[
							<SettingOutlined key="setting" />,
							<EditOutlined
								key="sign"
								onClick={() => handleSignContract({ documentId: contract.id })}
							/>,
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
				{!loading && contracts.length === 0 && (
					<Empty description={<span>Nenhum contrato encontrado</span>}>
						<Button type="primary" onClick={() => history.push('/form/pj')}>
							Criar contrato
						</Button>
					</Empty>
				)}
			</Layout>
		</Layout>
	)
}

export default Contracts
