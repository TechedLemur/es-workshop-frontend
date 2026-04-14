# Event Sourcing Workshop Frontend

This is the frontend for the event sourcing workshop. It is a simple shopping cart application that uses the workshop API to get the data.

This version of the application is a copy from the [event sourcing workshop](https://github.com/TechedLemur/Event-Sourcing-Workshop) repository that has been modified to use client side queries instead of server side queries. (disclaimer: the move from server side queries to client side queries was done 95% by AI).

The main reason for the swap to client side queries was to make it easier to run the application in docker and make sure it can communicate with the local API (some workshop attendees had port issues when doing server side queries from within docker). Also, it is easier to inspect the network traffic and see what is happening.

The downside of not using server side queries is that we now need to provide the environment variables at build time.

## Getting Started

```bash
npm install
npm run dev
```

## Publishing to docker hub

We want to create a multi-arch image that works on both arm and amd architecture. To do this we need to build with docker buildx.

```sh
docker buildx build --platform linux/amd64,linux/arm64 -f dockerfile -t theazack9/es-workshop-frontend:$TAG --push .
```

### Requirements

For the build command to work, it assumes you have a buildx builder set up to be able to build multi-arch images.

To check if your buildx builder is set up for multi-arch, you can run `docker buildx inspect --bootstrap`. The platforms should contain at least `linux/arm64` and `linux/amd64`.

You might have a builder configured, in that case you can check with `docker buildx ls` and select it with `docker buildx use <NAME>`.

Create on with the commands below, should be a one time setup. It worked for me, might not for you.

```
buildx create --name multiarch --driver docker-container --use
```

