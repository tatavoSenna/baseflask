import { Button, Form, Modal, Select, Typography } from 'antd'
import { bool, func, number, object } from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCompanyList } from 'states/modules/companies'

import styled from 'styled-components'

const { Title } = Typography
const { Option } = Select

const DuplicateTemplateModal = ({
	showModal,
	handleCancel,
	currentCompany,
	handleDuplicate,
	template,
}) => {
	const dispatch = useDispatch()
	const [form] = Form.useForm()

	const { companyList } = useSelector(({ companies }) => companies)

	const [value, setValue] = useState(`${currentCompany}`)

	useEffect(() => {
		dispatch(getCompanyList())
	}, [dispatch])

	const getFooterModal = () => (
		<FooterWrapper>
			<Button onClick={handleCancel}>Cancelar</Button>
			<Button
				style={{ marginLeft: 30 }}
				onClick={() => handleDuplicate(template, value)}>
				Copiar
			</Button>
		</FooterWrapper>
	)
	return (
		<StyledModal
			visible={showModal}
			onCancel={handleCancel}
			closable={false}
			footer={null}
			width={450}>
			<Form form={form}>
				<StyledTitle level={4}>Copiar Template</StyledTitle>
				<NewDivider />
				<Form.Item label="Template">
					<Select
						style={{ width: '90%' }}
						defaultValue={`${currentCompany}`}
						onChange={(value) => setValue(value)}>
						{companyList.map((company) => (
							<Option key={company.id} value={company.id}>
								{company.name}
							</Option>
						))}
					</Select>
				</Form.Item>
				<NewDivider />
				{getFooterModal()}
			</Form>
		</StyledModal>
	)
}

DuplicateTemplateModal.propTypes = {
	showModal: bool,
	handleCancel: func,
	currentCompany: number,
	handleDuplicate: func,
	template: object,
}

export default DuplicateTemplateModal

const StyledTitle = styled(Title)`
	color: rgba(0, 0, 0, 0.45);
	text-align: center;
	margin-bottom: 0;
`

const NewDivider = styled.div`
	background: rgba(0, 0, 0, 0.25);
	height: 0.8px;
	margin: 28px 0;
`

const FooterWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
`

const StyledModal = styled(Modal)`
	.ant-modal-body {
		padding: 28px;
	}
`
