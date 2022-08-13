import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
	Form,
	Typography,
	Button,
	Spin,
	Menu,
	Steps as StepsAntd,
	Space,
} from 'antd'
import { DownloadOutlined, EditOutlined } from '@ant-design/icons'
import {
	array,
	bool,
	func,
	string,
	object,
	number,
	arrayOf,
	shape,
} from 'prop-types'

import { ContainerTabs, ScrollContent } from './styles'
import styles from './index.module.scss'
import './step.css'
import * as moment from 'moment'
import 'moment/locale/pt-br'
import styled from 'styled-components'
import {
	downloadTextDocumentVersion,
	cancelDocument,
} from '~/states/modules/documentDetail'
import InfoView from './infoView'

moment.locale('pt-br')

const { Title, Text, Paragraph } = Typography
const tailLayout = {
	wrapperCol: { span: 24 },
}
const { Step } = StepsAntd

const Tabs = ({
	textType,
	downloadDocument,
	signers,
	versions,
	infos,
	showAssignModal,
	showStepModal,
	sent,
	signed,
	handleVersion,
	sentAssign,
	loadingSign,
	versionId,
	steps,
	current,
	onClickPrevious,
	onClickNext,
	onClickDownload,
	block,
	signedWorkflow,
	text,
	textUpdate,
	onClickUpdate,
	blockVersion,
	versionLoading,
	downloadButton,
}) => {
	const dispatch = useDispatch()
	const [value, setValue] = useState('1')
	const [isVariables, setVariables] = useState(false)
	const { id } = useParams()

	const downloadVersionHandler = (event, item) => {
		event.stopPropagation()
		const versionInfo = {
			id,
			versionId: item.id,
			versionName: item.description,
			documentTitle: documentDetailData.title,
		}

		dispatch(downloadTextDocumentVersion(versionInfo))
	}

	const cancelDocumentHandler = () => {
		dispatch(cancelDocument(infos.id))
	}

	const cancelledDocument = useSelector(
		({ documentDetail }) => documentDetail.cancelledDocument
	)

	const { data: documentDetailData } = useSelector(
		({ documentDetail }) => documentDetail
	)

	/**
	 * Checks if we can change the variables values of a .txt document.
	 *
	 * Currently, we only allow the update of variables in a txt document if the document has never received a update that changes its content.
	 *
	 * @param {*} versions
	 *
	 */
	const canDocumentChangeVariables = (versions) => {
		for (let i = 0; i < versions.length; i++) {
			// If the version is not the "Version 0" and changes something other than the document variables values...
			if (!versions[i].only_updated_variables) {
				return false
			}
		}
		return true
	}

	const tab = (option) => {
		if (option === '1') {
			return (
				<InfoView
					infos={infos}
					textType={textType}
					cantItChangeVariablesValues={canDocumentChangeVariables(versions)}
				/>
			)
		} else if (option === '2') {
			return version()
		} else if (option === '3') {
			return workflow()
		} else {
			return assign()
		}
	}

	if (!sent) {
		signers.map((item) =>
			item.fields.map((field) => {
				if (field.valueVariable && !isVariables) {
					setVariables(true)
				}
				return null
			})
		)
	}

	const version = () => {
		const disableButton = !(
			text !== textUpdate.text &&
			!blockVersion &&
			!versionLoading
		)
		const isItNotDocX = !(textType === '.docx')

		return (
			<ScrollContent>
				{isItNotDocX && (
					<div
						style={{ display: 'flex', justifyContent: 'left', paddingTop: 20 }}>
						<Form.Item>
							<Button
								type="primary"
								htmlType="button"
								onClick={() => onClickUpdate(textUpdate)}
								disabled={disableButton}>
								Criar nova versão
							</Button>
						</Form.Item>
					</div>
				)}

				<StyledMenu
					onClick={(item) =>
						isItNotDocX ? handleVersion(item.key) : undefined
					}
					$docxverification={isItNotDocX}
					selectedKeys={[versionId]}
					mode="vertical">
					{versions.map((item) => (
						<ItemContainer
							key={item.id}
							$propscolor={item.id === versionId}
							$propsdifferentpadding={isItNotDocX}
							$propsbordertop={isItNotDocX}>
							{isItNotDocX ? (
								<ContainerDiv>
									<ContainerIcon>
										<StyledText style={{ fontSize: 14 }}>
											{item.description}
										</StyledText>
										<Button
											shape="circle"
											icon={<DownloadOutlined />}
											htmlType="button"
											onClick={(event) => downloadVersionHandler(event, item)}
											onMouseDown={(event) => event.preventDefault()}
										/>
									</ContainerIcon>
									<StyledText style={{ display: 'block', padding: '5px 0' }}>
										Por: <StyledText>{item.created_by}</StyledText>
									</StyledText>
								</ContainerDiv>
							) : (
								<ContainerIcon
									$changeopacity={
										item.id === Object.keys(versions)[versions.length - 1]
									}>
									<StyledText style={{ padding: '0 0 5px', fontSize: 14 }}>
										Por:{' '}
										<StyledText style={{ fontSize: 14 }}>
											{item.email}
										</StyledText>
									</StyledText>
									{item.id === Object.keys(versions)[versions.length - 1] && (
										<DownloadIcon
											style={{ fontSize: 25, padding: 5 }}
											onClick={(e) => {
												e.stopPropagation()
												downloadDocument()
											}}
										/>
									)}
								</ContainerIcon>
							)}
							<StyledText
								$changeopacity={
									!isItNotDocX
										? item.id === Object.keys(versions)[versions.length - 1]
											? true
											: 'otherversion'
										: undefined
								}>
								Data:{' '}
								<StyledText>
									{moment(item.created_at).format('DD/MM/YYYY')}
								</StyledText>
							</StyledText>
						</ItemContainer>
					))}
				</StyledMenu>
			</ScrollContent>
		)
	}

	const getStepDescription = (item, index, current) => {
		if (index < current) {
			return (
				<span style={{ fontSize: 12, lineHeight: 1.5 }}>
					Aprovado por:{' '}
					<span style={{ fontWeight: 'bold' }}>{item.changed_by}</span>
				</span>
			)
		}
		if (index === current) {
			let responsibleUsers = item.responsible_users.map((user) => {
				return user.name
			})
			if (item.due_date) {
				const dateFormatter = (date) => {
					if (!date) {
						return null
					}

					var yearMonth = date.split('-')
					var day = yearMonth[2].split('T')
					return day[0] + '/' + yearMonth[1] + '/' + yearMonth[0]
				}
				const dateNow = () => {
					var data = new Date(),
						dia = data.getDate().toString(),
						diaF = dia.length === 1 ? '0' + dia : dia,
						mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
						mesF = mes.length === 1 ? '0' + mes : mes,
						anoF = data.getFullYear()
					return diaF + '/' + mesF + '/' + anoF
				}
				function process(date) {
					var parts = date.split('/')
					return new Date(parts[2], parts[1] - 1, parts[0])
				}
				const date = dateFormatter(item.due_date)
				const verifyPastDue = (date1, date2) => {
					return process(date1) > process(date2)
				}
				return (
					<span style={{ fontSize: 12, lineHeight: 1.5 }}>
						Prazo:{' '}
						<span
							style={
								verifyPastDue(dateNow(), date)
									? { fontWeight: 'bold', color: 'red' }
									: { fontWeight: 'bold' }
							}>
							{date}
						</span>
						<br />
						Grupo: <span style={{ fontWeight: 'bold' }}>{item.group.name}</span>
						<br />
						Responsáveis:{' '}
						<span style={{ fontWeight: 'bold' }}>
							{responsibleUsers.join(', ')}
						</span>
					</span>
				)
			}
			return (
				<span style={{ fontSize: 12, lineHeight: 1.5 }}>
					Grupo: <span style={{ fontWeight: 'bold' }}>{item.group.name}</span>
					<br />
					Responsáveis:{' '}
					<span style={{ fontWeight: 'bold' }}>
						{responsibleUsers.join(', ')}
					</span>
				</span>
			)
		}
	}

	const getStepTitle = (item, index, current) => {
		if (index === current) {
			return (
				<span style={{ color: '#1890ff', fontSize: 18, fontWeight: '500' }}>
					{item.title}{' '}
					<EditOutlined
						style={{ padding: 2 }}
						onClick={() => showStepModal()}
					/>
				</span>
			)
		}
		return (
			<span style={{ fontSize: 18, fontWeight: '500', whiteSpace: 'nowrap' }}>
				{item.title}
			</span>
		)
	}

	const workflow = () => (
		<ScrollContent>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					padding: 24,
					paddingRight: 5,
					margin: 5,
					minHeight: 200,
					background: '#fff',
				}}>
				<StepsAntd
					style={{
						marginTop: '5%',
						marginBottom: '5%',
					}}
					progressDot
					direction="vertical"
					current={current}
					labelPlacement="vertical">
					{steps.map((item, index) => (
						<Step
							style={{
								paddingBottom: '30px',
							}}
							key={index}
							title={getStepTitle(item, index, current)}
							subTitle={item.subTitle}
							description={getStepDescription(item, index, current)}
						/>
					))}
				</StepsAntd>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
					}}>
					<Form.Item {...tailLayout}>
						{current !== 0 && signedWorkflow !== true && (
							<Button
								type="default"
								htmlType="button"
								className={styles.button}
								onClick={onClickPrevious}
								disabled={block}>
								Reprovar
							</Button>
						)}
						{current !== steps.length - 1 && signedWorkflow !== true && (
							<Button
								type="primary"
								htmlType="button"
								onClick={onClickNext}
								disabled={block}>
								Aprovar
							</Button>
						)}
						{signedWorkflow === true && (
							<Button
								type="primary"
								htmlType="button"
								className={styles.button}
								onClick={onClickDownload}
								disabled={block}>
								Baixar Documento
							</Button>
						)}
					</Form.Item>
				</div>
			</div>
		</ScrollContent>
	)

	const assign = () => (
		<ScrollContent>
			{signers.map((item, index) => (
				<ContainerTabs key={index}>
					{index === 0 ? (
						<Title
							level={4}
							style={{ marginTop: 30, marginBottom: 10, fontSize: 18 }}>
							{item.party}
						</Title>
					) : null}
					{signers[index - 1] && item.party !== signers[index - 1].party ? (
						<Title
							level={4}
							style={{ marginTop: 10, marginBottom: 10, fontSize: 18 }}>
							{item.party}
						</Title>
					) : null}
					<DivContainer
						i={index}
						currentSigners={item.party}
						allSigners={signers}>
						<div>
							<Title style={{ fontSize: 18, fontWeight: 400 }}>
								{item.title}
							</Title>
							{item.fields.map((field, index) => (
								<div key={index}>
									<Paragraph style={{ color: '#000', fontSize: 12 }}>
										{field.value}:
										<Paragraph
											style={{
												color: `${
													!field.valueVariable ? '#e6e6e6' : '#646464'
												}`,
												fontSize: 12,
												display: 'inline',
												marginLeft: 5,
												fontWeight: `${!field.valueVariable ? 400 : 700}`,
											}}>
											{!field.valueVariable
												? 'Aguardando preenchimento dos dados'
												: field.valueVariable}
										</Paragraph>
									</Paragraph>
								</div>
							))}

							{sent && (
								<div>
									<Paragraph style={{ color: '#000', fontSize: 12 }}>
										Status:
										<Paragraph
											style={{
												color: '#646464',
												fontSize: 12,
												display: 'inline',
												marginLeft: 5,
											}}>
											{item.status}
										</Paragraph>
									</Paragraph>
								</div>
							)}
						</div>
					</DivContainer>
				</ContainerTabs>
			))}
			<div
				style={{
					display: 'flex',
					justifyContent: 'right',
					marginTop: 10,
				}}>
				<Form.Item {...tailLayout}>
					{!sent && (
						<Button
							key="editar"
							type="primary"
							className={styles.button}
							onClick={() => showAssignModal(true)}
							disabled={loadingSign}>
							Cadastrar
						</Button>
					)}
					{!sent && isVariables && (
						<Button
							key="assinar"
							type="primary"
							onClick={loadingSign ? () => {} : sentAssign}>
							{loadingSign ? <Spin spinning={loadingSign} /> : 'Assinar'}
						</Button>
					)}
					{sent && (
						<Space>
							{!signed && (
								<Button
									key="cancelar"
									type="primary"
									danger
									loading={cancelledDocument.loading}
									onMouseDown={(e) => e.preventDefault()}
									onClick={cancelDocumentHandler}>
									Cancelar Documento
								</Button>
							)}
							<Button key="assinar" type="primary" onClick={downloadButton}>
								Download do Certificado
							</Button>
						</Space>
					)}
				</Form.Item>
			</div>
		</ScrollContent>
	)

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: 24,
				margin: 5,
				height: 'calc(100% - 5px)',
				width: '35%',
				background: '#fff',
				alignItems: 'center',
				border: '1px solid #F0F0F0',
			}}>
			<Menu
				onClick={(e) => {
					setVariables(false)
					setValue(e.key)
				}}
				selectedKeys={[value]}
				mode="horizontal"
				style={{
					width: '100%',
				}}>
				<Menu.Item style={{ textAlign: 'center' }} key="1">
					Info
				</Menu.Item>
				<Menu.Item style={{ textAlign: 'center' }} key="2">
					Versões
				</Menu.Item>
				{steps.length > 0 && (
					<Menu.Item style={{ textAlign: 'center' }} key="3">
						Workflow
					</Menu.Item>
				)}
				{signers.length > 0 && (
					<Menu.Item style={{ textAlign: 'center' }} key="4">
						Assinantes
					</Menu.Item>
				)}
			</Menu>

			<div
				style={{
					padding: 10,
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}>
				{tab(value)}
			</div>
		</div>
	)
}

