# Typescript url shortener

A simple url shortener implemented in Typescript, backed by postgreSQL for storage.

## Running the server

Install dependencies:

```
npm install
```

Add a configuration file (with the name of your desired `NODE_ENV` variable) for the database connection:

```yaml
# config/test-env.yaml
sql:
  host: http://localhost
  user: username
  pass: secret
  database: mydb

```

And then compile and run the server with:

```
npm run build && NODE_ENV=test-env npm run serve
```

You can also run a fully working local stack with **docker compose** with just:

```
docker-compose up
```

Or run only the database via docker-compose:

```
docker-compose up -d pg
```

And stop it via `docker-compose stop`.

## API

The shortener offers two endpoints:

### Shorten a URL

```
POST /api/url
```

Body:

```json
{
  "url": "http://www.example.com"
}
```

Response:

```
201 CREATED
Body: mw2
```

You can then access the url with the shortened version (`mw2` in the example).
**NOTE**: provided urls must be absolute (include the scheme `http(s)://`)

### Access a shortened URL

```
GET /:shortUrl
```

Will redirect to the full url if available.
