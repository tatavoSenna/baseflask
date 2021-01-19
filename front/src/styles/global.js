//import 'normalize.css'
import { createGlobalStyle } from 'styled-components'

import colors from './colors'
import fonts from './fonts'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');

	#root {
		height: 100%;
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

  tr.ant-table-row.ant-table-row-level-0 {
      cursor: pointer;
  }
`

export default GlobalStyle
