# MTG deck builder

An app that makes it possible to build mtg decks based on a set of cards and their prices

## Client

## Server

## Other

To start the development database. In root directory run:

`docker compose -f docker-compose-pg-dev.yml up -d`

To stop the development database. Write the following command:

`docker kill <name_of_the_container>` 

To enter the dev database from the command line:

`docker exec -it mtg-deck-builder-dev-postgres-1 psql -U user mtg-deck-builder-dev-db`

The developer can fill the development database with data (to see the content of the data, look inside /server/utils/filldatabase the passwords for the both created users is "password") with the following command:

`server\npm run dev:filldatabase`

To reset the database run the following command:

`server\npm run dev:migration:down`