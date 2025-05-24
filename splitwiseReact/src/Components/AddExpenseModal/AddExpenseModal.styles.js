import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  width: 90vw;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: ${({ theme }) => theme.shadow.large};
  z-index: 1001;
  display: flex;
  flex-direction: row;
  border: 1px solid ${({ theme }) => theme.ui.border};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.background.tertiary};
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text.secondary};
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  
  &:hover {
    color: ${({ theme }) => theme.text.primary};
    background: ${({ theme }) => theme.background.active};
  }
`;

export const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.ui.border};
  background-color: ${({ theme }) => theme.background.tertiary};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  flex-grow: 1;
  overflow-y: auto;
  max-height: 80vh;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${theme.ui.border} ${theme.background.tertiary}`};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background.tertiary};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.ui.border};
    border-radius: 20px;
    border: 2px solid ${({ theme }) => theme.background.tertiary};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
  
  ${FormGroup}:focus-within & {
    color: ${({ theme }) => theme.text.link};
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.ui.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.status.info};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.ui.focusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.ui.focusBorder}40`};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.ui.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.background.input};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.status.info};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.ui.focusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.ui.focusBorder}40`};
  }
  
  option {
    background-color: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const FormButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.background.button};
  color: ${({ theme }) => theme.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadow.small};
  
  &:hover {
    background-color: ${({ theme }) => theme.background.buttonHover};
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
  }
  
  &.secondary {
    background-color: ${({ theme }) => theme.background.tertiary};
    border: 1px solid ${({ theme }) => theme.ui.border};
    
    &:hover {
      background-color: ${({ theme }) => theme.background.hover};
    }
  }
  
  &.success {
    background-color: ${({ theme }) => theme.status.success};
    
    &:hover {
      background-color: ${({ color, theme }) => theme.status.success}dd;
    }
  }
  
  &.danger {
    background-color: ${({ theme }) => theme.status.error};
    
    &:hover {
      background-color: ${({ theme }) => theme.status.error}dd;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const FormSide = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 65%;
  border-right: 1px solid ${({ theme }) => theme.ui.border};
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${theme.ui.border} transparent`};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.ui.border};
    border-radius: 20px;
  }
`;

export const ReceiptSide = styled.div`
  width: 35%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.background.tertiary};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  max-height: 90vh;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -10px;
    width: 10px;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.background.tertiary});
    z-index: 1;
  }
`;

export const ReceiptTitle = styled.h3`
  color: ${({ theme }) => theme.text.primary};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px dashed ${({ theme }) => theme.ui.border};
  text-align: center;
`;

export const ReceiptItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.ui.border};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadow.small};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.medium};
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const ItemName = styled.span`
  flex: 1;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`;

export const ItemPrice = styled.span`
  color: ${({ theme }) => theme.text.accent || theme.text.primary};
  font-weight: 600;
`;

export const ItemDetails = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

export const MembersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const MemberTag = styled.span`
  font-size: 0.75rem;
  background-color: ${({ theme }) => theme.background.tag || '#e9ecef'};
  color: ${({ theme }) => theme.text.secondary};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

export const TotalSection = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 2px dashed ${({ theme }) => theme.ui.border};
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &.grand-total {
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: ${({ theme }) => theme.spacing.sm};
    padding-top: ${({ theme }) => theme.spacing.sm};
    border-top: 1px solid ${({ theme }) => theme.ui.border};
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const SaveButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export const SaveButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.background.button};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.background.buttonHover};
  }
`;
