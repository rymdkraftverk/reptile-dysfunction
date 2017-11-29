## Run

`npm run build` or `npm run watch`

`npm start`

Use query parameter `state=finished` to by pass init phase

## Develop l1 simultaniously

Change package.json to:

```json
"dependencies": {
  "l1": "../l1"
}
```

Run `npm run i` to reinstall only l1
