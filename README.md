# Husky Habits Backend


## Setup

Download [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable), a JavaScript package manager.

Install dependencies: `yarn install`

### MongoDB

MongoDB is a [NoSQL](https://www.mongodb.com/nosql-explained) database that features high availability and flexible data modeling.

[Download MongoDB Community Server 5.0.5](https://docs.mongodb.com/manual/administration/install-community/)

*For MacOS, I recommend downloading with Homebrew with commands below.

**Install Brew (if you don’t have it already):**

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Install MongoDB Homebrew tap:**

```bash
brew tap mongodb/brew
brew install mongodb-community # installs latest MongoDB Community Server 5.0.x
```

## Development
*Use two terminal tabs to run the Husky Habits server and MongoDB database.*

### Run Server

`yarn start`


### Run Database
**Run `mongodb-community`:**
- MacOS: `brew services start mongodb-community`

**Connect to MongoDB server/database:**

```bash
mongo
use huskyhabits
```