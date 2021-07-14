import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Hub } from 'aws-amplify'

import Contracts from './pages/contracts'
import AddContract from './pages/addContract'
import Docusign from './pages/docusign'
import Users from './pages/users'
import Templates from './pages/templates'
import EditTemplate from './pages/editTemplate'
import DocumentDetails from './pages/documentDetails'
import Integrations from './pages/integrations'
import AddContractExternal from './pages/addContractExternal'
import Settings from './pages/settings'
import Companies from './pages/companies'

import Wrapper from '~/components/wrapper'

import { getUserProfile } from '~/states/modules/session'
import { store } from '~/states/store'

export const ROUTES = {
	docusign: '/docusign-token',
	home: '/',
	contracts: '/contracts',
	form: '/contracts/new',
	users: '/users',
	templates: '/templates',
	newTemplate: '/templates/new',
	editTemplate: '/templates/edit',
	documentDetails: '/documentDetails',
	integrations: '/integrations',
	externalContract: '/documentcreate/:token',
	settings: '/settings',
	companies: '/companies',
}

Hub.listen('auth', (data) => {
	switch (data.payload.event) {
		case 'signIn':
			store.dispatch(getUserProfile())
			break
		default:
			break
	}
})

function Routes() {
	return (
		<Router>
			<Switch>
				ƒ
				<Route path={ROUTES.externalContract} component={AddContractExternal} />
				<Route path={ROUTES.docusign} component={Docusign} />
				<Wrapper>
					<Route exact path={ROUTES.form} component={AddContract} />
					<Route exact path={ROUTES.home} component={Contracts} />
					<Route exact path={ROUTES.users} component={Users} />
					<Route exact path={ROUTES.templates} component={Templates} />
					<Route exact path={ROUTES.newTemplate} component={EditTemplate} />
					<Route exact path={ROUTES.editTemplate} component={EditTemplate} />
					<Route
						exact
						path={ROUTES.documentDetails}
						component={DocumentDetails}
					/>
					<Route
						exact
						path={ROUTES.companies}
						component={Companies}
						isPrivate
					/>
					<Route exact path={ROUTES.integrations} component={Integrations} />
					<Route exact path={ROUTES.settings} component={Settings} />
				</Wrapper>
			</Switch>
		</Router>
	)
}

export default Routes
