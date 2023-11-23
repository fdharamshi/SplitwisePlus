import React, {useEffect, useState} from 'react';
import Itemization from "../../pages/Itemization";
import './ItemList.css';

const ItemList = ({groupMembers, saveExpense}) => {
    const [items, setItems] = useState([]);
    const [tip, setTip] = useState(0.0);
    const [tax, setTax] = useState(0.0);

    const formatRequest = () => {
        const memberCosts = calculateMemberCost();
        const formattedRequest = {};
        let totalBillWithTipTax = 0.0;
        formattedRequest['cost'] = totalBillWithTipTax;

        groupMembers.forEach((member, index) => {
            const memberCost = memberCosts.get(member.id);
            const owedShare = memberCost ? memberCost.totalCost + memberCost.tipShare + memberCost.taxShare : 0;

            formattedRequest[`users__${index}__user_id`] = member.id;
            formattedRequest[`users__${index}__first_name`] = member.first_name;
            formattedRequest[`users__${index}__last_name`] = member.last_name || '';
            formattedRequest[`users__${index}__email`] = member.email;
            formattedRequest[`users__${index}__owed_share`] = owedShare.toFixed(2);
            totalBillWithTipTax = (Number(totalBillWithTipTax) + Number(owedShare)).toFixed(2);

            formattedRequest[`users__${index}__paid_share`] = "0";
        });

        formattedRequest['users__0__paid_share'] = Number(totalBillWithTipTax).toFixed(2);
        formattedRequest['cost'] = totalBillWithTipTax;

        // Construct the notes section
        let notes = "SplitwisePro by Femin Dharamshi\nLearn More at https://github.com/fdharamshi/SplitwisePlus\n\n";
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

    const calculateMemberCost = () => {
        // Initialize a map to hold the total cost for each member
        const memberCosts = new Map(groupMembers.map(member => [member.id, {
            name: `${member.first_name} ${member.last_name ? member.last_name : ''}`,
            totalCost: 0,
            tipShare: 0,
            taxShare: 0
        }]));

        let totalCostWithoutTipTax = 0;

        items.forEach(item => {
            const includedMembersCount = item.members.filter(member => member.included).length;
            if (includedMembersCount === 0) return;

            const eachMemberShare = parseFloat(item.price) / includedMembersCount;
            totalCostWithoutTipTax += parseFloat(item.price);

            item.members.forEach(member => {
                if (member.included) {
                    const memberCost = memberCosts.get(member.id);
                    memberCost.totalCost += eachMemberShare;
                    memberCosts.set(member.id, memberCost);
                }
            });
        });

        // Calculate and distribute tip and tax for each member
        memberCosts.forEach((value, key) => {
            if (value.totalCost > 0) {
                const memberProportion = value.totalCost / totalCostWithoutTipTax;
                value.tipShare = memberProportion * tip;
                value.taxShare = memberProportion * tax;
            }
        });

        // Convert the map back to an array of member costs
        return memberCosts;
    };

    useEffect(() => {
        // Function to initialize members for each item

        // Update each item's members while keeping other properties intact
        const updatedItems = items.map(item => ({
            ...item,
            members: initializeMembers()
        }));

        setItems(updatedItems);
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
            <button onClick={formatRequest}>Save Expense</button>
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