Tabs.propTypes = {
	textType: string,
	downloadDocument: func,
	signers: array,
	versions: array,
	infos: object,
	showAssignModal: func,
	showStepModal: func,
	handleVersion: func,
	sent: bool,
	signed: bool,
	sentAssign: func,
	loadingSign: bool,
	versionId: string,
	text: string,
	textUpdate: object,
	onClickUpdate: func,
	blockVersion: bool,
	versionLoading: bool,
	steps: arrayOf(
		shape({
			title: string.isRequired,
			subTitle: string,
			description: string,
		})
	).isRequired,
	current: number.isRequired,
	onClickPrevious: func.isRequired,
	onClickNext: func.isRequired,
	onClickDownload: func.isRequired,
	downloadButton: func,
	block: bool,
	signedWorkflow: bool,
}

export default Tabs

const DivContainer = styled.div`
	margin-left: 24px !important;
	padding: 30px 0 20px;

	${(props) =>
		props.allSigners[props.i - 1] &&
		props.i !== 0 &&
		props.currentSigners === props.allSigners[props.i - 1].party &&
		`
			border: solid #cccccc;
			border-width: 1px 0 0 0;
		`}
`

const StyledMenu = styled(Menu)`
	width: 100%;
	border: none;

	*:not(:first-child) {
		border-top: none;
	}

	* {
		margin: 0 !important;
	}

	*:hover {
		cursor: ${(props) =>
			props.$docxverification === true ? `pointer` : `default`};
	}
`

