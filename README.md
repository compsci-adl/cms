# cms
The Computer Science Club's CMS

## Setup

1. Setup database to be used with Payload (payload is setup for mongoDB), then include DB URI in the `.env` under `DATABASE_URI`. MongoDB will be in the form `mongodb://[username:password@]host[/[defaultauthdb][?options]] ` 
    - Options can be left out along with username and password if desired

2. Create a secure secret and include in `.env` under `PAYLOAD_SECRET`.

3. Navigate to `payload-cms` directory and start the payload instance with: 
```
pnpm dev
```

## User
The root user is seeded into database upon first load with the credentials:
```
email: 'dev@csclub.org.au'
password: 'test'
```
This user has admin permissions to create more users and give further permissions.