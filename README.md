# healthpassport-node

REST API infrastructure for Healthpassport project UCL/NHS

## Installation

- Install `node` and `npm`
- Clone this repo
- Install node modules with `npm install .`
- Install mysql
- Run setup script with `node setup.js`
- Set global vars

```
export MYSQL_HOST='localhost'
export MYSQL_USER='root'
export MYSQL_PASSWORD='yourpass'
export MYSQL_DATABASE='healthpass'
```

And finally:

```
node app.js
# Express server listening on port 3000
```
