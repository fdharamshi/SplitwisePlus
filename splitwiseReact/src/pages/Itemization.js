import React, {useState} from 'react';
import Tesseract from 'tesseract.js';

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
            const receiptItems = parseReceipt(text);
            setItems(receiptItems);
            props.callback(receiptItems);
        });
    };

    const parseReceipt = (text) => {
        const lines = text.split('\n');

        // A regex to match a line with an optional quantity at the start, followed by item description, and ending with a price.
        const itemLineRegex = /^(\d+\s+)?(.+?)\s+(\d+[\.,]\d{2})$/;

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
                const price = match[3].replace(',', '.'); // Replace comma with dot for standardization

                // Check for a valid item name and price format
                if (name && price && !isNaN(parseFloat(price))) {
                    items.push({quantity, name, price});
                }
            }
        });

        return items;
    };

    return (
        <div>
            <input type="file" onChange={handleChange} accept="image/*"/>
            <button onClick={handleUpload} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Upload and Process Receipt'}
            </button>
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
                    }}>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Itemization;