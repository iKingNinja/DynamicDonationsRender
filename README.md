# Roblox DynamicDonations

This repository contains an ExpressJs server that creates dynamic developer products.

# Requirements
- Node.js >= 18 [Download](https://nodejs.org/en)
- MySQL >= 8.0 [Download](https://dev.mysql.com/downloads/mysql/)

## Endpoints
- **POST** /api/v1/donations/developer-products

This endpoint creates developer products with data supplied by the client. when `coverTax` is `true`, the server will increase the price by 30% to cover the Roblox tax.


```ts
{
    data: {
        price: number,
        coverTax: boolean
    }
}
```

## Setup development environment

1. Install Node.js and MySQL
2. Configure MySQL database

- On Windows open a Command Prompt
- Run `cd C:\Program Files\MySQL\MySQL Server 8.0\bin`
- Run `mysql -u root -p`
- Enter the password you set for the root user when you installed MySQL
- Run `CREATE DATABASE dynamicdonations`
- Run `CREATE USER '<username>'@'localhost' IDENTIFIED BY '<password>';`
- Grant the new user all privileges to all tables of the dynamicdonations database. Run `GRANT ALL PRIVILEGES ON dynamicdonations.* TO '<username>'@'localhost';`
- Close the MySQL shell
- cd into the root folder of the project. For example if you cloned this repository on your Desktop, run `cd %USERPROFILE%/Desktop`
- Run `npm i` to install all the required dependencies
- If you don't have the TypeScript package globally installed, run `npm i -g typescript` to install it globally on your machine
- Run `npx prisma db push` to configure database tables
- Run `npx prisma generate` to generate the Prisma client
- Create a `ssl` folder in the root folder of the project
- Paste your SSL signing key and certificate files in the `ssl` folder
- Rename the signing key file to `key.pem` and the certificate file to `certificate.pem`
- Create a `.env` file in the root folder of the project
- In the `.env` file configure the environment variables. Use the template below.
```
# Server config

HTTP_PORT = 80
HTTPS_PORT = 443

# Credentials

DATABASE_URL="mysql://<mysql_username>:<mysql_password>@localhost:3306/dynamicdonations"
API_KEY = <The_API_Key_You_Want_To_Secure_The_Server_With>
ROBLOSECURITY = <Your_ROBLOSECURITY_Cookie>
```
- Run `tsc` to compile the project
- Run `node .` to start the server

# Setup production environment

In a production environment you can set environment variables at a machine level so you do not need a `.env` file.
On a Linux machine:
- Open a terminal
- Run `export NODE_ENV=production` to configure the NODE_ENV environment variable.
- RUN `export <Env_Var_Name>=<value>` to configure all other environment variables listed above.
- In the root directory of the project run `npm i --omit=dev`
- Follow the same steps for the development environment to configure MySQL and the rest of the server