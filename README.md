# inspector

[![DeepScan grade](https://deepscan.io/api/teams/16052/projects/19282/branches/495454/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16052&pid=19282&bid=495454)

The inspector discord bot

## How to get started

### Installation

Make sure you have [node v16] installed and the latest version of npm. (npm comes with node if you install node)

Then clone this github repo.

After you cloned the repo do these commands inside the repo folder you cloned

`npm install`</br>
`npm run build`

### Configuring

Make a file in the root of the folder called `.env`
and put something like this inside it

```env
DISCORD_TOKEN="Your discord bot token here"
DATABASE_URL="URL to your postgresql server"
```

### Running

To run the bot just use the `npm run start` command. If you did everything succesfully the bot should be running succesfully.
