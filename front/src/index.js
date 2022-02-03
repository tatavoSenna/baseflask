import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

const envTag = process.env.REACT_APP_ENVIRONMENT_TAG
if (envTag && envTag !== 'local') {
	Sentry.init({
		dsn: process.env.REACT_APP_SENTRY_DSN,
		integrations: [new Integrations.BrowserTracing()],
		tracesSampleRate: envTag === 'develop' ? 1.0 : 0.7,
		environment: envTag,
	})
}

ReactDOM.render(<App />, document.getElementById('root'))
