# Karaschan E-Commerce API

Karaschan API's a RESTful API for an E-Commerce platform.

For the DB ERD see [src/db/README.md](src/db/README.md)

The ERD is written in [Mermaid](https://mermaid.js.org/syntax/entityRelationshipDiagram.html)


## Routes

| URI                         |                     Description                     | Method |
| :-------------------------- | :-------------------------------------------------: | :----- |
| /api/auth/signup            |                   Sign up a user.                   | POST   |
| /api/auth/signin            |                   Sign in a user.                   | POST   |
| /api/products               |  Get all products. paginated with limit & offset.   | GET    |
| /api/carts                  |     Create a cart for currently signed in user.     | POST   |
| /api/carts                  |       Get cart for currently signed in user.        | GET    |
| /api/carts/items            | Get all cart items. paginated with limit & offset.  | GET    |
| /api/carts/items            |                  Add item to cart.                  | POST   |
| /api/carts/items/{itemId}   |               Delete item from cart.                | DELETE |
| /api/carts/items/{itemId}   |                Update item in cart.                 | PATCH  |
| /api/orders                 |    Create an order for currently signed in user.    | POST   |
| /api/orders                 |    Get all orders for currently signed in user.     | GET    |
| /api/orders/{orderId}/items | Get all order items. paginated with limit & offset. | GET    |
