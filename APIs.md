# Authentication

## Create User

Url:
```bash
POST https:/url/user/create  
```

Body:
```typescript
{
    username: String,
    password: String 
}
```

Response:
```typescript
{
    error: boolean,
    token: String
}
```

## Login User

Url:
```bash
POST https:/url/user/login  
```

Body:
```typescript
{
    username: String,
    password: String
}

```

Response:
```typescript
{
    error: boolean,
    token: String
}
```


## Get User Info

Url:
```bash
POST https:/url/user/me
```

Headers:
```bash
Authorization: Bearer <token>

```

Body:
```typescript
{}

```

Response:
```typescript
{
    username:string,
    userId:string
}
```
