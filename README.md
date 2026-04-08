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
