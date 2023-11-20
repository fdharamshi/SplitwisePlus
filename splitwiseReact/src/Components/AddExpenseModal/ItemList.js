import React, {useState} from 'react';
import Itemization from "../../pages/Itemization";

const ItemList = () => {
    const [items, setItems] = useState([]);

    const handleAddItem = () => {
        setItems([...items, {quantity: 0, name: '', price: 0}]);
    };

    const updateItemsFromReceipt = (parsedItems) => {
        // Assuming parsedItems is an array of objects with { quantity, item, price }
        console.log(parsedItems);
        setItems(parsedItems);
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
        const newItems = [...items];
        // Duplicate the item at the given index and insert it after the original item
        const itemToDuplicate = {...newItems[index]};
        newItems.splice(index + 1, 0, itemToDuplicate);
        setItems(newItems);
    };

    const getTotals = () => {
        return items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    }

    return (
        <div>
            <Itemization callback={updateItemsFromReceipt}/>
            <button onClick={handleAddItem}>+ Add An Item</button>
            Total: ${getTotals()}
            {items.map((item, index) => (
                <div key={index} className="item-row">
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
            ))}
        </div>
    );
};

export default ItemList;