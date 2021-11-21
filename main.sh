#!/user/bin/bash

# Only use this script for replit

echo "Installing latest nodejs version..."

npm i --save-dev node@16 
npm config set prefix=$(pwd)/node_modules/node 
export PATH=$(pwd)/node_modules/node/bin:$PATH

echo "Installing packages..."

npm ci

if [ $? -eq 0 ]
then
    echo "Building..."
else
    clear
    npm install
    echo "Building..."
fi

# Automatic Sync with database

npx prisma db push
npx prisma db pull 
npx prisma generate 

# Typescript Compiler

npx tsc 

clear

# Start the bot

cd dist && ../node_modules/.bin/node index.js