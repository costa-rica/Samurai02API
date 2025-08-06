# Samurai 01 API

## Install

### Step 1: Clone the repository

```bash
$ git clone https://github.com/nickrodriguez/Samurai01API.git
```

### Step 2: Clone Samurai01Db

```bash
$ git clone https://github.com/nickrodriguez/Samurai01Db.git
```

- place the Samurai01Db folder in the same directory as the Samurai01API folder.

### Step 3: Install dependencies

```bash
$ npm install
```

### Step 4: Set up environment variables

```env
APP_NAME=Samurai01
JWT_SECRET=Samurai01_SECRET
NAME_DB=samurai01.db
PATH_DATABASE=/Users/nickrodriguez/Documents/_databases/Samurai01/
ADMIN_EMAIL_CREATE_ON_STARTUP=["nrodrig1@gmail.com"]
```

- necessary: JWT_SECRET, NAME_DB, PATH_DATABASE

### Step 5: Start the server

```bash
$ npm start
```
