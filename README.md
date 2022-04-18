# Vercel Dynamic DNS

Vercel (formerly Zeit) offer a domains service backed by their own nameservers and API. Similarly to a domain managed via Cloudflare, it is relatively simple to set up a domain you own that can act as a dynamic DNS.

The program here is a small daemon you can run standalone or as a docker container in order to manage a subdomain for a domain you own.

It is run via environment variables of which there are three

`VERCEL_API_KEY` = Your API key from Vercel, you can get this [here](https://vercel.com/account/tokens).

`DOMAIN` = The domain, as a string, that you are looking to change the records for (eg. `example.com`)

`SUBDOMAIN` = The name you are looking to dynamically update with the program's host IP as a string (eg. `dynamic`.)

## Running it

### Without Docker

1. Clone the repo.
2. Run `yarn` to install dependencies


### With Docker
1. Run `docker pull mtaylor/vercel-dynamic-dns`
2. Start the container with your environment variables in tow with `docker run -e VERCEL_API_KEY=key -e DOMAIN=domain -e SUBDOMAIN=subdomain mtaylor/vercel-dynamic-dns`

### With Docker Compose
1. Clone the repo
2. Fill in your environment varialbes in the `docker-compose.yml` file
3. Run `docker-compose up`
