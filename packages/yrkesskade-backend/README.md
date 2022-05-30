# Yrkesskade backend

Node.js backend med express for yrkesskade frontend apper.
Setter opp en express app med azure autentisering og logging.
Kan konfigureres til å bruke redis gjennom egen konfigurasjon.

> 💡 Ser du etter [dokumentasjon](https://navikt.github.io/yrkesskade-frontend-felles/?path=/story/backend-server--page)?

## Installasjon

```sh
npm install @navikt/yrkesskade-backend
# eller hvis du bruker yarn:
yarn add @navikt/yrkesskade-backend
```

## Miljøvariabler

Pakken krever noen miljøvariabler:

```sh
LOG_LEVEL='info' | 'debug' - ikke påkrevd
```