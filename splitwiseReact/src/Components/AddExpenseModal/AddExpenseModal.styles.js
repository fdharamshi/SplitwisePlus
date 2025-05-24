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
  
  @media (max-width: 768px) {
    background-color: transparent;
    backdrop-filter: none;
  }
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
    top: 0;
    left: 0;
    transform: none;
    border-radius: 0;
    border: none;
  }
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
  
  @media (max-width: 768px) {
    top: 12px;
    left: 12px;
    right: auto;
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
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
  border-right: 1px solid ${({ theme }) => theme.ui.border};
  overflow-y: auto;
  min-width: 65%;
  max-width: 65%;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    min-width: 100%;
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.ui.border};
    display: ${({ activeTab, isMobile }) => isMobile && activeTab !== 'form' ? 'none' : 'flex'};
    max-height: ${({ isMobile }) => isMobile ? 'calc(95vh - 60px)' : 'auto'};
    padding-bottom: 120px; /* Add bottom padding for better scrolling on mobile */
  }
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
  min-width: 35%;
  max-width: 35%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.background.tertiary};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  max-height: 90vh;
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    display: ${({ activeTab, isMobile }) => isMobile && activeTab !== 'receipt' ? 'none' : 'flex'};
    max-height: ${({ isMobile }) => isMobile ? 'calc(95vh - 60px)' : '90vh'};
    padding-bottom: 120px; /* Add bottom padding for better scrolling on mobile */
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -10px;
    width: 10px;
    height: 100%;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.background.tertiary});
    z-index: 1;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const ReceiptTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.text.primary};
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: ${({ theme }) => theme.spacing.sm} 0;
    padding: ${({ theme }) => theme.spacing.xs} 0;
  }
`;

export const ReceiptItem = styled.div`
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.small};
  border: 1px solid ${({ theme }) => theme.ui.border};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    width: 100%;
    box-sizing: border-box;
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const ItemName = styled.span`
  flex: 1;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
`;

export const ItemPrice = styled.span`
  color: ${({ theme }) => theme.text.accent || theme.text.primary};
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.05rem;
    margin-left: ${({ theme }) => theme.spacing.sm};
  }
`;

export const ItemDetails = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  
  @media (max-width: 768px) {
    font-size: 0.925rem;
    margin: ${({ theme }) => theme.spacing.sm} 0;
    padding: 0 ${({ theme }) => theme.spacing.xs};
  }
`;

export const MembersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: 768px) {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

export const MemberTag = styled.span`
  display: inline-flex;
  align-items: center;
  background: ${({ theme }) => theme.background.tag};
  color: ${({ theme }) => theme.text.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.85rem;
  margin-right: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`};
  }
`;

export const TotalSection = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 2px dashed ${({ theme }) => theme.ui.border};
  
  @media (max-width: 768px) {
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding-top: ${({ theme }) => theme.spacing.sm};
  }
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.xs};
    font-size: 1rem;
  }
  
  &.grand-total {
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: ${({ theme }) => theme.spacing.sm};
    padding-top: ${({ theme }) => theme.spacing.sm};
    border-top: 1px solid ${({ theme }) => theme.ui.border};
    color: ${({ theme }) => theme.text.primary};
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
      margin-top: ${({ theme }) => theme.spacing.md};
      padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xs};
    }
  }
`;

export const SaveButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: center;
  
  @media (max-width: 768px) {
    margin-top: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing.lg};
  }
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
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    font-size: 1.1rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.background.buttonHover};
  }
`;
