import React, {useEffect, useState} from 'react';
import Itemization from "../../pages/Itemization";
import './ItemList.css';

const ItemList = ({groupMembers}) => {
    const [items, setItems] = useState([]);
    const [tip, setTip] = useState(0.0);
    const [tax, setTax] = useState(0.0);

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