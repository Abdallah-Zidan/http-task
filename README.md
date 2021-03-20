# http-task

Modern, promise & task based http client for nodejs

## Table of Contents

- [Features](#features)
- [Installing](#installing)
- [Examples](#examples)
- [Task vs Promise](#task)
- [Credits](#credits)
- [License](#license)

## Features

- Send http requests as promises or tasks
- Conversion from tasks back to promise
- Useful operators for response transformation
- Parsing json responses
- informative error message.
- [New] task based requests for advanced control [task mapping, chaining , concurrency]
- It uses axios so it supports all what axios supports

## Installing

- Not there yet but will be as following

Using npm:

```bash
$ npm install http-task
```

Using yarn:

```bash
$ yarn add http-task
```

## Examples

```js
// promise based
const { request, sendRequest, Types, Request } = require("http-task");

// this approach allows for configuring and sending the request later
let r = request({
  url: "https://jsonplaceholder.typicode.com/todos/1",
  enableDefaultInterceptors: true,
});

r.allowUnauthorized()
  .setContentType(Types.XML)
  .send()
  .then(console.log)
  .catch(console.log);

// or alternatively

sendRequest({
  url: "https://jsonplaceholder.typicode.com/todos/1",
  enableDefaultInterceptors: true,
  allowUnauthorized: true,
  headers: {
    "Content-Type": Types.XML,
  },
})
  .then(console.log)
  .catch(console.log);

// fork a new request from previous one's configurations
Request.from(r)
  .addConfig({
    url: "<different url>",
  })
  .send()
  .then(console.log)
  .catch(console.log);
```

## Todo

    - more examples coming

## Credits

    - Abd Allah Zidan

## License

    - MIT
