# inspector

[![DeepScan grade](https://deepscan.io/api/teams/16052/projects/19282/branches/495454/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16052&pid=19282&bid=495454)
[![Prettier](https://github.com/link-discord/inspector/actions/workflows/prettier.yml/badge.svg)](https://github.com/link-discord/inspector/actions/workflows/prettier.yml)

The inspector discord bot

## How to get started

### Installation

#### Locally

Make sure you have the latest version of [node](https://nodejs.org) installed and the latest version of npm. (npm comes with node if you install node)

Then clone this github repo.

After you cloned the repo do this command inside the repo folder you cloned

```
npm install
```

#### Replit

You can also [fork](https://replit.com/@InspectorBot/inspector) the bot on replit.

### Database

Since this bot uses a postgresql database as its database, you will need to have a postgresql server running and use that.

Your [connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) should look something like this:

```
postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]
```

Make sure to replace the placeholders with their respective values.

#### Supabase

I recommend using [supabase](https://supabase.com] as you can get a free postgresql server there.

First signup / login on supabase and create a new project [here](https://app.supabase.io/new/legal-brown-partridge)

Make sure to remember the password you enter for your database, because its gonna be required in the next steps. If you forget it you have to delete the project and create a ne one.

After the project has been created and successfully created, click on the Database Icon on the left.

Now go to "Connection Pooling" under the "Settings" section and copy the connection string.

Replace `[YOUR-PASSWORD]` in the connection string with the password you created for the Database when you created ur Project.
Also replace `6543` Inside the connection string with `5432`

Your connection string should look something like this:

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

After you added the `.env` file and filled out all values, make sure to run this command to configure the database.

```
npx prisma migrate dev
```

Make sure to run that command each time you change something in the `prisma/schema.prisma` file.

### Running

To run the bot just use the these commands (in correct order). If you followd all the steps above the bot should be running successfully.

```
npm run build
npm run start
```

## License

This project is licensed under the [GNU General Public License v3.0](https://github.com/link-discord/inspector/blob/main/LICENSE).  
For more information about conditions and other things, click on the link above.
