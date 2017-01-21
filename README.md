## Run

`npm run build` or `npm run watch`

`npm start`

Use query parameter `state=finished` to by pass init phase

## Develop l1-lite simultaniously

Change package.json to:

```json
"dependencies": {
  "l1-lite": "../l1-lite"
}
```

Run `npm run i` to reinstall only l1-lite
