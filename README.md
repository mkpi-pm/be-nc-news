# Northcoders News API

## Background:

This API is built for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

This database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Add to:

The database connection settings can be set using environment variables stored in a files. To succesfully connect to the two databases locally don't forget to add the file connection.js to your file system, then create two .env files for your project:

1. .env.test
2. .envdevelopment

Both need to contain PGDATABASE=<database_name_here>. Check for database names in the sql file.
