#!/bin/bash

# Define the path to your project directory
project_path="/Users/femindharamshi/Documents/SplitwiseReact/splitwiseReact"

# Create the necessary directories
mkdir -p "$project_path/src/components"
mkdir -p "$project_path/src/pages"
mkdir -p "$project_path/src/services"
mkdir -p "$project_path/src/styles"

# Move components into the components directory
mv "$project_path/src/ExpenseRow.js" "$project_path/src/components/"
mv "$project_path/src/SelfExpense.js" "$project_path/src/components/"
# Add more mv commands for other components

# Move pages into the pages directory
mv "$project_path/src/Dashboard.js" "$project_path/src/pages/"
mv "$project_path/src/Landing.js" "$project_path/src/pages/"
# Add more mv commands for other pages

# Move services into the services directory
mv "$project_path/src/SplitwiseAPI.js" "$project_path/src/services/"
mv "$project_path/src/data_processor.js" "$project_path/src/services/"
# Add more mv commands for other services

# Move CSS files into the styles directory
mv "$project_path/src/App.css" "$project_path/src/styles/"
mv "$project_path/src/SelfExpense.css" "$project_path/src/styles/"
# Add more mv commands for other CSS files

echo "Folder structure reorganization complete!"