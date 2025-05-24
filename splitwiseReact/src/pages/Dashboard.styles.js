import styled from 'styled-components';

export const DashboardContainer = styled.div`
  background-color: ${({ theme }) => theme.background.primary};
  min-height: 100vh;
  color: ${({ theme }) => theme.text.primary};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.ui.border};
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

export const TabsContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.ui.border};
`;

export const Tab = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: ${({ theme, active }) => active ? theme.text.primary : theme.text.secondary};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  margin-right: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    color: ${({ theme }) => theme.text.primary};
    border-bottom-color: ${({ theme }) => theme.ui.border};
  }
  
  ${({ active, theme }) => active && `
    border-bottom-color: ${theme.ui.focusBorder};
    font-weight: 500;
  `}
`;

export const ContentContainer = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadow.small};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text.secondary};
`;

export const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.background.input};
  border: 1px solid ${({ theme }) => theme.ui.border};
  color: ${({ theme }) => theme.text.primary};
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.ui.focusBorder};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.ui.focusBorder};
  }
`;

export const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.background.button};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: flex-end;
  
  &:hover {
    background-color: ${({ theme }) => theme.background.buttonHover};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
