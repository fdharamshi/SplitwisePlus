import React, {useEffect, useState} from 'react';
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
  ItemHeader,
  ItemTitle,
  MemberList,
  MemberChip,
  ShareButton,
  Divider,
  TotalAmount
} from './ItemList.styles';

const Decimal = require('decimal.js');

Decimal.config({
    decimalPlaces: 2
});

const ItemList = ({groupMembers, saveExpense, onItemsChange}) => {
    const [items, setItems] = useState([]);
    const [tip, setTip] = useState(0.0);
    const [tax, setTax] = useState(0.0);

    // TODO: Default payer == Self.
    const [selectedPayer, setSelectedPayer] = useState('');

    const handlePayerChange = (event) => {
        setSelectedPayer(event.target.value);
    };

    const [description, setDescription] = useState('');

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    
    // Update parent component whenever items, tip, tax, or description change
    useEffect(() => {
        if (onItemsChange) {
            onItemsChange(items, tip, tax, description);
        }
    }, [items, tip, tax, description, onItemsChange]);

    function formatRequest() {
        const memberCosts = calculateMemberCost();
        const formattedRequest = {};
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

        // Set the total cost and description in the request
        formattedRequest['cost'] = totalBillDecimal;
        formattedRequest['description'] = description;
        formattedRequest[`users__${payerIndex}__paid_share`] = totalBillDecimal;

        // Construct the notes section
        let notes = "SplitwisePlus by Femin Dharamshi\nLearn More at https://github.com/fdharamshi/SplitwisePlus\n\n";
        notes += `Total Cost: ${Number(totalBillWithTipTax).toFixed(2)}\n`;
        notes += `Total Tip: ${tip.toFixed(2)}\n`;
        notes += `Total Tax: ${tax.toFixed(2)}\n\n`;

        notes += "Items:\n";
        items.forEach(item => {
            const includedMembers = item.members
                .filter(member => member.included)
                .map(member => member.name)
                .join("\n   ");
            const includedMembersCount = item.members.filter(member => member.included).length;
            notes += `- ${item.name}: $${item.price} [Per Person: ${(Number(item.price) / includedMembersCount).toFixed(2)}]\n   ${includedMembers}\n`;
        });

        notes += "\nMember Costs:\n";
        memberCosts.forEach((value, key) => {
            notes += `- ${value.name}:\n   Total Cost $${value.totalCost.toFixed(2)}\n   Tip $${value.tipShare.toFixed(2)}\n   Tax $${value.taxShare.toFixed(2)}\n\n`;
        });

        formattedRequest['details'] = notes;
        saveExpense(formattedRequest);
    };

    function calculateMemberCost() {
        const memberCosts = new Map();
        let totalItemsCost = new Decimal(0);

        // Initialize memberCosts
        groupMembers.forEach(member => {
            memberCosts.set(member.id, {
                name: `${member.first_name} ${member.last_name ? member.last_name : ''}`,
                totalCost: new Decimal(0),
                tipShare: new Decimal(0),
                taxShare: new Decimal(0),
                owedShare: new Decimal(0)
            });
        });

        // Calculate total cost of items
        items.forEach(item => {
            totalItemsCost = totalItemsCost.plus(new Decimal(item.price));
        });

        // Calculate each item's share of tax and tip
        items.forEach(item => {
            const itemCost = new Decimal(item.price);
            const itemProportion = itemCost.dividedBy(totalItemsCost);
            const itemTax = new Decimal(tax).times(itemProportion);
            const itemTip = new Decimal(tip).times(itemProportion);
            const itemTotalCost = itemCost.plus(itemTax).plus(itemTip);

            // Calculate total shares for this item
            const totalShares = item.members
                .filter(m => m.included)
                .reduce((sum, m) => sum + (m.shares || 1), 0);
                
            if (totalShares > 0) {
                // Calculate cost per share
                const costPerShare = itemTotalCost.dividedBy(totalShares);
                const tipPerShare = itemTip.dividedBy(totalShares);
                const taxPerShare = itemTax.dividedBy(totalShares);
                
                // Calculate and update each included member's cost based on their shares
                item.members.forEach(member => {
                    if (member.included) {
                        const memberCost = memberCosts.get(member.id);
                        const memberShares = member.shares || 1;
                        
                        // Multiply by number of shares
                        const memberShare = costPerShare.times(memberShares);
                        const memberTipShare = tipPerShare.times(memberShares);
                        const memberTaxShare = taxPerShare.times(memberShares);
                        
                        memberCost.totalCost = memberCost.totalCost.plus(memberShare);
                        memberCost.tipShare = memberCost.tipShare.plus(memberTipShare);
                        memberCost.taxShare = memberCost.taxShare.plus(memberTaxShare);
                        memberCost.owedShare = memberCost.owedShare.plus(memberShare);
                        memberCosts.set(member.id, memberCost);
                    }
                });
            }
        });

        // Calculate discrepancy and adjust the first included member's share
        let totalOwedShare = new Decimal(0);
        memberCosts.forEach((value, key) => {
            totalOwedShare = totalOwedShare.plus(value.owedShare);
        });

        const totalBill = totalItemsCost.plus(new Decimal(tax)).plus(new Decimal(tip));
        const discrepancy = totalBill.minus(totalOwedShare);

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
            name: `${member.first_name} ${member.last_name ? member.last_name : ''}`,
            shares: 1 // Default to 1 share per person
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
        
        // Reset shares to 1 when toggling off
        if (!newItems[itemIndex].members[memberIndex].included) {
            newItems[itemIndex].members[memberIndex].shares = 1;
        }
        
        setItems(newItems);
    };
    
    const increaseShares = (itemIndex, memberId) => {
        const newItems = [...items];
        const memberIndex = newItems[itemIndex].members.findIndex(m => m.id === memberId);
        
        // Only increase shares if the member is included
        if (newItems[itemIndex].members[memberIndex].included) {
            newItems[itemIndex].members[memberIndex].shares += 1;
            setItems(newItems);
        }
    };
    
    const decreaseShares = (itemIndex, memberId) => {
        const newItems = [...items];
        const memberIndex = newItems[itemIndex].members.findIndex(m => m.id === memberId);
        
        // Only decrease shares if greater than 1 and member is included
        if (newItems[itemIndex].members[memberIndex].included && 
            newItems[itemIndex].members[memberIndex].shares > 1) {
            newItems[itemIndex].members[memberIndex].shares -= 1;
            setItems(newItems);
        }
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

    const theme = useTheme();
    
    return (
        <ItemListContainer>
            <FormSection>
                <SectionTitle>Expense Details</SectionTitle>
                <FormRow>
                    <FormField>
                        <label htmlFor="title-input">Expense Title</label>
                        <Input
                            id="title-input"
                            type="text"
                            placeholder="Enter expense title"
                            value={description}
                            onChange={handleDescriptionChange}
                        />
                    </FormField>
                    
                    <FormField>
                        <label htmlFor="payer-select">Paid By</label>
                        <Input
                            as="select"
                            id="payer-select" 
                            value={selectedPayer} 
                            onChange={handlePayerChange}
                        >
                            <option value="">Select a payer</option>
                            {groupMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.first_name} {member.last_name}
                                </option>
                            ))}
                        </Input>
                    </FormField>
                </FormRow>
                
                <FormRow>
                    <FormField>
                        <label htmlFor="tip-input">Tip Amount</label>
                        <Input
                            id="tip-input"
                            type="number"
                            placeholder="0.00"
                            value={tip}
                            onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                        />
                    </FormField>
                    
                    <FormField>
                        <label htmlFor="tax-input">Tax Amount</label>
                        <Input
                            id="tax-input"
                            type="number"
                            placeholder="0.00"
                            value={tax}
                            onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                        />
                    </FormField>
                </FormRow>
                
                <TotalAmount>
                    <div>Subtotal: <strong>${getTotals().toFixed(2)}</strong></div>
                    <div>Total with Tip & Tax: <strong>${(getTotals() + tip + tax).toFixed(2)}</strong></div>
                </TotalAmount>
            </FormSection>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
                <Button variant="secondary" onClick={handleAddItem}>
                    + Add New Item
                </Button>
                <Button onClick={formatRequest} data-action="save-expense">
                    Save Expense
                </Button>
            </div>
            
            {items.map((item, index) => (
                <ItemCard key={index}>
                    <ItemHeader>
                        <ItemTitle>{item.name || `Item ${index + 1}`}</ItemTitle>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button 
                                variant="secondary" 
                                onClick={() => handleDuplicateItem(index)}
                                style={{ padding: '4px 8px', minHeight: '32px' }}
                            >
                                Duplicate
                            </Button>
                            <Button 
                                variant="danger" 
                                onClick={() => handleRemoveItem(index)}
                                style={{ padding: '4px 8px', minHeight: '32px' }}
                            >
                                Remove
                            </Button>
                        </div>
                    </ItemHeader>
                    
                    <FormRow>
                        <FormField>
                            <label>Item Name</label>
                            <Input
                                type="text"
                                placeholder="Item name"
                                value={item.name}
                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                            />
                        </FormField>
                        
                        <FormField>
                            <label>Item Price</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={item.price}
                                onChange={(e) => updateItem(index, 'price', e.target.value)}
                            />
                        </FormField>
                    </FormRow>
                    
                    <Divider />
                    
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h4 style={{ margin: 0 }}>Split Between</h4>
                            <Button 
                                variant="secondary" 
                                onClick={() => toggleAllMembers(index)}
                                style={{ padding: '4px 12px', minHeight: '32px' }}
                            >
                                {item.members.every(member => member.included) ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>
                        
                        <MemberList>
                            {item.members.map(member => (
                                <MemberChip 
                                    key={member.id} 
                                    included={member.included}
                                >
                                    <span 
                                        className="member-name" 
                                        onClick={() => toggleMember(index, member.id)}
                                    >
                                        {member.name}
                                    </span>
                                    
                                    {member.included && (
                                        <div className="share-controls">
                                            <ShareButton 
                                                type="decrease" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    decreaseShares(index, member.id);
                                                }}
                                                disabled={member.shares <= 1}
                                            >
                                                -
                                            </ShareButton>
                                            
                                            <div className="share-count">
                                                {member.shares}
                                            </div>
                                            
                                            <ShareButton 
                                                type="increase" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    increaseShares(index, member.id);
                                                }}
                                            >
                                                +
                                            </ShareButton>
                                        </div>
                                    )}
                                </MemberChip>
                            ))}
                        </MemberList>
                    </div>
                </ItemCard>
            ))}
            
            {items.length > 0 && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <Button variant="secondary" onClick={handleAddItem}>
                        + Add Another Item
                    </Button>
                </div>
            )}
        </ItemListContainer>
    );
};

export default ItemList;