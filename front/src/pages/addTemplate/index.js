import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Menu, Form, Button, PageHeader, Layout } from 'antd'
import {
	FormOutlined,
	NodeIndexOutlined,
	FileTextOutlined,
	TeamOutlined,
} from '@ant-design/icons'
import {
	postTemplateAppend,
	postTemplateRequest,
} from '~/states/modules/postTemplate'

import BreadCrumb from '~/components/breadCrumb'
import TemplateForm from './components/form'
import Workflow from './components/workflow'
import Signers from './components/signers'
import Text from './components/text'

import styles from './index.module.scss'

function AddTemplate() {
	const { data } = useSelector(({ postTemplate }) => postTemplate)
	const { current } = useHistory().location.state
	const dispatch = useDispatch()
	const history = useHistory()
	const [form] = Form.useForm()
	const [inputsFilled, setInputsFilled] = useState(false)

	const handleNav = (e) => {
		history.push({
			pathname: `/templates/new/`,
			state: { current: e.key },
		})
	}

	const onSubmit = () => {
		dispatch(postTemplateRequest())
	}

	const updateForm = (e, name) => {
		const value = e.target.value
		dispatch(postTemplateAppend({ name, value }))
	}

	const props = { data, updateForm }

	useEffect(() => {
		setInputsFilled(
			!(data.form === '') &&
				!(data.workflow === '') &&
				!(data.text === '') &&
				!(data.signers === '')
		)
	}, [data])

	return (
		<Layout style={{ backgroundColor: '#fff' }}>
			<PageHeader>
				<BreadCrumb parent="Templates" current={data.title} />
			</PageHeader>
			<Menu onClick={handleNav} selectedKeys={[current]} mode="horizontal">
				<Menu.Item
					key="form"
					className={data.form === '' ? styles.empty : undefined}
					icon={<FormOutlined />}>
					Formulário
				</Menu.Item>
				<Menu.Item
					key="workflow"
					className={data.workflow === '' ? styles.empty : undefined}
					icon={<NodeIndexOutlined />}>
					Workflow
				</Menu.Item>
				<Menu.Item
					key="text"
					className={data.text === '' ? styles.empty : undefined}
					icon={<FileTextOutlined />}>
					Texto
				</Menu.Item>
				<Menu.Item
					key="signers"
					className={data.signers === '' ? styles.empty : undefined}
					icon={<TeamOutlined />}>
					Assinantes
				</Menu.Item>
			</Menu>
			<Layout className={styles.content}>
				<Form
					form={form}
					layout="horizontal"
					hideRequiredMark
					onFinish={onSubmit}>
					{current === 'form' && <TemplateForm {...props} />}
					{current === 'workflow' && <Workflow {...props} />}
					{current === 'text' && <Text {...props} />}
					{current === 'signers' && <Signers {...props} />}
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className={styles.button}
							disabled={!inputsFilled}>
							Enviar
						</Button>
					</Form.Item>
				</Form>
			</Layout>
		</Layout>
	)
}

export default AddTemplate
