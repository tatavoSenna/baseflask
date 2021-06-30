//import 'normalize.css'
import { createGlobalStyle } from 'styled-components'

import colors from './colors'
import fonts from './fonts'

const GlobalStyle = createGlobalStyle`

	#root {
		height: 100%;
	}

  :root {
    --amplify-primary-color: rgb(24, 144, 255);
    --amplify-primary-tint: #0;
    --amplify-primary-shade: #0;

    --amplify-font-family: 'Open Sans'
  }

  html {
    font-size: 16px;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
		height: 100%;
  }

  body {
		height: 100%;
    color: ${colors.black};
    font-family: ${fonts.sans.name}, sans-serif;
    margin: 0;
    background-color: ${colors.white};
  }

  a {
    color: inherit;
		text-decoration: none;
  }

	input {
		outline: none;
	}

  button,
  summary {
    cursor: pointer;
  }

`

export default GlobalStyle
