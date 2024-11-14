## Project setup

First install all the dependencies.

```shell
pnpm install
```

Now you need to create a `.env.local` file on root, this file contains the endpoints and API keys:

```shell
AUTH_SECRET="MySecret"

MONGODB_URI="mongodb+srv://rastreia:<password>@rastre-ia-cluster-1.wtxmq.mongodb.net/rastreia?retryWrites=true&w=majority&appName=Rastre-ia-cluster-1"

NEXT_PUBLIC_BACKEND_URL="http://localhost:3000/api"
```

## To run use:

```shell
pnpm dev
```

## To add shadcn componets:

```shell
npx shadcn@latest add <component-name>
```
