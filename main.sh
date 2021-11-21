#!/user/bin/bash

# Only use this script for replit

echo "Installing latest nodejs version..."

npm i --save-dev node@16 
npm config set prefix=$(pwd)/node_modules/node 
export PATH=$(pwd)/node_modules/node/bin:$PATH

echo "Starting..."

npx prisma db pull 
npx prisma generate 
npx tsc 
clear 
cd dist && ../node_modules/.bin/node index.js