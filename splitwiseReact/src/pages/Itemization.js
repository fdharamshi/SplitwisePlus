import React, {useState} from 'react';
import Tesseract from 'tesseract.js';

// TODO: Add different types of price formats

const Itemization = () => {
    const [image, setImage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
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
                logger: m => console.log(m)
            }
        ).then(({data: {text}}) => {
            setIsProcessing(false);
            console.log(text);
            // Here you need to implement the logic to parse the text and extract items and prices
            // This is a placeholder for demonstration
            const receiptItems = parseReceipt(text);
            setItems(receiptItems);
        });
    };

    // Placeholder function to parse OCR result
    const parseReceipt = (text) => {
        const lines = text.split('\n');

        // A regex to match potential currency formats, e.g., "$9.99", "9.99 USD", "€9,99"
        const priceRegex = /([€$£]?)(\d+[\.,]\d{2})\s*([€$£]?)/;

        // A regex to identify lines that likely don't contain items - such as totals, dates, etc.
        const nonItemRegex = /(total|subtotal|tax|tip|date|cash|change|visa|mastercard|thank you)/i;

        // Array to hold our extracted items
        const items = [];

        lines.forEach(line => {
            // Check if line is likely a non-item line
            if (nonItemRegex.test(line)) return;

            // Find price in line
            const priceMatch = line.match(priceRegex);

            if (priceMatch) {
                // Extracting the item name by removing the price from the line
                const priceIndex = line.indexOf(priceMatch[0]);
                const item = line.substring(0, priceIndex).trim();
                const price = priceMatch[2].replace(',', '.'); // Replace comma with dot for standardization

                // Only add items that have a non-empty name and a valid price format
                if (item && !isNaN(parseFloat(price))) {
                    items.push({item, price});
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
            {items.length > 0 && (
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.item}: {item.price}
                        </li>
                    ))}
                </ul>
            )}
            {image && <img src={image} alt="Receipt" style={{maxWidth: '500px'}}/>}
        </div>
    );
};

export default Itemization;