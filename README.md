> **Warning**
>
> Before using this adapter please carefully read [Caveats](#caveats) section below

# ghost-sso-header
Header SSO Adapter for Ghost

## Prerequisites

This adapter is written for Ghost version 5.35.0, compatability with other versions is unknown

Your load balancer (reverse proxy, API gateway, etc) needs to add request header with user email or user object as JSON string

This can be done with:
- [Hydrate Headers](https://github.com/Catzilla/traefik-hydrate-headers) plugin for [Traefik](https://traefik.io/)
- [cookie_session](https://www.ory.sh/docs/oathkeeper/pipeline/authn#cookie_session) authenticator + [header](https://www.ory.sh/docs/oathkeeper/pipeline/mutator#header) mutator in [Ory Oathkeeper](https://www.ory.sh/oathkeeper/)
- Any other solutions by your choice

## Installation

### Linux

1. Download package via npm:

```shell
npm install @imcatzilla/ghost-sso-header
```

2. Move package to `content/adapters/sso` directory:

```shell
mv node_modules/@imcatzilla/ghost-sso-header/ /path-to-ghost/content/adapters/sso/ghost-sso-header/
```

3. Adjust Ghost configuration with following:

```json
"adapters": {
    "sso": {
        "active": "ghost-sso-header",
        "ghost-sso-header": {
            "header": "X-User",
            "jsonpath": "$.email"
        }
    }
}
```
or use environment variables as described in Ghost [Configuration](https://ghost.org/docs/config/#custom-configuration-files) section

### Docker

Follow steps 1 and 3 from [Linux](#linux) section, and mount adapter as volume in your `docker-compose.yml`:

```yaml
services:
  ghost:
    #...
    volumes:
      - ./node_modules/@imcatzilla/ghost-sso-header:/var/lib/ghost/content/adapters/sso/ghost-sso-header
```

you may also build custom docker image and include adapter inside it

## Configuration

| Key | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `header` | string | `X-User` | Header with user email. Header value must contain email as string if `jsonpath` is omitted |
| `jsonpath` | string | | [JSONPath](https://www.npmjs.com/package/jsonpath) to user email if header value is json string |

All options are optional

## Caveats
- **Malicious users may set user header manually. Make sure that this header get stripped by your load balancer or reverse proxy.** In case you are using [Traefik](https://traefik.io/), you may use [headers middleware](https://doc.traefik.io/traefik/middlewares/http/headers/#adding-and-removing-headers) for this
- This adapter does not automatically create accounts in Ghost. The account must exist in Ghost database to be able to login with SSO
- Ghost uses separate session, so after you logout in your identity provider, you still be authenticated in Ghost
- Logout in Ghost will not work while identity provider session is active
- Direct login with Ghost email/password still work when no identity provider session is active
- Use this adapter at your own risk, and do not consider it "production-ready". I wrote it for my personal projects, so no warranties at all
