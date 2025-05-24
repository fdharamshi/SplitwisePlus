import { createGlobalStyle } from 'styled-components';
import { darkTheme } from './theme';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: ${darkTheme.typography.fontSize};
    line-height: ${darkTheme.typography.lineHeight};
  }

  body {
    font-family: ${darkTheme.typography.fontFamily};
    background-color: ${darkTheme.background.primary};
    color: ${darkTheme.text.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: ${darkTheme.text.link};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: 1rem;
    color: ${({ theme }) => theme.text.primary};
    background-color: ${({ theme }) => theme.background.input};
    border: 1px solid ${({ theme }) => theme.ui.border};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.ui.focusBorder};
      box-shadow: 0 0 0 1px ${({ theme }) => theme.ui.focusBorder};
    }
  }

  button {
    background-color: ${({ theme }) => theme.background.button};
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.background.buttonHover};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

export default GlobalStyles;
