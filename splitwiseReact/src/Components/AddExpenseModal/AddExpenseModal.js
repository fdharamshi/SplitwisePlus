import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './AddExpenseModal.css';
import ItemList from "./ItemList"; // Import the CSS file for styling

const AddExpenseModal = ({isOpen, onClose, groups}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="modal-overlay" onClick={onClose}/>
            <div className="modal">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <div className="modal-content"><ModalChildren groups={groups}/></div>
            </div>
        </>,
        document.getElementById('modal-root') // This is where the modal will be mounted in the HTML
    );
};

const ModalChildren = (props) => {

    const [selectedGroupId, setSelectedGroupId] = useState(props.groups[0]?.id || '');
    const selectedGroup = props.groups.find(group => group.id == selectedGroupId);
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

    return (
        <>
            <div>
                Select A Group:&nbsp;
                <select value={selectedGroupId} onChange={handleSelectionChange}>
                    {sortedGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </div>
            <ItemList groupMembers={groupMembers}/>
        </>
    );
}

export default AddExpenseModal;