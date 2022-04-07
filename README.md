# NAB-challenge

![CI](https://github.com/chan-nguyen/nab-challenge/workflows/CI/badge.svg)

## High-level solution diagram

The project is designed and developed with monorepo architecture.

Two services are developed to demonstrate the backend APIs:

- `Shop` service: manages products, variants.
- `History` service: saves user's activities.

Depending on the requests, the `Shop` service may call the `History` service to save user's activities.

The website and internal web apps are supposed to developed also within this architecture.

![High-level solution diagram](media/solution-diagram.png?raw=true 'High-level solution diagram')

## Sequence diagrams

The challenge is implemented with 4 scenarios:

- The user goes to a product listing page to view all products
- The user clicks on a product to go to the product page
- The user searches for products by typing a keyword
- The sale/marketing staff views historical activities of a user via the Sales/Marketing web app.

The followings are sequence diagrams of the 4 use-cases.

### User views all products

<img src="media/view-products-sd.png?raw=true" width="75%" alt='User view products sequence diagram'>

### User views a product

![User view a product sequence diagram](media/view-product-sd.png?raw=true)

### User searches for products

![User search for products sequence diagram](media/search-products-sd.png?raw=true)

### Marketing/sale views historical activities of a user

<img src="media/view-activities-sd.png?raw=true" width="75%" alt='User view products sequence diagram'>

## Entity relationship diagrams

- The project is designed with micro service principles.
- Each service has its own database and communicate via REST APIs.
- Tables and fields in each diagram are defined with basic data and relationships.

### Shop service

![Shop ER diagram](media/shop-er-diagram.png?raw=true 'Shop ER diagram')

### History service

![History ER diagram](media/history-er-diagram.png?raw=true 'History ER diagram')

## Software development principles, patterns & practices

Architecture

- Monorepo
- Micro services

Pattern

- Functional programming

Practices

- Testing: unit, integration
- CI : build with github actions

## Code folder structure and the libraries / frameworks being used

The project is structured with two main folders:

- `services`: contains all backed services, i.e. `shop` and `history`
- `packages`: contains libraries that are shared between services, concretly:
  - `db`: manages db connection and query
  - `http`: manages backend servers and middlewares
  - `logger`: provides logging feature for dev and production mode

```
project
│    README.md
│    LICENSE
|    package.json
│
└─── packages
│    │
│    └─── db
|    |
│    └─── http
|    |
│    └─── logger
|
└─── services
     |
     └─── history
     |
     └─── shop
```

The project is developed with `typescript`. Main framework/libraries are used:

- koajs
- pg
- ts-node
- jest
- mocha
- chai
- sinon
- supertest
- nodemon

Formatters for code and git commit:

- eslint
- prettier
- husky
- commitlint

## Steps to get the applications run on local

### Prepare database

Make sure that Postgresql is installed and run.

If you want to run Postgresql by docker, you could use:

```
docker run --rm --name pg-docker -e POSTGRES_PASSWORD=yourpassword -d -p 5432:5432 -v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres:12

psql -h localhost -p 5432 -U postgres
(type: yourpassword)
```

#### Create `shop` database and seed data

Create database and grant privileges for db user.

Information of the database and db user must be matched with data declared in `services/shop/.env`

```
CREATE DATABASE nab_shop;

CREATE USER goku WITH ENCRYPTED PASSWORD 'nimbuscloud';

GRANT ALL PRIVILEGES ON DATABASE nab_shop TO goku;
```

Database of `shop` is prepared in the `databases/shop.sql`. You may need to restore them to have some data for testing.

The database is prepared with `145 colors`, `86 sizes`, `20 products` and `100 variants`

Command to restore DB:

```
pgsql -U goku -d nab_shop < shop.sql
```

If you run Postgresql by docker, the restore command would be:

```
cat shop.sql | docker exec -i pg-docker psql -U goku -d nab_shop
```

#### Create `history` database

Information of the database and db user must be matched with data declared in `services/history/.env`

```
CREATE DATABASE nab_history;

CREATE USER chichi WITH ENCRYPTED PASSWORD 'helmet';

GRANT ALL PRIVILEGES ON DATABASE nab_history TO chichi;
```

Database of `history` is prepared in the `databases/history.sql` with
`50 users` and `4 activity types`.

To restore the `history` DB:

```
psql -U chichi -d nab_history < history.sql
```

If you run Postgresql by docker:

```
cat history.sql | docker exec -i pg-docker psql -U chichi -d nab_history
```

### Clone code and run

Clone the code from this repository and install packages.

```
git clone git@github.com:chan-nguyen/nab-challenge.git

cd nab-challenge

yarn install
```

Start the `shop` service

```
yarn workspace shop start
```

The `shop` service should be running at http://localhost:8080

Open another terminal, start the `history` service

```
yarn workspace history start
```

The `history` service should be running at http://localhost:8090

## CURL commands to verify APIs

The followings are some examples of CURL commands. You are free to change the search string or the Id of user and variant for testing.

### List products

```
curl 'http://localhost:8080/products --header 'user-id: 1'
```

### Search for products

```
curl 'http://localhost:8080/products?s=ca' --header 'user-id: 1'

curl 'http://localhost:8080/products?s=metal' --header 'user-id: 2'
```

### Get product variant

```
curl 'http://localhost:8080/variants/17' --header 'user-id: 1'

curl 'http://localhost:8080/variants/22' --header 'user-id: 1'
```

### Get user activities

```
curl 'http://localhost:8090/users/1/activities'

curl 'http://localhost:8090/users/2/activities'
```
