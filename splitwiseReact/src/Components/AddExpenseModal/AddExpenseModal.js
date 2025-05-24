import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ItemList from "./ItemList";
import { createGroupExpense } from "../../services/SplitwiseAPI";
import Select from 'react-select';
import { useDispatch } from "react-redux";
import { fetchExpenses } from "../../store/actions/asyncActions";
import { useTheme } from '../../theme/ThemeContext';
import TabNavigation from "./TabNavigation";
import {
  ModalOverlay,
  ModalContainer,
  CloseButton,
  ModalHeader,
  ModalTitle,
  ModalBody,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormButton,
  ButtonGroup,
  FormSide,
  ReceiptSide,
  ReceiptTitle,
  ReceiptItem,
  ItemHeader,
  ItemName,
  ItemPrice,
  ItemDetails,
  MembersList,
  MemberTag,
  TotalSection,
  TotalRow,
  SaveButtonContainer,
  SaveButton
} from "./AddExpenseModal.styles";

const AddExpenseModal = ({isOpen, onClose, groups, allFriends, categories}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <ModalOverlay onClick={onClose} />
            <ModalContainer onClick={e => e.stopPropagation()}>
                <CloseButton onClick={onClose}>
                    {window.innerWidth <= 768 ? '←' : '×'}
                </CloseButton>
                <ModalChildren groups={groups} onClose={onClose} allFriends={allFriends} categories={categories} />
            </ModalContainer>
        </>,
        document.getElementById('modal-root')
    );
};

