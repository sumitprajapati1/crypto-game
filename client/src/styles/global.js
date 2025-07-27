import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #2c3e50;
    background-color: #f5f7fa;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  button {
    font-family: inherit;
  }
`;

export default GlobalStyle;