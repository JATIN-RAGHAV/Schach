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
    pass: String 
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
    pass: String
}

```

Response:
```typescript
{
    error: boolean,
    token: String
}
```
