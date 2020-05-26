import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import AdminRoute from './services/AdminRoutes'

import Login from './pages/login'
import Home from './pages/home'
import Contracts from './pages/contracts'
import AddContract from './pages/addContract'
import StepForm from './pages/form'

import Wrapper from '~/components/wrapper'

export const ROUTES = {
	login: '/login',
	home: '/',
	contracts: '/contracts',
	addContract: '/addContracts',
	form: '/form/:current',
}

function Routes() {
	return (
		<Router>
			<Switch>
				<AdminRoute path={ROUTES.login} component={Login} />
				<Wrapper>
					<AdminRoute exact path={ROUTES.home} component={Home} isPrivate />
					<AdminRoute
						exact
						path={ROUTES.contracts}
						component={Contracts}
						isPrivate
					/>
					<AdminRoute // TODO remove
						exact
						path={ROUTES.addContract}
						component={AddContract}
						isPrivate
					/>
					<AdminRoute exact path={ROUTES.form} component={StepForm} isPrivate />
				</Wrapper>
			</Switch>
		</Router>
	)
}

export default Routes
