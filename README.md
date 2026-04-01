# schach

This is a chess project I am building.

## Prerequisites
- [bun](https://bun.sh/)

## To run this just follow the following commands

1. To install dependencies:
```bash
git clone https://github.com/jatin-raghav/schach.git # to install codebase
cd schach
bun install
echo "{}" > src/backend/helper/keys.json

```

2. Put Database details in a file named `.env.development.local` in the root directory, example below:

```

DATABASE_URL=postgres://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
HOST="something.com"
PORT=12345
DATABASE="chess"
USERNAME="avnadmin"
PASSWORD="**********"

```

3. Start Backend
```bash
bun run back
```

4. Start Frontend ( cd to src/frontend )
```
bun run vite
```
