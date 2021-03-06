#!/user/bin/bash

# Install the latest nodejs version

echo "Installing latest nodejs version..."

# COMMENT OUT THESE COMMANDS BELOW IF UR NOT ON REPLIT

npm i --save-dev node@16

# shellcheck disable=SC2046
npm config set prefix=$(pwd)/node_modules/node

PATH=$(pwd)/node_modules/node/bin:$PATH

export PATH

# Install packages (Comment out the commands below if you have all packages already installed)

echo "Installing packages..."

if npm ci;
then
    clear
else
    npm install
    clear
fi

# Sync with database (Comment out the commands below if you haven't changed the prisma/schema.prisma file)

npx prisma db push --skip-generate
npx prisma db pull
npx prisma generate

# Typescript Compiler

npx tsc

# Start the bot

clear

cd dist && ../node_modules/.bin/node index.js