import React, { useEffect } from 'react'
import { Layout, PageHeader, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Steps from '~/pages/documentDetails/components/steps'
import Tabs from '~/pages/documentDetails/components/tabs'
import Editor from '~/pages/documentDetails/components/editor'
import BreadCrumb from '~/components/breadCrumb'

import { getDocumentDetail } from '~/states/modules/documentDetail'

const DocumentDetails = () => {
	const dispatch = useDispatch()
	const { data, loading, text } = useSelector(
		({ documentDetail }) => documentDetail
	)
	const { id } = useHistory().location.state

	useEffect(() => {
		dispatch(getDocumentDetail({ id }))
	}, [dispatch, id])

	return (
		<Layout style={{ padding: '0 24px 24px' }}>
			<PageHeader>
				<BreadCrumb parent="Contratos" current="Detalhe" />
			</PageHeader>
			<Spin spinning={loading} />
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
							title="Evolução do Documento"
							steps={data.workflow.steps}
						/>
						<Editor title={data.title} text={text} />
					</div>
					<Tabs signers={data.signers} />
				</div>
			)}
		</Layout>
	)
}

export default DocumentDetails
