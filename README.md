# Samurai 02 API

## Install

### Step 1: Clone the repository

```bash
$ git clone https://github.com/nickrodriguez/Samurai01API.git
```

### Step 2: Clone Samurai02Db

```bash
$ git clone https://github.com/nickrodriguez/Samurai02Db.git
```

- place the Samurai02Db folder in the same directory as the Samurai01API folder.

### Step 3: Install dependencies

```bash
$ npm install
```

### Step 4: Set up environment variables

```env
APP_NAME=Samurai02
JWT_SECRET=Samurai02_SECRET
NAME_DB=samurai02.db
PATH_DATABASE=/Users/nick/Documents/_databases/Samurai02/
ADMIN_EMAIL_CREATE_ON_STARTUP=["nrodrig1@gmail.com"]
```

- necessary: JWT_SECRET, NAME_DB, PATH_DATABASE

### Step 5: Start the server

```bash
$ npm start
```

## Test that it works from the terminal

### Register

```bash
curl --location 'http://localhost:3000/users/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=someemail@gmail.com' \
--data-urlencode 'password=test'
```

### Login

```bash
    curl --location 'http://localhost:3000/users/login' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'email=someemail@gmail.com' \
    --data-urlencode 'password=test'
```
