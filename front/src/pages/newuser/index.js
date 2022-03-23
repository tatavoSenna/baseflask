import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { Input, Layout, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Button } from '@aws-amplify/ui-react'

import { updateNewCompany, addCompany } from '~/states/modules/companies'
import Header from '~/components/Header'
import styles from './index.module.scss'

const Status = {
	TYPING: 0,
	AWAITING: 1,
	SUCCESS: 2,
}

function NewUser() {
	const { Content } = Layout
	const { Title, Text } = Typography

	const isDesktopOrLaptop = useMediaQuery({
		query: '(min-device-width: 1224px)',
	})

	const { loading, error } = useSelector(({ companies }) => companies)

	const history = useHistory()
	const dispatch = useDispatch()
	const [companyName, setCompanyName] = useState('')
	const [status, setStatus] = useState(Status.TYPING)

	const handleNewCompany = (event) => {
		let name = event.target.value
		setCompanyName(name)
		dispatch(updateNewCompany({ name }))
	}

	const handleAdd = () => {
		if (companyName.length > 0 && !loading) {
			dispatch(addCompany())
			setStatus(Status.AWAITING)
		}
	}

	useEffect(() => {
		if (!loading && status === Status.AWAITING) {
			if (typeof error === 'undefined') {
				setStatus(Status.SUCCESS)
				setTimeout(() => history.push('/'), 500)
			} else {
				setStatus(Status.TYPING)
			}
		}
	}, [status, loading, error, history])

	return (
		<Layout className={styles['base-layout']}>
			<Header
				handleCollapsed={() => {}}
				isCollapsed={false}
				isWeb={isDesktopOrLaptop}
				className={styles.header}
			/>
			<Layout className={styles['layout']}>
				<Content className={styles['content']}>
					<Title className={styles['greeting']}>Bem vindo à Lawing!</Title>
					<Text level={4} className={styles['instructions']}>
						Para começar, complete os dados necessários
					</Text>

					<div className={styles['form-card']}>
						<div className={styles['form-card-content']}>
							<div className="amplify-flex amplify-field amplify-textfield">
								<label className="amplify-label">Nome da empresa</label>
								<Input
									className="amplify-select amplify-input amplify-textarea"
									style={{ outline: 0 }}
									label="Nome da empresa"
									placeholder="Nome da empresa"
									onChange={handleNewCompany}
									onPressEnter={handleAdd}
								/>
							</div>
							<Button
								isFullWidth={true}
								disabled={companyName.length === 0}
								variation="primary"
								onClick={handleAdd}
							>
								{loading ? (
									<LoadingOutlined
										twoToneColor="#40a9ff"
										style={{ fontSize: '1.75em' }}
									/>
								) : (
									'Começar'
								)}
							</Button>
						</div>
					</div>
				</Content>
			</Layout>
		</Layout>
	)
}

export default NewUser
