import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import AuthWrapper from '~/components/authWrapper'
import RedirectNewUser from '~/components/redirectNewUser'

import Contracts from './pages/contracts'
import AddContract from './pages/addContract'
import Docusign from './pages/docusign'
import Users from './pages/users'
import NewUser from './pages/newuser'
import Templates from './pages/templates'
import EditTemplate from './pages/editTemplate'
import DocumentDetails from './pages/documentDetails'
import AddContractExternal from './pages/addContractExternal'
import Settings from './pages/settings'
import Companies from './pages/companies'
import Home from './pages/home'
import EditDocument from 'pages/editDocument'
import Databases from 'pages/databases'
import DatabaseDetails from 'pages/databaseDetails'

export const ROUTES = {
	docusign: '/docusign-token',
	home: '/',
	documents: '/documents',
	form: '/documents/new',
	users: '/users',
	newuser: '/newuser',
	templates: '/models',
	newTemplate: '/models/new',
	editTemplate: '/models/edit',
	documentDetails: '/documents/:id(\\d+)',
	editDocumentDetails: '/documents/:id/edit',
	externalContract: '/documentcreate/:token',
	databases: '/databases',
	databaseDetails: '/databases/:id(\\d+)',
	settings: '/settings',
	companies: '/companies',
}

function Routes() {
	return (
		<Router>
			<Switch>
				<Route path={ROUTES.externalContract} component={AddContractExternal} />
				<Route path={ROUTES.docusign} component={Docusign} />
				<AuthWrapper>
					<Route exact path={ROUTES.home} component={Home} />
					<Route exact path={ROUTES.newuser} component={NewUser} />
					<RedirectNewUser>
						<Route exact path={ROUTES.form} component={AddContract} />
						<Route exact path={ROUTES.documents} component={Contracts} />
						<Route exact path={ROUTES.templates} component={Templates} />
						<Route exact path={ROUTES.newTemplate} component={EditTemplate} />
						<Route exact path={ROUTES.editTemplate} component={EditTemplate} />
						<Route exact path={ROUTES.users} component={Users} />
						<Route
							exact
							path={ROUTES.documentDetails}
							component={DocumentDetails}
						/>
						<Route
							exact
							path={ROUTES.editDocumentDetails}
							component={EditDocument}
						/>
						<Route exact path={ROUTES.databases} component={Databases} />
						<Route
							exact
							path={ROUTES.databaseDetails}
							component={DatabaseDetails}
						/>
						<Route
							exact
							path={ROUTES.companies}
							component={Companies}
							isPrivate
						/>
						<Route exact path={ROUTES.settings} component={Settings} />
					</RedirectNewUser>
				</AuthWrapper>
			</Switch>
		</Router>
	)
}

export default Routes