const ModalChildren = (props) => {
    // Check if we're on a mobile device using window.innerWidth
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [activeTab, setActiveTab] = useState('form');

    // Add window resize listener to update isMobile state
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const [selectedGroupId, setSelectedGroupId] = useState(props.groups[0]?.id || '');
    const selectedGroup = props.groups.find(group => group.id == selectedGroupId);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const groupMembers = selectedGroup ? selectedGroup.members : [];
    
    // State for receipt view
    const [items, setItems] = useState([{
        name: '',
        price: '',
        members: groupMembers.map(member => ({
            id: member.id,
            name: member.first_name,
            included: true
        }))
    }]);
    const [tip, setTip] = useState(0);
    const [tax, setTax] = useState(0);
    const [description, setDescription] = useState('');

    const groups = [...props.groups];

    const dispatch = useDispatch();

    const sortedGroups = groups.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return dateB - dateA;
    });

    // Handler for when the dropdown selection changes
    const handleSelectionChange = (event) => {
        setSelectedGroupId(event.target.value);
    };

    const saveExpense = async (formattedRequest) => {
        formattedRequest['description'] = formattedRequest['description'] + " - SplitwisePlus By Femin";
        formattedRequest['currency_code'] = "USD";
        formattedRequest['group_id'] = selectedGroup.id;

        let added = await createGroupExpense(window.localStorage.getItem("API_KEY"), formattedRequest);
        console.log(added);
        dispatch(fetchExpenses());
        props.onClose();
    }
    
    // Function to update items and sync with receipt view
    const updateReceiptView = (newItems, newTip, newTax, newDescription) => {
        setItems(newItems);
        if (newTip !== undefined) setTip(newTip);
        if (newTax !== undefined) setTax(newTax);
        if (newDescription !== undefined) setDescription(newDescription);
    };
    
    // Function to calculate total of all items
    const getTotals = () => {
        return items.reduce((sum, item) => {
            const itemPrice = isNaN(parseFloat(item.price)) ? 0 : parseFloat(item.price);
            return sum + itemPrice;
        }, 0);
    };
    
    // Function to format and save the expense
    const formatAndSaveExpense = () => {
        // We'll simulate clicking the save button in the ItemList component
        const saveButton = document.querySelector('button[data-action="save-expense"]');
        if (saveButton) {
            saveButton.click();
        } else {
            console.error('Save button not found');
        }
    };

    const localUser = JSON.parse(window.localStorage.getItem("user"));

    const theme = useTheme();
    
    // Custom styles for react-select
    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: theme.background.input,
            borderColor: theme.ui.border,
            '&:hover': {
                borderColor: theme.ui.focusBorder,
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: theme.background.secondary,
            border: `1px solid ${theme.ui.border}`,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? theme.background.hover : 'transparent',
            color: theme.text.primary,
            '&:active': {
                backgroundColor: theme.background.active,
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: theme.text.primary,
        }),
        input: (provided) => ({
            ...provided,
            color: theme.text.primary,
        }),
    };

    // Add meta tag to prevent zooming on input focus in mobile
    useEffect(() => {
        if (isMobile) {
            // Create a meta tag to prevent zooming on input focus
            let viewportMeta = document.querySelector('meta[name="viewport"]');
            if (!viewportMeta) {
                viewportMeta = document.createElement('meta');
                viewportMeta.name = 'viewport';
                document.head.appendChild(viewportMeta);
            }
            viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
            
            // Clean up when component unmounts
            return () => {
                if (viewportMeta) {
                    viewportMeta.content = 'width=device-width, initial-scale=1';
                }
            };
        }
    }, [isMobile]);
    
    return (
        <>
            {isMobile && (
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            )}
            <FormSide activeTab={activeTab} isMobile={isMobile}>
                <FormGroup>
                    <FormLabel>Group</FormLabel>
                    <FormSelect value={selectedGroupId} onChange={handleSelectionChange}>
                        {sortedGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </FormSelect>
                </FormGroup>
                {selectedGroupId == 0 && (
                    <div style={{ margin: `${theme.spacing.md} 0` }}>
                        <Select 
                            options={props.allFriends.map(item => ({
                                value: item,
                                label: item.first_name
                            }))} 
                            styles={customStyles} 
                            isMulti={true} 
                            onChange={(selected) => {
                                selected = selected.map(s => s.value);
                                selected = [...selected, {
                                    email: localUser['user']['email'],
                                    first_name: localUser['user']['first_name'],
                                    last_name: localUser['user']['last_name'],
                                    id: localUser['user']['id']
                                }];
                                setSelectedFriends(selected);
                            }}
                            placeholder="Select friends..."
                        />
                    </div>
                )}
                <div style={{ marginTop: theme.spacing.md }}>
                    <ItemList 
                        groupMembers={selectedGroupId == 0 ? selectedFriends : groupMembers} 
                        saveExpense={saveExpense}
                        onItemsChange={updateReceiptView}
                        isMobile={isMobile}
                    />
                </div>
            </FormSide>
            
            <ReceiptSide activeTab={activeTab} isMobile={isMobile}>
                <ReceiptTitle>Receipt Summary</ReceiptTitle>
                <div className="receipt-items">
                    {items.map((item, index) => {
                        const includedMembers = item.members ? item.members.filter(member => member.included) : [];
                        // Calculate total shares for this item
                        const totalShares = includedMembers.reduce((sum, member) => sum + (member.shares || 1), 0) || 1; // Avoid division by zero
                        const pricePerShare = parseFloat(item.price || 0) / totalShares;
                        
                        return (
                            <ReceiptItem key={index}>
                                <ItemHeader>
                                    <ItemName>{item.name || `Item ${index + 1}`}</ItemName>
                                    <ItemPrice>${parseFloat(item.price || 0).toFixed(2)}</ItemPrice>
                                </ItemHeader>
                                <ItemDetails>
                                    {includedMembers.length > 0 && (
                                        <>
                                            <div style={{ marginBottom: '4px', color: theme.text.secondary }}>
                                                <span style={{ color: theme.text.primary, fontWeight: 'normal' }}>
                                                    ${pricePerShare.toFixed(2)}
                                                </span> per share
                                            </div>
                                            
                                            {/* Calculate per-share cost including tip and tax share */}
                                            {(tip > 0 || tax > 0) && (
                                                <div style={{ marginBottom: '4px', color: theme.text.secondary }}>
                                                    <span style={{ color: theme.status.info, fontWeight: 'normal' }}>
                                                        ${((parseFloat(item.price || 0) / getTotals()) * (tip + tax) / totalShares + pricePerShare).toFixed(2)}
                                                    </span> per share (Incl. Tip & Taxes)
                                                </div>
                                            )}
                                            
                                            <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                                                Split between:
                                            </div>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '8px' }}>
                                                {includedMembers.map((member, i) => (
                                                    <div key={member.id} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>
                                                            {member.name} 
                                                            {member.shares > 1 && (
                                                                <span style={{ 
                                                                    color: theme.status.info, 
                                                                    fontWeight: 'bold',
                                                                    marginLeft: '4px' 
                                                                }}>
                                                                    ({member.shares} shares)
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span style={{ color: theme.text.primary }}>
                                                            ${(pricePerShare * (member.shares || 1)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    {includedMembers.length === 0 && (
                                        <div style={{ fontStyle: 'italic', color: theme.text.secondary, fontSize: '0.85rem' }}>
                                            No members selected
                                        </div>
                                    )}
                                </ItemDetails>
                            </ReceiptItem>
                        );
                    })}
                </div>
                
                <TotalSection>
                    <TotalRow>
                        <span>Subtotal:</span>
                        <span>${getTotals().toFixed(2)}</span>
                    </TotalRow>
                    <TotalRow>
                        <span>Tax:</span>
                        <span>${parseFloat(tax || 0).toFixed(2)}</span>
                    </TotalRow>
                    <TotalRow>
                        <span>Tip:</span>
                        <span>${parseFloat(tip || 0).toFixed(2)}</span>
                    </TotalRow>
                    <TotalRow className="grand-total">
                        <span>Total:</span>
                        <span>${(getTotals() + parseFloat(tax || 0) + parseFloat(tip || 0)).toFixed(2)}</span>
                    </TotalRow>
                </TotalSection>
                
                <SaveButtonContainer>
                    <SaveButton onClick={formatAndSaveExpense}>Save Expense</SaveButton>
                </SaveButtonContainer>
            </ReceiptSide>
        </>
    );
}

export default AddExpenseModal;