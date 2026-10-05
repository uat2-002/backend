# Backend Setup and Troubleshooting

## Install dependencies

After cloning the repository, install the project dependencies in the backend folder:

```bash
cd backend
npm install
```

If the terminal shows errors like:

```bash
Cannot find module 'jsonwebtoken'
Cannot find module 'cors'
```

that means the Node modules are not installed or the install is stale. Fix it with:

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

Then verify the project compiles:

```bash
npm run build
npm test
```

## Prisma setup

```bash
npx prisma migrate dev --name init
npx prisma migrate
npx prisma generate
```

## Common team fix

When another developer pulls the latest code and sees missing package errors, this is the standard fix:

```bash
cd backend
npm install
npm run build
```

If the issue persists, delete the local install and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```
