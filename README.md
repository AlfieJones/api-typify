<div align="center">
<br />
    <img alt="NPM version" src="https://img.shields.io/npm/v/api-typify?style=for-the-badge">

<!-- PROJECT LOGO -->
<br />
<h1 >api-typify</h1>
<p><b>Write APIs in TypeScript which compile to less than 400 bytes.</b></p>
<p>With this package, developers can effortlessly define accurate and robust type definitions for their API responses, request payloads, and endpoints, reducing the risk of runtime errors and enhancing code maintainability.</p>
</p>
</div>

## Examples

```ts
// api.ts
const routes = {
  GET: {
    "/users/{id}": {
      req: undefined, // Requests body type
      res: User, // Response type
    },
  },
};

const api = getAPI<typeof routes>(
  "https://api.example.com",
  fetch,
);

// Get's the user object
const user = await api.get("/users/{id}", {
  params: {
    id: "123",
  },
});
```
