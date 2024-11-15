# Api architecture

This db api shall follow the following architecture unless otherwise specified.

-   `api /posts/route.ts`:
    -   `GET` (Get a list of all posts)
    -   `POST` (Add a post)
-   `api/posts/[id]/route.ts` :
    -   `GET` : get post via ID
    -   `PUT` : update post from ID
    -   `DELETE` : delete post from ID
