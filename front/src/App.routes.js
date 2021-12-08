import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Contracts from './pages/contracts'
import AddContract from './pages/addContract'
import Docusign from './pages/docusign'
import Users from './pages/users'
import Templates from './pages/templates'
import EditTemplate from './pages/editTemplate'
import DocumentDetails from './pages/documentDetails'
import AddContractExternal from './pages/addContractExternal'
import Settings from './pages/settings'
import Companies from './pages/companies'
import Documentation from './pages/documentation'
import Home from './pages/home'

import AuthWrapper from '~/components/authWrapper'

export const ROUTES = {
	docusign: '/docusign-token',
	home: '/',
	documents: '/documents',
	form: '/documents/new',
	users: '/users',
	templates: '/templates',
	newTemplate: '/templates/new',
	editTemplate: '/templates/edit',
	documentDetails: '/documents/:id(\\d+)',
	externalContract: '/documentcreate/:token',
	settings: '/settings',
	companies: '/companies',
	documentation: '/docs',
}

function Routes() {
	return (
		<Router>
			<Switch>
				<Route path={ROUTES.externalContract} component={AddContractExternal} />
				<Route path={ROUTES.docusign} component={Docusign} />
				<AuthWrapper>
					<Route exact path={ROUTES.home} component={Home} />
					<Route exact path={ROUTES.form} component={AddContract} />
					<Route exact path={ROUTES.documents} component={Contracts} />
					<Route exact path={ROUTES.templates} component={Templates} />
					<Route exact path={ROUTES.newTemplate} component={EditTemplate} />
					<Route exact path={ROUTES.editTemplate} component={EditTemplate} />
					<Route exact path={ROUTES.users} component={Users} />
					<Route exact path={ROUTES.documentation} component={Documentation} />
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
					<Route exact path={ROUTES.settings} component={Settings} />
				</AuthWrapper>
			</Switch>
		</Router>
	)
}

export default Routes
