import React from 'react';
import styled from 'styled-components';

const TabContainer = styled.div`
  display: none;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.ui.border};
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.background.secondary};
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, active }) => 
    active ? theme.background.button : theme.background.tertiary};
  color: ${({ theme, active }) => 
    active ? theme.text.primary : theme.text.secondary};
  border: none;
  border-bottom: 2px solid ${({ theme, active }) => 
    active ? theme.status.info : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${({ active }) => active ? '600' : '400'};
  font-size: 0.9rem;
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.background.button : theme.background.hover};
  }
`;

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <TabContainer>
      <TabButton 
        active={activeTab === 'form'} 
        onClick={() => onTabChange('form')}
      >
        Add Expense
      </TabButton>
      <TabButton 
        active={activeTab === 'receipt'} 
        onClick={() => onTabChange('receipt')}
      >
        Receipt Summary
      </TabButton>
    </TabContainer>
  );
};

export default TabNavigation;
