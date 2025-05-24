import React, {useState, useEffect} from 'react';
import Tesseract from 'tesseract.js';
import styled from 'styled-components';

const ItemizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const UploadButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #5bc5a7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
    margin-top: 0.5rem;
  }
`;

const ItemsContainer = styled.div`
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    overflow-x: auto;
  }
`;

const ItemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 0.5rem;
    border: 1px solid #ddd;
    text-align: left;
    
    @media (max-width: 768px) {
      padding: 0.4rem;
    }
  }
  
  th {
    background-color: #f5f5f5;
  }
`;

// TODO: Add different types of price formats

const Itemization = (props) => {
    const [image, setImage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [ocrProgress, setOcrProgress] = useState(0);
    const [items, setItems] = useState([]);

    const handleChange = (event) => {
        if (event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleUpload = () => {
        setIsProcessing(true);
        Tesseract.recognize(
            image,
            'eng',
            {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setOcrProgress(m.progress);
                    }
                    console.log(m);
                }
            }
        ).then(({data: {text}}) => {
            setIsProcessing(false);
            setOcrProgress(0); // Reset progress
            // Here you need to implement the logic to parse the text and extract items and prices
            // This is a placeholder for demonstration
            console.log(text);
            const receiptItems = parseReceipt(text);
            console.log(receiptItems);
            setItems(receiptItems);
            props.callback(receiptItems);
        });
    };

    const parseReceipt = (text) => {
        const lines = text.split('\n');

        // A regex to match a line with an optional quantity at the start, followed by item description, and ending with a price.
        // const itemLineRegex = /^(\d+\s+)?(.+?)\s+(\d+[\.,]\d{2})$/;
        const itemLineRegex = /^(\d+\s+)?(.+?)\s+([S$]*\d+[\.,]\d{2})$/;

        // A regex to identify lines that likely don't contain items - such as headers, totals, etc.
        const nonItemLineRegex = /(subtotal|total|tax|tip|balance due|server|guests|date|time|change|cash|card|pay|cc|check|^\s*$)/i;

        const items = [];

        lines.forEach((line) => {
            // Trim the line to remove whitespace from the beginning and end
            line = line.trim();

            // Skip non-item lines, empty lines, and lines that don't contain a price
            if (nonItemLineRegex.test(line) || !itemLineRegex.test(line)) return;

            // Match the line against our item line regex
            const match = line.match(itemLineRegex);
            if (match) {
                // If a quantity is found, use it; otherwise, default to 1
                const quantity = match[1] ? parseInt(match[1].trim(), 10) : 1;
                const name = match[2].trim();
                const price = match[3].replace(',', '.').replace('$', ''); // Replace comma with dot for standardization

                // Check for a valid item name and price format
                if (name && price && !isNaN(parseFloat(price))) {
                    items.push({quantity, name, price});
                }
            }
        });

        return items;
    };

    return (
        <ItemizationContainer>
            <FileInputContainer>
                <input type="file" onChange={handleChange} accept="image/*"/>
                {!isProcessing && !image && (
                    <UploadButton disabled={true}>Select an image to continue</UploadButton>
                )}
                {image && (
                    <>
                        <UploadButton onClick={handleUpload} disabled={isProcessing}>
                            {isProcessing ? `Processing... ${Math.round(ocrProgress * 100)}%` : 'Upload and Process'}
                        </UploadButton>
                        <div style={{ marginTop: '1rem' }}>
                            <img src={image} alt="Receipt" style={{maxWidth: '100%', maxHeight: '300px'}} />
                        </div>
                    </>
                )}
                {isProcessing && (
                    <div style={{
                        width: '100%',
                        backgroundColor: '#ddd',
                        borderRadius: '4px',
                        margin: '10px 0',
                        overflow: 'hidden' // To maintain the border-radius effect
                    }}>
                        <div style={{
                            height: '20px',
                            backgroundColor: '#2a9d8f',
                            width: `${ocrProgress * 100}%`,
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                )}
            </FileInputContainer>

            {items.length > 0 && (
                <ItemsContainer>
                    <h3>Extracted Items:</h3>
                    <ItemTable>
                        <thead>
                            <tr>
                                <th>Quantity</th>
                                <th>Item</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.quantity || '1'}</td>
                                    <td>{item.name}</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </ItemTable>
                </ItemsContainer>
            )}
        </ItemizationContainer>
    );
};

export default Itemization;