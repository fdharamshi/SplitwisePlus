import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../theme/ThemeContext';
import {
  ItemListContainer,
  FormSection,
  SectionTitle,
  FormRow,
  FormField,
  Input,
  Button,
  ItemCard,
  MemberList,
  MemberChip,
  Divider,
  TotalAmount
} from './ItemList.styles';

const Decimal = require('decimal.js');

Decimal.config({
    decimalPlaces: 2
});

const ItemList = ({ groupMembers = [], saveExpense, selectedFriends = [], setSelectedFriends }) => {
    const theme = useTheme();
    
    // State management
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
    const [selectedPayer, setSelectedPayer] = useState(groupMembers[0]?.id || '');
    const [description, setDescription] = useState('');

    // Initialize members for items when groupMembers changes
    const initializeMembers = useCallback(() => {
        return groupMembers.map(member => ({
            id: member.id,
            name: member.first_name,
            included: true
        }));
    }, [groupMembers]);

    // Update items when groupMembers changes
    useEffect(() => {
        const updatedItems = items.map(item => ({
            ...item,
            members: initializeMembers()
        }));
        setItems(updatedItems);
        if (groupMembers.length > 0 && !selectedPayer) {
            setSelectedPayer(groupMembers[0].id);
        }
    }, [groupMembers, initializeMembers, selectedPayer, items]);

    // Calculate total amount
    const getTotals = useCallback(() => {
        return items.reduce((sum, item) => {
            const itemPrice = isNaN(parseFloat(item.price)) ? 0 : parseFloat(item.price);
            return sum + itemPrice;
        }, 0);
    }, [items]);

    // Calculate member costs
    const calculateMemberCost = useCallback(() => {
        const memberCosts = new Map();
        let totalItemsCost = new Decimal(0);

        // Initialize member costs
        groupMembers.forEach(member => {
            memberCosts.set(member.id, {
                name: `${member.first_name} ${member.last_name || ''}`.trim(),
                totalCost: new Decimal(0),
                tipShare: new Decimal(0),
                taxShare: new Decimal(0),
                owedShare: new Decimal(0)
            });
        });

        // Calculate total items cost
        items.forEach(item => {
            totalItemsCost = totalItemsCost.plus(new Decimal(item.price || 0));
        });

        // Calculate each item's share of tax and tip
        items.forEach(item => {
            const itemCost = new Decimal(item.price || 0);
            const itemProportion = totalItemsCost.isZero() ? new Decimal(0) : itemCost.dividedBy(totalItemsCost);
            const itemTax = new Decimal(tax).times(itemProportion);
            const itemTip = new Decimal(tip).times(itemProportion);
            const itemTotalCost = itemCost.plus(itemTax).plus(itemTip);

            // Calculate included members for this item
            const includedMembers = item.members.filter(member => member.included);
            const memberCount = includedMembers.length || 1; // Avoid division by zero

            // Update each included member's cost
            includedMembers.forEach(member => {
                const memberCost = memberCosts.get(member.id);
                if (memberCost) {
                    const memberShare = itemTotalCost.dividedBy(memberCount);
                    memberCost.totalCost = memberCost.totalCost.plus(memberShare);
                    memberCost.tipShare = memberCost.tipShare.plus(itemTip.dividedBy(memberCount));
                    memberCost.taxShare = memberCost.taxShare.plus(itemTax.dividedBy(memberCount));
                    memberCost.owedShare = memberCost.owedShare.plus(memberShare);
                }
            });
        });

        // Handle any rounding discrepancies
        if (groupMembers.length > 0) {
            let totalOwedShare = new Decimal(0);
            memberCosts.forEach(value => {
                totalOwedShare = totalOwedShare.plus(value.owedShare);
            });

            const totalBill = new Decimal(totalItemsCost).plus(new Decimal(tax)).plus(new Decimal(tip));
            const discrepancy = totalBill.minus(totalOwedShare);

            if (!discrepancy.isZero()) {
                const firstMemberId = groupMembers[0].id;
                const firstMemberCost = memberCosts.get(firstMemberId);
                if (firstMemberCost) {
                    firstMemberCost.owedShare = firstMemberCost.owedShare.plus(discrepancy);
                }
            }
        }

        return memberCosts;
    }, [items, tip, tax, groupMembers]);

    // Format and submit the expense
    const formatRequest = useCallback(() => {
        const memberCosts = calculateMemberCost();
        const formattedRequest = {};
        let totalOwedShares = new Decimal(0);
        let payerIndex = -1;
        let totalBillWithTipTax = new Decimal(0).plus(new Decimal(tax)).plus(new Decimal(tip));
        
        items.forEach(item => {
            totalBillWithTipTax = totalBillWithTipTax.plus(new Decimal(item.price || 0));
        });

        groupMembers.forEach((member, index) => {
            const memberCost = memberCosts.get(member.id);
            const owedShareRounded = new Decimal(memberCost.owedShare).toFixed(2);

            formattedRequest[`users__${index}__user_id`] = member.id;
            formattedRequest[`users__${index}__first_name`] = member.first_name;
            formattedRequest[`users__${index}__last_name`] = member.last_name || '';
            formattedRequest[`users__${index}__email`] = member.email;
            formattedRequest[`users__${index}__owed_share`] = owedShareRounded;
            totalOwedShares = totalOwedShares.plus(new Decimal(owedShareRounded));
            formattedRequest[`users__${index}__paid_share`] = "0";
            
            if (member.id === selectedPayer) {
                payerIndex = index;
            }
        });

        const totalBillDecimal = new Decimal(totalBillWithTipTax).toFixed(2);
        const discrepancy = new Decimal(totalBillDecimal).minus(totalOwedShares).toFixed(2);

        if (discrepancy !== "0.00") {
            const firstMemberCost = memberCosts.get(groupMembers[0]?.id);
            if (firstMemberCost) {
                const adjustedOwedShare = new Decimal(firstMemberCost.owedShare).plus(new Decimal(discrepancy)).toFixed(2);
                formattedRequest[`users__0__owed_share`] = adjustedOwedShare;
            }
        }

        formattedRequest['cost'] = totalBillDecimal;
        formattedRequest['description'] = description;
        if (payerIndex >= 0) {
            formattedRequest[`users__${payerIndex}__paid_share`] = totalBillDecimal;
        }

        // Add notes
        let notes = `Total Cost: ${Number(totalBillWithTipTax).toFixed(2)}\n`;
        notes += `Total Tip: ${Number(tip).toFixed(2)}\n`;
        notes += `Total Tax: ${Number(tax).toFixed(2)}\n\n`;
        notes += "Items:\n";
        
        items.forEach(item => {
            const includedMembers = item.members
                .filter(member => member.included)
                .map(member => member.name)
                .join("\n   ");
            const includedCount = item.members.filter(m => m.included).length;
            notes += `- ${item.name}: $${item.price} [Per Person: ${includedCount > 0 ? (Number(item.price) / includedCount).toFixed(2) : '0.00'}]\n   ${includedMembers}\n`;
        });
        let totalOwedShares = new Decimal(0);

        let payerIndex = -1;

        let totalBillWithTipTax = (new Decimal(0)).plus(new Decimal(tax)).plus(new Decimal(tip));
        items.forEach(item => {
            totalBillWithTipTax = totalBillWithTipTax.plus(new Decimal(item.price));
        });

        groupMembers.forEach((member, index) => {
            const memberCost = memberCosts.get(member.id);
            // Ensure owedShare is rounded to 2 decimal places for consistency
            const owedShareRounded = new Decimal(memberCost.owedShare).toFixed(2);

            // Construct the part of the request concerning this member
            formattedRequest[`users__${index}__user_id`] = member.id;
            formattedRequest[`users__${index}__first_name`] = member.first_name;
            formattedRequest[`users__${index}__last_name`] = member.last_name || '';
            formattedRequest[`users__${index}__email`] = member.email;
            formattedRequest[`users__${index}__owed_share`] = owedShareRounded; // Use the rounded owedShare
            totalOwedShares = totalOwedShares.plus(new Decimal(owedShareRounded));

            formattedRequest[`users__${index}__paid_share`] = "0";
            if (member.id == selectedPayer) {
                payerIndex = index;
            }
        });

        // Adjust for any discrepancy due to rounding in owed shares vs. total bill
        const totalBillDecimal = new Decimal(totalBillWithTipTax).toFixed(2);
        let discrepancy = new Decimal(totalBillDecimal).minus(totalOwedShares).toFixed(2);

        if (discrepancy !== "0.00") {
            // Identify the first member to adjust (could be based on other criteria)
            const firstMemberCost = memberCosts.get(groupMembers[0].id);
            const adjustedOwedShare = new Decimal(firstMemberCost.owedShare).plus(new Decimal(discrepancy)).toFixed(2);
            formattedRequest[`users__0__owed_share`] = adjustedOwedShare; // Adjust the first member's owed share
        }

        if (!discrepancy.isZero()) {
            const firstMemberId = groupMembers[0].id; // Assuming the first member in the list is the one to adjust
            const firstMemberCost = memberCosts.get(firstMemberId);
            firstMemberCost.owedShare = firstMemberCost.owedShare.plus(discrepancy);
            memberCosts.set(firstMemberId, firstMemberCost);
        }

        return memberCosts;
    }

    useEffect(() => {
        // Function to initialize members for each item

        // Update each item's members while keeping other properties intact
        const updatedItems = items.map(item => ({
            ...item,
            members: initializeMembers()
        }));

        setItems(updatedItems);
        setSelectedPayer('');
    }, [groupMembers]);

    const handleAddItem = () => {
        // Only initialize members for the new item
        setItems([...items, {quantity: 1, name: '', price: 0, members: initializeMembers()}]);
    };

    const initializeMembers = () => {
        // Sort groupMembers by name before mapping
        const sortedGroupMembers = [...groupMembers].sort((a, b) => {
            const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
            const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        return sortedGroupMembers.map(member => ({
            id: member.id,
            included: false,
            name: `${member.first_name} ${member.last_name ? member.last_name : ''}`
        }));
    };

    const toggleAllMembers = (itemIndex) => {
        const newItems = [...items];
        const allSelected = newItems[itemIndex].members.every(member => member.included);
        newItems[itemIndex].members.forEach(member => {
            member.included = !allSelected;
        });
        setItems(newItems);
    }

    const toggleMember = (itemIndex, memberId) => {
        const newItems = [...items];
        const memberIndex = newItems[itemIndex].members.findIndex(m => m.id === memberId);
        newItems[itemIndex].members[memberIndex].included = !newItems[itemIndex].members[memberIndex].included;
        setItems(newItems);
    };

    const updateItemsFromReceipt = (parsedItems) => {
        // Assuming parsedItems is an array of objects with { quantity, item, price }
        const updatedItems = parsedItems.map(item => ({
            ...item,
            members: initializeMembers()
        }));
        setItems(updatedItems);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleDuplicateItem = (index) => {
        // Duplicate the item along with its members state
        const newItem = {...items[index], members: [...items[index].members]};
        const newItems = [...items];
        newItems.splice(index + 1, 0, newItem);
        setItems(newItems);
    };

    const getTotals = () => {
        return items.reduce((sum, item) => {
            // Check if item.price is a number, if not, use 0
            const itemPrice = isNaN(parseFloat(item.price)) ? 0 : parseFloat(item.price);
            return sum + itemPrice;
        }, 0);
    }

    return (
        <ItemListContainer>
            <div style={{ marginBottom: theme.spacing.lg }}>
                <TotalAmount>
                    <div>Subtotal: ${getTotals().toFixed(2)}</div>
                    <div>Tip: ${parseFloat(tip).toFixed(2)}</div>
                    <div>Tax: ${parseFloat(tax).toFixed(2)}</div>
                    <Divider />
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        Total: ${(parseFloat(getTotals()) + parseFloat(tip) + parseFloat(tax)).toFixed(2)}
                    </div>
                </TotalAmount>
            </div>

            <div style={{ textAlign: 'right', marginBottom: theme.spacing.lg }}>
                <Button 
                    onClick={formatRequest}
                    style={{ padding: `${theme.spacing.sm} ${theme.spacing.xl}`, fontSize: '1.1rem' }}
                >
                    Save Expense
                </Button>
            </div>

            <FormSection>
                <SectionTitle>Expense Details</SectionTitle>
                <FormRow>
                    <FormField>
                        <label>Description</label>
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Dinner at Restaurant"
                        />
                    </FormField>
                    <FormField>
                        <label>Payer</label>
                        <select 
                            value={selectedPayer}
                            onChange={(e) => setSelectedPayer(e.target.value)}
                            style={{
                                width: '100%',
                                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                borderRadius: theme.borderRadius.small,
                                backgroundColor: theme.background.input,
                                color: theme.text.primary,
                                border: `1px solid ${theme.ui.border}`,
                            }}
                        >
                            {groupMembers.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.first_name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </FormRow>
            </FormSection>

            <FormSection>
                <SectionTitle>Items</SectionTitle>
                {items.map((item, index) => (
                    <ItemCard key={index}>
                        <FormRow>
                            <FormField style={{ flex: 2 }}>
                                <label>Item Name</label>
                                <Input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                                    placeholder="e.g., Pizza"
                                />
                            </FormField>
                            <FormField>
                                <label>Price ($)</label>
                                <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </FormField>
                        </FormRow>
                        <MemberList>
                            {item.members.map(member => (
                                <MemberChip
                                    key={member.id}
                                    included={member.included}
                                    onClick={() => toggleMemberInclusion(index, member.id)}
                                >
                                    {member.name}
                                </MemberChip>
                            ))}
                        </MemberList>
                        <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
                            <Button 
                                onClick={() => duplicateItem(index)}
                            >
                                Duplicate
                            </Button>
                            <Button 
                                className="danger" 
                                onClick={() => removeItem(index)}
                            >
                                Remove Item
                            </Button>
                        </div>
                    </ItemCard>
                ))}
                <Button 
                    onClick={addItem}
                    style={{ marginTop: theme.spacing.md }}
                >
                    + Add Item
                </Button>
            </FormSection>

            <FormSection>
                <SectionTitle>Additional Costs</SectionTitle>
                <FormRow>
                    <FormField>
                        <label>Tip ($)</label>
                        <Input
                            type="number"
                            value={tip}
                            onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </FormField>
                    <FormField>
                        <label>Tax ($)</label>
                        <Input
                            type="number"
                            value={tax}
                            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </FormField>
                </FormRow>
            </FormSection>

            <div style={{ marginTop: theme.spacing.lg, textAlign: 'right' }}>
                <Button 
                    onClick={formatRequest}
                    style={{ padding: `${theme.spacing.sm} ${theme.spacing.xl}`, fontSize: '1.1rem' }}
                >
                    Submit Expense
                </Button>
            </div>
        </ItemListContainer>
    );
};

    // Helper functions for item management
    const updateItem = (index, field, value) => {
        setItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = { ...newItems[index], [field]: value };
            return newItems;
        });
    };

    const toggleMemberInclusion = (itemIndex, memberId) => {
        setItems(prevItems => {
            const newItems = [...prevItems];
            const memberIndex = newItems[itemIndex].members.findIndex(m => m.id === memberId);
            if (memberIndex !== -1) {
                newItems[itemIndex].members[memberIndex].included = !newItems[itemIndex].members[memberIndex].included;
            }
            return newItems;
        });
    };

    const addItem = () => {
        setItems(prevItems => [
            ...prevItems,
            {
                name: '',
                price: '',
                members: groupMembers.map(member => ({
                    id: member.id,
                    name: member.first_name,
                    included: true
                }))
            }
        ]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(prevItems => prevItems.filter((_, i) => i !== index));
        }
    };

    const duplicateItem = (index) => {
        const itemToDuplicate = items[index];
        setItems(prevItems => [
            ...prevItems,
            JSON.parse(JSON.stringify(itemToDuplicate))
        ]);
    };

    return (
        <ItemListContainer>
            <div style={{ marginBottom: theme.spacing.lg }}>
                <TotalAmount>
                    <div>Subtotal: ${getTotals().toFixed(2)}</div>
                    <div>Tip: ${parseFloat(tip).toFixed(2)}</div>
                    <div>Tax: ${parseFloat(tax).toFixed(2)}</div>
                    <Divider />
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        Total: ${(parseFloat(getTotals()) + parseFloat(tip) + parseFloat(tax)).toFixed(2)}
                    </div>
                </TotalAmount>
            </div>

            <div style={{ textAlign: 'right', marginBottom: theme.spacing.lg }}>
                <Button 
                    onClick={formatRequest}
                    style={{ padding: `${theme.spacing.sm} ${theme.spacing.xl}`, fontSize: '1.1rem' }}
                >
                    Save Expense
                </Button>
            </div>

            <FormSection>
                <SectionTitle>Expense Details</SectionTitle>
                <FormRow>
                    <FormField>
                        <label>Description</label>
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Dinner at Restaurant"
                        />
                    </FormField>
                    <FormField>
                        <label>Payer</label>
                        <select 
                            value={selectedPayer}
                            onChange={(e) => setSelectedPayer(e.target.value)}
                            style={{
                                width: '100%',
                                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                                borderRadius: theme.borderRadius.small,
                                backgroundColor: theme.background.input,
                                color: theme.text.primary,
                                border: `1px solid ${theme.ui.border}`,
                            }}
                        >
                            {groupMembers.map(member => (
                                <option key={member.id} value={member.id}>
                                    {member.first_name}
                                </option>
                            ))}
                        </select>
                    </FormField>
                </FormRow>
            </FormSection>

            <FormSection>
                <SectionTitle>Items</SectionTitle>
                {items.map((item, index) => (
                    <ItemCard key={index}>
                        <FormRow>
                            <FormField style={{ flex: 2 }}>
                                <label>Item Name</label>
                                <Input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                                    placeholder="e.g., Pizza"
                                />
                            </FormField>
                            <FormField>
                                <label>Price ($)</label>
                                <Input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </FormField>
                        </FormRow>
                        <MemberList>
                            {item.members.map(member => (
                                <MemberChip
                                    key={member.id}
                                    included={member.included}
                                    onClick={() => toggleMemberInclusion(index, member.id)}
                                >
                                    {member.name}
                                </MemberChip>
                            ))}
                        </MemberList>
                        <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
                            <Button 
                                onClick={() => duplicateItem(index)}
                            >
                                Duplicate
                            </Button>
                            <Button 
                                className="danger" 
                                onClick={() => removeItem(index)}
                            >
                                Remove Item
                            </Button>
                        </div>
                    </ItemCard>
                ))}
                <Button 
                    onClick={addItem}
                    style={{ marginTop: theme.spacing.md }}
                >
                    + Add Item
                </Button>
            </FormSection>

            <FormSection>
                <SectionTitle>Additional Costs</SectionTitle>
                <FormRow>
                    <FormField>
                        <label>Tip ($)</label>
                        <Input
                            type="number"
                            value={tip}
                            onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </FormField>
                    <FormField>
                        <label>Tax ($)</label>
                        <Input
                            type="number"
                            value={tax}
                            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </FormField>
                </FormRow>
            </FormSection>

            <div style={{ marginTop: theme.spacing.lg, textAlign: 'right' }}>
                <Button 
                    onClick={formatRequest}
                    style={{ padding: `${theme.spacing.sm} ${theme.spacing.xl}`, fontSize: '1.1rem' }}
                >
                    Submit Expense
                </Button>
            </div>
        </ItemListContainer>
    );
};

export default ItemList;