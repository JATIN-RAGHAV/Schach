# schach

This is a chess project I am building.

## To run this just follow the following commands

1. To install dependencies:
```bash
bun install

```

2. Put Database details in `.env.development.local`, example below:

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
