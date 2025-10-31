#!/bin/bash

# Create dist directory
mkdir -p dist

# Copy all HTML files
cp *.html dist/

# Copy CSS
cp style.css dist/

# Copy directories
cp -r js dist/
cp -r img dist/
cp -r sounds dist/
cp -r public dist/