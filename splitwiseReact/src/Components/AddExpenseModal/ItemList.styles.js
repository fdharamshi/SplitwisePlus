import styled from 'styled-components';

export const ItemListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

export const FormSection = styled.div`
  background-color: ${({ theme }) => theme.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.small};
  border: 1px solid ${({ theme }) => theme.ui.border};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.medium};
    border-color: ${({ theme }) => theme.ui.focusBorder};
  }
`;

export const SectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: ${({ theme }) => theme.status.info};
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

export const FormField = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.ui.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  transition: all 0.2s ease;
  height: 40px;
  
  &:hover {
    border-color: ${({ theme }) => theme.status.info};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.ui.focusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.ui.focusBorder}40`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.text.secondary};
    opacity: 0.7;
  }
`;

export const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme, variant }) => 
    variant === 'secondary' 
      ? theme.background.tertiary 
      : variant === 'danger' 
        ? theme.status.error 
        : theme.background.button};
  color: ${({ theme }) => theme.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  box-shadow: ${({ theme }) => theme.shadow.small};
  
  &:hover {
    background-color: ${({ theme, variant }) => 
      variant === 'secondary' 
        ? theme.background.hover 
        : variant === 'danger' 
          ? `${theme.status.error}dd` 
          : theme.background.buttonHover};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow.medium};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadow.small};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.ui.border};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
  
  svg {
    margin-right: ${({ theme, iconOnly }) => iconOnly ? '0' : theme.spacing.xs};
  }
  
  &.danger {
    background-color: ${({ theme }) => theme.status.error};
    
    &:hover {
      background-color: #d32f2f;
    }
  }
`;

export const ItemCard = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.ui.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const ItemTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.text.primary};
`;

export const MemberList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

export const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme, type }) => 
    type === 'increase' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
  color: ${({ theme, type }) => 
    type === 'increase' ? theme.status.success : theme.status.error};
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;
  margin: 0 4px;
  padding: 0;
  line-height: 1;
  
  &:hover {
    background-color: ${({ theme, type }) => 
      type === 'increase' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'};
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const MemberChip = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme, included, active }) => 
    included || active ? theme.background.button : theme.background.tertiary};
  color: ${({ theme, included, active }) => included || active ? 'white' : theme.text.primary};
  border-radius: 20px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  padding-right: ${({ theme, included }) => included ? theme.spacing.xs : theme.spacing.sm};
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme, included, active }) => 
    included || active ? theme.background.buttonHover : theme.ui.border};
  box-shadow: ${({ theme, included, active }) => 
    included || active ? theme.shadow.small : 'none'};
  margin: 4px;
  position: relative;
  overflow: visible;
  
  &:hover {
    background-color: ${({ theme, included, active }) => 
      included || active ? theme.background.buttonHover : theme.background.hover};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadow.medium};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 4px;
    background-color: ${({ theme, included, active }) => 
      included || active ? theme.status.success : 'transparent'};
  }
  
  .member-name {
    margin: 0 ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
  }
  
  .share-count {
    background-color: ${({ theme }) => theme.background.tertiary};
    color: ${({ theme }) => theme.text.primary};
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    margin-left: 4px;
  }
  
  .share-controls {
    display: flex;
    align-items: center;
    margin-left: 4px;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.ui.border};
  margin: ${({ theme }) => `${theme.spacing.md} 0`};
`;

export const TotalAmount = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border-left: 3px solid ${({ theme }) => theme.status.info};
  
  div {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: 1rem;
  }
  
  strong {
    font-size: 1.1rem;
    color: ${({ theme }) => theme.status.info};
  }
  color: ${({ theme }) => theme.text.primary};
  margin: ${({ theme }) => `${theme.spacing.md} 0`};
  text-align: right;
`;
