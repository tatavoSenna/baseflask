import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import AdminRoute from './services/AdminRoutes'

import Token from './pages/token'
import Contracts from './pages/contracts'
import AddContract from './pages/addContract'
import Docusign from './pages/docusign'
import Users from './pages/users'
import Templates from './pages/templates'
import AddTemplate from './pages/addTemplate'
import DocumentDetails from './pages/documentDetails'
import Integrations from './pages/integrations'

import Wrapper from '~/components/wrapper'

export const ROUTES = {
	token: '/token',
	docusign: '/docusign-token',
	home: '/',
	contracts: '/contracts',
	form: '/contracts/new',
	users: '/users',
	templates: '/templates',
	newTemplate: '/templates/new',
	documentDetails: '/documentDetails',
	integrations: '/integrations',
}

function Routes() {
	return (
		<Router>
			<Switch>
				<AdminRoute path={ROUTES.token} component={Token} />
				<AdminRoute path={ROUTES.docusign} component={Docusign} isPrivate />
				<Wrapper>
					<AdminRoute
						exact
						path={ROUTES.form}
						component={AddContract}
						isPrivate
					/>
					<AdminRoute
						exact
						path={ROUTES.home}
						component={Contracts}
						isPrivate
					/>
					<AdminRoute exact path={ROUTES.users} component={Users} isPrivate />
					<AdminRoute
						exact
						path={ROUTES.templates}
						component={Templates}
						isPrivate
					/>
					<AdminRoute
						exact
						path={ROUTES.newTemplate}
						component={AddTemplate}
						isPrivate
					/>
					<AdminRoute
						exact
						path={ROUTES.documentDetails}
						component={DocumentDetails}
						isPrivate
					/>
					<AdminRoute
						exact
						path={ROUTES.integrations}
						component={Integrations}
						isPrivate
					/>
				</Wrapper>
			</Switch>
		</Router>
	)
}

export default Routes
