import React, { useEffect, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import useMediaQuery from '../../hooks/useMediaQuery';
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

const ItemList = ({ groupMembers, saveExpense, onItemsChange, isMobile = false }) => {
  const [items, setItems] = useState([]);
  const [tip, setTip] = useState('');
  const [tax, setTax] = useState('');
  const [payers, setPayers] = useState([]);  // Array of {id, amount} objects for multiple payers
  const [description, setDescription] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  
  // Get theme and determine if on mobile device
  const theme = useTheme();
  const mobileDetected = useMediaQuery('(max-width: 768px)');
  const isOnMobile = isMobile || mobileDetected;

  console.log(groupMembers);

  // Update parent component whenever items, tip, tax, or description change
  useEffect(() => {
    if (onItemsChange) {
      onItemsChange(items, tip, tax, description);
    }
  }, [items, tip, tax, description, onItemsChange]);

  const handleAddPayer = (event) => {
    const payerId = event.target.value;
    if (payerId && !payers.some(p => p.id === payerId)) {
      // Get total bill amount
      let totalBill = new Decimal(getDisplayTotal()).plus(new Decimal(getTaxValue())).plus(new Decimal(getTipValue())).toFixed(2);

      // If this is the first payer, set them to pay the full amount
      // Convert payerId to a number to ensure type consistency when comparing with member.id
      const newPayer = { id: Number(payerId), amount: payers.length === 0 ? totalBill : '' };
      setPayers([...payers, newPayer]);
    }
  };

  const handleRemovePayer = (payerId) => {
    setPayers(payers.filter(p => p.id !== payerId));
  };

  const handlePayerAmountChange = (payerId, amount) => {
    setPayers(payers.map(p => p.id === payerId ? { ...p, amount } : p));
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleTaxChange = (event) => {
    setTax(event.target.value);
  };

  const handleTipChange = (event) => {
    setTip(event.target.value);
  };

  const handleNewItemNameChange = (event) => {
    setNewItemName(event.target.value);
  };

  const handleNewItemPriceChange = (event) => {
    setNewItemPrice(event.target.value);
  };

  // Function to initialize new members
  const initializeMembers = () => {
    return groupMembers.map(member => ({
      id: member.id,
      name: member.first_name,
      included: true,
      shares: 1
    }));
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: '',
        price: '',
        members: initializeMembers()
      }
    ]);
  };

  const addNewItem = () => {
    if (newItemName && newItemPrice) {
      const newItem = {
        name: newItemName,
        price: newItemPrice,
        members: initializeMembers()
      };
      setItems([...items, newItem]);
      setNewItemName('');
      setNewItemPrice('');
    }
  };

  const toggleMember = (itemIndex, memberId) => {
    const newItems = [...items];
    const memberIndex = newItems[itemIndex].members.findIndex(m => m.id === memberId);
    
    // Toggle the included status
    newItems[itemIndex].members[memberIndex].included = !newItems[itemIndex].members[memberIndex].included;
    
    // Reset shares to 1 when toggling off
    if (!newItems[itemIndex].members[memberIndex].included) {
      newItems[itemIndex].members[memberIndex].shares = 1;
    }
    
    setItems(newItems);
  };

  const toggleAllMembers = (itemIndex) => {
    const newItems = [...items];
    const allIncluded = newItems[itemIndex].members.every(member => member.included);
    
    // Toggle all members (if all are included, exclude all; otherwise, include all)
    newItems[itemIndex].members.forEach(member => {
      member.included = !allIncluded;
      if (!member.included) {
        // Reset shares to 1 when excluding
        member.shares = 1;
      }
    });
    
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
  };
  
  // Safe version of getTotals that ensures we have a valid number for display
  const getDisplayTotal = () => {
    const total = getTotals();
    return isNaN(total) ? 0 : total;
  };
  
  // Safely parse tax/tip values
  const getTaxValue = () => {
    return parseFloat(tax) || 0;
  };
  
  const getTipValue = () => {
    return parseFloat(tip) || 0;
  };

  function formatRequest() {
    const memberCosts = calculateMemberCost();
    const formattedRequest = {};
    let totalOwedShares = new Decimal(0);

    let totalBillWithTipTax = (new Decimal(0)).plus(new Decimal(getTaxValue())).plus(new Decimal(getTipValue()));
    items.forEach(item => {
      totalBillWithTipTax = totalBillWithTipTax.plus(new Decimal(item.price));
    });
    
    // Verify payer amounts or auto-distribute total if needed
    let totalPaidAmount = new Decimal(0);
    let adjustedPayers = [...payers];
    
    // If there are no payers, select the first group member
    if (payers.length === 0 && groupMembers.length > 0) {
      adjustedPayers = [{ id: groupMembers[0].id, amount: totalBillWithTipTax.toString() }];
    }
    // If there's only one payer, they pay the full amount
    else if (payers.length === 1) {
      adjustedPayers = [{ id: payers[0].id, amount: totalBillWithTipTax.toString() }];
    }
    // Calculate total of explicitly provided payer amounts for multiple payers
    else if (payers.length > 1) {
      payers.forEach(payer => {
        if (payer.amount) {
          totalPaidAmount = totalPaidAmount.plus(new Decimal(payer.amount));
        }
      });
      
      // If total paid amount doesn't match bill total, adjust as needed
      if (!totalPaidAmount.equals(totalBillWithTipTax) && payers.length > 0) {
        // If no payer amounts were provided, split evenly among all payers
        if (totalPaidAmount.isZero()) {
          const splitAmount = totalBillWithTipTax.dividedBy(payers.length).toFixed(2);
          adjustedPayers = payers.map(p => ({ ...p, amount: splitAmount }));
        }
        // If amounts were provided but don't add up to total, adjust the first payer
        else if (payers.some(p => p.amount)) {
          const difference = totalBillWithTipTax.minus(totalPaidAmount);
          // Find first payer with an amount
          const firstPayerWithAmount = payers.find(p => p.amount);
          if (firstPayerWithAmount) {
            adjustedPayers = payers.map(p => {
              if (p.id === firstPayerWithAmount.id) {
                return {
                  ...p,
                  amount: new Decimal(p.amount).plus(difference).toFixed(2)
                };
              }
              return p;
            });
          }
          // If no payers have amounts, assign total to first payer
          else if (payers.length > 0) {
            adjustedPayers = payers.map((p, idx) => 
              idx === 0 ? { ...p, amount: totalBillWithTipTax.toFixed(2) } : p
            );
          }
        }
      }
    }

    // Create a lookup for payer amounts
    const payerAmounts = {};
    adjustedPayers.forEach(payer => {
      // Ensure payer.id is used as a string key in the object
      payerAmounts[String(payer.id)] = payer.amount || "0";
    });

    // Process each group member
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

      // Set paid_share based on payer information
      // Convert member.id to string to match the keys in payerAmounts
      const paidShare = payerAmounts[String(member.id)] || "0";
      formattedRequest[`users__${index}__paid_share`] = paidShare;
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

    // Unicode bold for section titles (Mathematical Bold, not markdown)
    const bold = {
      totalCost: '𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝘀𝘁',
      tip: '𝗧𝗶𝗽',
      tax: '𝗧𝗮𝘅',
      payers: '𝗣𝗮𝘆𝗲𝗿𝘀',
      items: '𝗜𝘁𝗲𝗺𝘀',
      memberCosts: '𝗠𝗲𝗺𝗯𝗲𝗿 𝗖𝗼𝘀𝘁𝘀',
    };

    // Construct the visually enhanced notes section with emojis and bold section titles
    let notes = "💸 SplitwisePlus by Femin Dharamshi\n";
    notes += "🔗 Learn More: https://github.com/fdharamshi/SplitwisePlus\n\n";
    notes += "🤝 We split tip and tax fairly—everyone pays their share based on what they ordered, so it’s always balanced and kind to all!\n\n";
    notes += `🧾 ${bold.totalCost}: $${Number(totalBillWithTipTax).toFixed(2)}\n`;
    notes += `💁‍♂️ ${bold.tip}: $${getTipValue().toFixed(2)}\n`;
    notes += `🧾 ${bold.tax}: $${getTaxValue().toFixed(2)}\n`;

    // Add payer information to notes
    if (adjustedPayers.length > 0) {
      notes += `\n💰 ${bold.payers}:\n`;
      adjustedPayers.forEach(payer => {
        const member = groupMembers.find(m => m.id === payer.id);
        if (member) {
          notes += `- ${member.first_name} ${member.last_name || ''}: $${payer.amount}\n`;
        }
      });
    }

    notes += `\n🛒 ${bold.items}:\n`;
    items.forEach(item => {
      // For each included member, show share count if >1
      const includedMembers = item.members
        .filter(member => member.included)
        .map(member => {
          const shares = member.shares || 1;
          return shares > 1
            ? `${member.name} (${shares} shares)`
            : `${member.name}`;
        })
        .join("\n   👤 ");
      const includedMembersCount = item.members.filter(member => member.included).reduce((sum, m) => sum + (m.shares || 1), 0);
      const itemPrice = parseFloat(item.price) || 0;
      const perShareAmount = includedMembersCount > 0 ? (itemPrice / includedMembersCount) : 0;
      notes += `- ${item.name}: $${itemPrice.toFixed(2)} [Per Share: $${perShareAmount.toFixed(2)}]\n   👤 ${includedMembers}\n`;
    });

    notes += `\n👥 ${bold.memberCosts}:\n`;
    memberCosts.forEach((value, key) => {
      notes += `- ${value.name}:\n   💵 Total: $${value.totalCost.toFixed(2)}\n   💁‍♂️ Tip: $${value.tipShare.toFixed(2)}\n   🧾 Tax: $${value.taxShare.toFixed(2)}\n\n`;
    });

    formattedRequest['details'] = notes;
    saveExpense(formattedRequest);
  }

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
      const itemProportion = totalItemsCost.isZero() ? new Decimal(0) : itemCost.dividedBy(totalItemsCost);
      const itemTax = new Decimal(getTaxValue()).times(itemProportion);
      const itemTip = new Decimal(getTipValue()).times(itemProportion);
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
      const firstMemberId = groupMembers[0]?.id; // Assuming the first member in the list is the one to adjust
      if (firstMemberId) {
        const firstMemberCost = memberCosts.get(firstMemberId);
        firstMemberCost.owedShare = firstMemberCost.owedShare.plus(discrepancy);
        memberCosts.set(firstMemberId, firstMemberCost);
      }
    }

    return memberCosts;
  }

  return (
    <ItemListContainer>
      <FormSection>
        <SectionTitle>Receipt Information</SectionTitle>
        <FormRow stackOnMobile={isOnMobile}>
          <FormField fullWidthOnMobile={isOnMobile}>
            <Input
              type="text"
              placeholder={isOnMobile ? "Description" : "Description (e.g., Dinner at Pizza Place)"}
              value={description}
              onChange={handleDescriptionChange}
            />
          </FormField>
        </FormRow>
        
        <FormRow>
          <FormField>
            <label htmlFor="payer-select">Add Payer</label>
            <Input
              as="select"
              id="payer-select" 
              value="" 
              onChange={handleAddPayer}
            >
              <option value="">Select a payer</option>
              {groupMembers
                .filter(member => !payers.some(p => p.id === member.id))
                .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.first_name} {member.last_name}
                </option>
              ))}
            </Input>
          </FormField>
        </FormRow>
        
        {/* Display selected payers */}
        {payers.length > 0 && (
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <label>Payers</label>
            {payers.map((payer) => {
              // Ensure payer.id is treated as a number for comparison
              // Log for debugging purposes
              console.log('Payer ID:', payer.id, typeof payer.id);
              console.log('Group Members IDs:', groupMembers.map(m => ({ id: m.id, type: typeof m.id, name: m.first_name })));
              
              // Find the member matching this payer ID, ensuring type consistency
              const member = groupMembers.find(m => Number(m.id) === Number(payer.id));
              const payerName = member ? `${member.first_name} ${member.last_name || ''}` : 'Unknown';
              
              return (
                <div key={payer.id} style={{
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: 'var(--input-bg-color, #333)',
                  borderRadius: '4px'
                }}>
                  {/* Desktop layout (row) */}
                  <div style={{
                    display: isOnMobile ? 'none' : 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{ flex: 1, fontWeight: 'bold' }}>
                      {payerName}
                    </div>
                    
                    {/* Only show amount inputs when there are multiple payers */}
                    {payers.length > 1 ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor={`payer-amount-${payer.id}`} style={{ marginRight: '8px', fontSize: '0.9rem' }}>
                          {payerName} paid:
                        </label>
                        <Input
                          id={`payer-amount-${payer.id}`}
                          type="number"
                          placeholder="Amount"
                          value={payer.amount}
                          onChange={(e) => handlePayerAmountChange(payer.id, e.target.value)}
                          min="0"
                          step="0.01"
                          style={{ width: '120px', marginRight: '8px' }}
                        />
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-color, #e0e0e0)' }}>
                        Paying full amount
                      </div>
                    )}
                    
                    <Button 
                      variant="danger" 
                      onClick={() => handleRemovePayer(payer.id)}
                      style={{ padding: '4px 8px', minHeight: '32px' }}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  {/* Mobile layout (column) */}
                  <div style={{
                    display: isOnMobile ? 'flex' : 'none',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>
                        {payerName}
                      </div>
                      <Button 
                        variant="danger" 
                        onClick={() => handleRemovePayer(payer.id)}
                        style={{ padding: '4px 8px', minHeight: '32px' }}
                      >
                        ✕
                      </Button>
                    </div>
                    
                    {/* Only show amount inputs when there are multiple payers */}
                    {payers.length > 1 ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor={`payer-mobile-amount-${payer.id}`} style={{ marginRight: '8px', fontSize: '0.9rem' }}>
                          Amount paid by {payerName}:
                        </label>
                        <Input
                          id={`payer-mobile-amount-${payer.id}`}
                          type="number"
                          placeholder="Amount"
                          value={payer.amount}
                          onChange={(e) => handlePayerAmountChange(payer.id, e.target.value)}
                          min="0"
                          step="0.01"
                          style={{ flex: 1 }}
                        />
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-color, #e0e0e0)' }}>
                        Paying full amount
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <FormRow stackOnMobile={isOnMobile}>
          <FormField>
            <label htmlFor="tax-input" style={{ 
              display: 'block',
              marginBottom: '5px',
              fontSize: '0.9rem'
            }}>Tax Amount ($)</label>
            <Input
              id="tax-input"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={tax}
              onChange={handleTaxChange}
              style={{ textAlign: 'right' }}
            />
          </FormField>
          <FormField>
            <label htmlFor="tip-input" style={{ 
              display: 'block',
              marginBottom: '5px',
              fontSize: '0.9rem'
            }}>Tip Amount ($)</label>
            <Input
              id="tip-input"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={tip}
              onChange={handleTipChange}
              style={{ textAlign: 'right' }}
            />
          </FormField>
        </FormRow>
        
        <TotalAmount>
          <div>Subtotal: <strong>${getDisplayTotal().toFixed(2)}</strong></div>
          <div>Total with Tip & Tax: <strong>${(getDisplayTotal() + getTipValue() + getTaxValue()).toFixed(2)}</strong></div>
        </TotalAmount>
      </FormSection>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: isOnMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        gap: isOnMobile ? '12px' : '0',
        marginBottom: theme.spacing.md 
      }}>
        <Button variant="secondary" onClick={handleAddItem}>
          + Add New Item
        </Button>
        <Button onClick={formatRequest} data-action="save-expense" disabled={getTotals() <= 0 || payers.length === 0}>
          Save Expense
        </Button>
      </div>
      
      <FormRow stackOnMobile={isOnMobile}>
        <FormField fullWidthOnMobile={isOnMobile}>
          <Input
            type="text"
            placeholder="Item name"
            value={newItemName}
            onChange={handleNewItemNameChange}
          />
        </FormField>
        <FormField>
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={newItemPrice}
            onChange={handleNewItemPriceChange}
            style={{ textAlign: 'right' }}
          />
        </FormField>
        <Button
          onClick={addNewItem}
          disabled={!newItemName || !newItemPrice}
          style={isOnMobile ? {marginTop: '8px', width: '100%'} : {}}
        >
          Add Item
        </Button>
      </FormRow>
      
      {items.map((item, index) => (
        <ItemCard key={index}>
          <ItemHeader>
            <ItemTitle>{item.name || `Item ${index + 1}`}</ItemTitle>
            <div style={{ 
              display: 'flex', 
              flexDirection: isOnMobile ? 'column' : 'row',
              width: '100%',
              gap: isOnMobile ? '8px' : '8px',
              marginTop: isOnMobile ? '8px' : '0'
            }}>
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
              <Input
                type="text"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
              />
            </FormField>
            
            <FormField>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', e.target.value)}
                style={{ textAlign: 'right' }}
              />
            </FormField>
          </FormRow>
          
          <Divider />
          
          <div>
            <div style={{ 
              display: 'flex', 
              flexDirection: isOnMobile ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: isOnMobile ? 'flex-start' : 'center',
              gap: isOnMobile ? '8px' : '0',
              marginBottom: '12px' 
            }}>
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
                        {member.shares || 1}
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
          <Button 
            variant="secondary" 
            onClick={handleAddItem}
            style={{ width: isOnMobile ? '100%' : 'auto' }}
          >
            + Add Another Item
          </Button>
        </div>
      )}
    </ItemListContainer>
  );
};

export default ItemList;
