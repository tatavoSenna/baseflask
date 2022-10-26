import React from 'react'

import { ScrollContent } from '../styles'
import * as moment from 'moment'
import 'moment/locale/pt-br'
import { StyledMenu, ItemContainer } from './styles'
import { func, object } from 'prop-types'
import DocxVersion from './components/docxVersion'
import TxtVersion from './components/txtVersion'
import { useDispatch } from 'react-redux'
import { selectVersion } from 'states/modules/documentDetail'

moment.locale('pt-br')

const VersionView = ({ infos, downloadVersionHandler, downloadDocument }) => {
	const dispatch = useDispatch()
	const { text_type, versions, version_id } = infos
	const txtDocumentVersion = text_type === '.txt'

	const handleVersion = (id) => {
		dispatch(selectVersion({ id }))
	}

	return (
		<ScrollContent>
			<StyledMenu
				onClick={(item) =>
					txtDocumentVersion ? handleVersion(item.key) : undefined
				}
				$docxverification={txtDocumentVersion}
				selectedKeys={[version_id]}
				mode="vertical">
				{versions.map((item) => (
					<ItemContainer
						key={item.id}
						$propscolor={item.id === version_id}
						$propsdifferentpadding={txtDocumentVersion}
						$propsbordertop={txtDocumentVersion}>
						{txtDocumentVersion ? (
							<TxtVersion
								item={item}
								moment={moment}
								onDownload={downloadVersionHandler}
							/>
						) : (
							<DocxVersion
								item={item}
								versions={versions}
								moment={moment}
								onDonload={downloadDocument}
							/>
						)}
					</ItemContainer>
				))}
			</StyledMenu>
		</ScrollContent>
	)
}

export default VersionView

VersionView.propTypes = {
	infos: object,
	handleVersion: func,
	downloadVersionHandler: func,
	downloadDocument: func,
}
