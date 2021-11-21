# inspector

[![DeepScan grade](https://deepscan.io/api/teams/16052/projects/19282/branches/495454/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16052&pid=19282&bid=495454)

The inspector discord bot

## How to get started

### Installation

Make sure you have [node v16] installed and the latest version of npm. (npm comes with node if you install node)

Then clone this github repo.

After you cloned the repo do this command inside the repo folder you cloned

```
npm install
```

### Database

Since this bot uses a postgresql database as its database, you will need to have a postgresql server running and use that for the database part.
I recommend using [supabase](https://supabase.com] as you can get a free postgresql server there.

First signup / login on supabase and create a new project [here](https://app.supabase.io/new/legal-brown-partridge)

Make sure to remember the password you enter for your database, because its gonna be required in the next steps. If you forget it you have to delete the project and create a ne one.

After the project has been created and succesfully created, click on the Database Icon on the left.

Now go to "Connection Pooling" under the "Settings" section and copy the connection string.

Replace `[YOUR-PASSWORD]` in the connection string with the password you created for the Database when you created ur Project.
Also replace `6543` Inside the connection string with `5432`

Your result should look something like this:

```
postgres://postgres:password123@db.project.supabase.co:5432/postgres
```

### Configuring

Make a file in the root of the folder called `.env`
and put something like this inside it

```env
DISCORD_TOKEN="Your discord bot token here"
DATABASE_URL="URL to your postgresql server"
```

If you followed the step to get a supabase postgresql server, you should use that connection string in the `DATABSE_URL` variable.

### Running

First run this command to compile your code.

```
npm run build
```

Then to run the bot just use the `npm run start` command. If you followd all the steps above the bot should be running succesfully.
