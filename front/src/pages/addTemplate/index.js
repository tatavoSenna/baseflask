import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Form, Button } from 'antd'
import {
	postTemplateAppend,
	postTemplateRequest,
} from '~/states/modules/postTemplate'

import TemplateForm from './components/form'
import Workflow from './components/workflow'
import Signers from './components/signers'
import Text from './components/text'

import styles from './index.module.scss'

const layout = {
	labelCol: {
		lg: { span: 6 },
		md: { span: 12 },
		sm: { span: 12 },
	},
	wrapperCol: {
		lg: { offset: 1, span: 11 },
		md: { span: 24 },
		sm: { span: 24 },
	},
}
const tailLayout = {
	wrapperCol: { span: 24 },
}

function AddTemplate() {
	const { data } = useSelector(({ postTemplate }) => postTemplate)
	const { current } = useHistory().location.state
	const currentPage = parseInt(current)
	const dispatch = useDispatch()
	const history = useHistory()
	const [form] = Form.useForm()

	const handleBack = () => {
		const previousPage = currentPage - 1
		history.push({
			pathname: `/templates/new/`,
			state: { current: previousPage },
		})
	}

	const onSubmit = (data) => {
		if (currentPage < 3) {
			const nextPage = currentPage + 1
			return history.push({
				pathname: `/templates/new/`,
				state: { current: nextPage },
			})
		}
		dispatch(postTemplateRequest({ history }))
	}

	const updateForm = (e, name) => {
		const value = e.target.value
		dispatch(postTemplateAppend({ name, value }))
	}

	const props = { data, updateForm }

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				marginLeft: 'auto',
				marginRight: 'auto',
			}}>
			<Form
				{...layout}
				form={form}
				layout="horizontal"
				hideRequiredMark
				onFinish={onSubmit}>
				{currentPage === 0 && <TemplateForm {...props} />}
				{currentPage === 1 && <Workflow {...props} />}
				{currentPage === 2 && <Signers {...props} />}
				{currentPage === 3 && <Text {...props} />}
				<div
					style={{
						minWidth: 800,
					}}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
							width: 600,
						}}>
						<Form.Item {...tailLayout}>
							{currentPage > 0 && (
								<Button
									type="default"
									htmlType="button"
									className={styles.button}
									onClick={handleBack}>
									Anterior
								</Button>
							)}

							<Button type="primary" htmlType="submit">
								{currentPage === 3 ? 'Enviar' : 'Próximo'}
							</Button>
						</Form.Item>
					</div>
				</div>
			</Form>
		</div>
	)
}

export default AddTemplate
