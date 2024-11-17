## Project setup

First install all the dependencies.

```shell
pnpm install
```

Now you need to create a `.env.local` file on root, this file contains the endpoints and API keys:

```shell
AUTH_SECRET="MySecret"

MONGODB_URI="mongodb+srv://rastreia:<password>@rastre-ia-cluster-1.wtxmq.mongodb.net/rastreia?retryWrites=true&w=majority&appName=Rastre-ia-cluster-1"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="Your Cloudinary Name"

CLOUDINARY_API_KEY="Your API Key from Cloudinary"

CLOUDINARY_API_SECRET="Your API Secret from Cloudinary"

CLOUDINARY_URL="Your Cloudinary Url"

NEXT_PUBLIC_BACKEND_URL="http://localhost:3000/api"

EMBEDDING_ENDPOINT_URL="http://127.0.0.1:8000"
```

## To run use:

```shell
pnpm dev
```

## To add shadcn componets:

```shell
npx shadcn@latest add <component-name>
```

## Users for testing purposes

**Normal user**:

-   CPF: 12345678900
-   Password: 123123

**Police station**:

-   email: pf@toledo.br
-   Password: 123123

## Acknowledgements

-   [BrasilAPI](https://brasilapi.com.br/)
-   [Cloudinary](https://cloudinary.com/)
-   [Nominatim](https://nominatim.org/)