const StyledText = styled(Text)`
	font-size: 0.75rem;
	line-height: 2;
	color: #000;
	opacity: 0.65;

	opacity: ${(props) => props.$changeopacity === true && `1`};
	font-weight: ${(props) => props.$changeopacity === true && `700`};

	* {
		opacity: ${(props) => props.$changeopacity === true && `1`};
	}
`

const ItemContainer = styled(Menu.Item)`
	display: flex;
	flex-direction: column;
	justify-content: center;

	background-color: #ffffff !important;
	border: solid #cccccc;

	border-width: ${(props) =>
		props.$propsbordertop === true ? `1px 0` : `0 0 1px`} !important;
	border-width: ${(props) =>
		props.$propsbordertop === false ? `0 0 1px` : `1px 0`} !important;

	padding: ${(props) =>
		props.$propsdifferentpadding === false
			? `70px 5px`
			: `60px 5px`} !important;

	* {
		color: ${(props) => props.$propscolor && `#0099ff`};
		opacity: ${(props) => props.$propscolor && `1`};
	}
`

const ContainerIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	* {
		font-weight: ${(props) =>
			props.$changeopacity === true ? `700` : `500`} !important;
		opacity: ${(props) => props.$changeopacity === true && `1`};
	}
`

const ContainerDiv = styled.div`
	* {
		font-weight: 700 !important;
	}
`

const DownloadIcon = styled(DownloadOutlined)`
	*:hover {
		cursor: pointer;
	}
`
