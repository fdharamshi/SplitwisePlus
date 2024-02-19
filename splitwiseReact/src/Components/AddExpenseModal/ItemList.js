import React, {useEffect, useState} from 'react';
import Itemization from "../../pages/Itemization";
import './ItemList.css';

const Decimal = require('decimal.js');

Decimal.config({
    decimalPlaces: 2
});

const ItemList = ({groupMembers, saveExpense}) => {
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

            // Calculate and update each included member's cost
            item.members.forEach(member => {
                if (member.included) {
                    const memberCost = memberCosts.get(member.id);
                    const memberShare = itemTotalCost.dividedBy(item.members.filter(m => m.included).length);
                    memberCost.totalCost = memberCost.totalCost.plus(memberShare);
                    memberCost.tipShare = memberCost.tipShare.plus(itemTip.dividedBy(item.members.filter(m => m.included).length));
                    memberCost.taxShare = memberCost.taxShare.plus(itemTax.dividedBy(item.members.filter(m => m.included).length));
                    memberCost.owedShare = memberCost.owedShare.plus(memberShare);
                    memberCosts.set(member.id, memberCost);
                }
            });
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
        <div>
            <button className="saveExpense" onClick={formatRequest}>Save Expense</button>
            <Itemization callback={updateItemsFromReceipt}/>
            <button onClick={handleAddItem}>+ Add An Item</button>
            Total: ${getTotals()}
            <div className="financial-inputs">
                <div className="input-group">
                    <label htmlFor="tip-input">Enter Tip:</label>
                    <input
                        id="tip-input"
                        type="number"
                        value={tip}
                        onChange={(e) => setTip(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="tax-input">Enter Tax:</label>
                    <input
                        id="tax-input"
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="payer-dropdown-container">
                    <label htmlFor="payer-select">Select Payer:</label>
                    <select id="payer-select" value={selectedPayer} onChange={handlePayerChange}>
                        <option value="">Select a member</option>
                        {groupMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.first_name} {member.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="title-input">Enter Expense Title</label>
                    <input
                        id="title-input"
                        type="text"
                        placeholder="Expense Title"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </div>
            </div>
            {items.map((item, index) => (
                <div key={index}>
                    <div className={`item-row ${item.quantity == 0 || item.price == 0 ? 'alert-row' : ''}`}
                         key={index}>
                        <button onClick={() => handleDuplicateItem(index)}>Duplicate</button>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        />
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(index, 'name', e.target.value)}
                        />
                        <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', e.target.value)}
                        />
                        <button onClick={() => handleRemoveItem(index)}>Remove</button>
                    </div>
                    <div className="members-container">
                        <label className="custom-checkbox">
                            <input
                                type="checkbox"
                                checked={item.members.every(member => member.included)}
                                onChange={() => toggleAllMembers(index)}
                            />
                            <span className="checkbox-label"></span> {/* For custom checkbox design */}
                        </label>
                        Toggle All&nbsp;
                        {item.members.map(member => (
                            <div key={member.id} className="member-checkbox">
                                <label className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={member.included}
                                        onChange={() => toggleMember(index, member.id)}
                                    />
                                    <span className="checkbox-label"></span> {/* For custom checkbox design */}
                                </label>
                                {member.name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ItemList;