import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setSignaturesProvider } from '~/states/modules/session'
import { getIntegration } from '~/states/modules/integrations'

import Docusign from './docusign'
import D4sign from './d4sign'
import { Card } from 'antd'

const Integration = () => {
	const dispatch = useDispatch()
	const [checkDocusign, setCheckDocusign] = useState(false)
	const [checkD4sign, setCheckD4sign] = useState(false)
	const { loading, company } = useSelector(({ integrations }) => integrations)
	const { signatures_provider } = useSelector(({ session }) => session)

	useEffect(() => {
		dispatch(getIntegration())
		if (signatures_provider === 'd4sign') {
			setCheckD4sign(true)
			setCheckDocusign(false)
		} else if (signatures_provider === 'docusign') {
			setCheckD4sign(false)
			setCheckDocusign(true)
		} else {
			setCheckD4sign(false)
			setCheckDocusign(false)
		}
	}, [dispatch, signatures_provider])

	const onCheckDocusign = (e) => {
		if (e.target.checked) {
			dispatch(setSignaturesProvider('docusign'))
		} else {
			dispatch(setSignaturesProvider(null))
		}
	}
	const onCheckD4sign = (e) => {
		if (e.target.checked) {
			dispatch(setSignaturesProvider('d4sign'))
		} else {
			dispatch(setSignaturesProvider(null))
		}
	}

	return (
		<Card
			style={{
				marginTop: '50px',
				maxWidth: '800px',
				width: '100%',
				background: 'white',
			}}
			loading={loading}
		>
			<Docusign
				checkDocusign={checkDocusign}
				onCheckDocusign={onCheckDocusign}
				company={company}
				signatures_provider={signatures_provider}
			/>
			<D4sign
				checkD4sign={checkD4sign}
				onCheckD4sign={onCheckD4sign}
				company={company}
				signatures_provider={signatures_provider}
			/>
		</Card>
	)
}

export default Integration
