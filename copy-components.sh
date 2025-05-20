#!/bin/bash

# Create the components directory in .dist/dev if it doesn't exist
mkdir -p .dist/dev/@components

# Copy all component files
cp @components/*.dhtml .dist/dev/@components/

echo "Components copied successfully!"
