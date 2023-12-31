import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './AddExpenseModal.css';
import ItemList from "./ItemList";
import {createGroupExpense} from "../../services/SplitwiseAPI";
import Select from 'react-select' // Import the CSS file for styling

const AddExpenseModal = ({isOpen, onClose, groups, allFriends}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="modal-overlay" onClick={onClose}/>
            <div className="modal">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <div className="modal-content"><ModalChildren groups={groups} onClose={onClose}
                                                              allFriends={allFriends}/></div>
            </div>
        </>,
        document.getElementById('modal-root') // This is where the modal will be mounted in the HTML
    );
};

const ModalChildren = (props) => {

    const [selectedGroupId, setSelectedGroupId] = useState(props.groups[0]?.id || '');
    const selectedGroup = props.groups.find(group => group.id == selectedGroupId);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const groupMembers = selectedGroup ? selectedGroup.members : [];

    const sortedGroups = props.groups.sort((a, b) => {
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
        props.onClose();
    }

    return (
        <>
            <div className="dropdown-container">
                Select A Group:&nbsp;
                <select value={selectedGroupId} onChange={handleSelectionChange}>
                    {sortedGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedGroupId == 0 && <Select options={props.allFriends.map(item => ({
                value: item,
                label: item.first_name
            }))} isMulti={true} onChange={(selected) => {
                selected = selected.map(s => s.value)
                selected = [...selected, {
                    email: "femin.dharamshi1999@gmail.com",
                    first_name: "Femin",
                    last_name: "Dharamshi",
                    id: 15746973
                }]
                setSelectedFriends((selected));
            }}/>}
            <ItemList groupMembers={selectedGroupId == 0 ? selectedFriends : groupMembers} saveExpense={saveExpense}/>
        </>
    );
}

export default AddExpenseModal;