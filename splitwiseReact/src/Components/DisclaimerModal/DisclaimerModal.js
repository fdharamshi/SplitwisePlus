import React, {useState} from 'react';
import './DisclaimerModal.css'; // You'll need to create this CSS file for styling
import instruction1 from '../../Assets/instruction1.png';
import instruction2 from '../../Assets/instruction2.png';
import instruction3 from '../../Assets/instruction3.png';

function DisclaimerModal(props) {

    const [showInstructions, setShowInstructions] = useState(false);

    const handleContinue = () => {
        if (!showInstructions) {
            setShowInstructions(true);
        } else {
            props.onContinue();
        }
    };

    const onBackdropClick = (event) => {
        // Check if the click was on the backdrop; if so, close the modal
        if (event.currentTarget === event.target) {
            props.onClose();
        }
    };

    const getInstructions = () => {
        return (
            <>
                <h3>Instructions to get the API key</h3>
                <h4>1. Register your application</h4>
                <img src={instruction1} alt="Instructions"/>
                <h4>2. Enter details as below:</h4>
                <img src={instruction2} alt="Instructions"/>
                <h4>3. Get API Key</h4>
                <img src={instruction3} alt="Instructions"/>
            </>
        );
    }

    const getDisclaimers = () => {
        return (<>
            <h3>Disclaimers</h3>

            <h4>Independent Project Disclaimer:</h4>
            <p>"This application is an independent project and is not affiliated with, endorsed by, or in
                any way officially connected with Splitwise, Inc. The official Splitwise website can be
                found at <a href='http://www.splitwise.com'>www.splitwise.com</a>."</p>

            <h4>API Key Disclaimer:</h4>
            <p>"Users of this application must provide their own Splitwise API key to access their data. By
                using your Splitwise API key, you acknowledge and agree that you are responsible for
                complying with Splitwise’s API Terms of Use, and any data usage or manipulation performed
                through this application is at your own risk."</p>

            <h4>No Warranty Disclaimer:</h4>
            <p>"This application is provided 'as is' without any representations or warranties, express or
                implied. We make no representations or warranties in relation to this application or the
                information and materials provided on this application. We do not warrant that this
                application will be constantly available, or available at all; or that the information on
                this application is complete, true, accurate, or non-misleading."</p>

            <h4>Limitation of Liability:</h4>
            <p>"We will not be liable to you (whether under the law of contact, the law of torts, or
                otherwise) in relation to the contents of, or use of, or otherwise in connection with, this
                application: for any indirect, special, or consequential loss; or for any business losses,
                loss of revenue, income, profits or anticipated savings, loss of contracts or business
                relationships, loss of reputation or goodwill, or loss or corruption of information or
                data."</p>

            <h4>Functionality and Service Disclaimer:</h4>
            <p>"The functionalities provided by this application are dependent on the API provided by
                Splitwise and may change if the API changes. We are not responsible for any changes in the
                API functionality or availability that may affect the performance of this application."</p>

            <h4>User Responsibility:</h4>
            <p>"Users are solely responsible for any actions taken through this application, including but
                not limited to adding, editing, or deleting expenses. Users must ensure that their use of
                this application complies with Splitwise’s terms and conditions, and applicable laws and
                regulations."</p>

            <h4>Data Privacy and Security:</h4>
            <p>"Users must ensure that they have the right to access and manage the data they process using
                this application. Users should protect the confidentiality of their API keys and personal
                data. This application does not store user data or API keys on its servers."</p>
        </>);
    }


    return (
        <div className="modal-backdrop" onClick={onBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{showInstructions ? 'Get API Key' : 'Disclaimer'}</h5>
                    <button type="button" onClick={props.onClose}>×</button>
                </div>
                <div className="modal-body">
                    {showInstructions ? (
                        getInstructions()
                    ) : (
                        getDisclaimers()
                    )}
                </div>

                <div className="modal-footer">
                    <button type="button" onClick={handleContinue}>
                        {showInstructions ? 'Get API Key' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DisclaimerModal;