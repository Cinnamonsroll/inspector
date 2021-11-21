#!/user/bin/bash

# Only use this script for replit

if "$(node -v)" =~ "16."
then
    echo "Using latest nodejs version"
else
    echo "Installing latest nodejs version..."
    npm init -y && npm i --save-dev node@16 && npm config set prefix=$(pwd)/node_modules/node && export PATH=$(pwd)/node_modules/node/bin:$PATH
fi
    echo "Starting..."
    npx prisma db pull && npx prisma generate && npx tsc && cd dist && clear && ../node_modules/.bin/node index.js