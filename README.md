# cms
The Computer Science Club's CMS


## setup
To setup an payload, first setup any database and include the relevant URI in the `.env` under DATABASE_URI. 

Then create a secure secret and include in the `.env` under PAYLOAD_SECRET. 

Finally, run
```
pnpm dev
```

to start an instance of payload.

## User
The root user is seeded into database upon first load with the credentials:
```
email: 'dev@csclub.org.au'
password: 'test'
```

This user has admin permissions to create more users and give further permissions.