# Architecture Documentation

## API Endpoints

REST API (v1) [Resource](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)

- More features, enhanced security
  - API Keys
  - Per-client throttling
  - Request validation
  - AWS WAF integration: web application firewall, web access control list
  - Private API endpoints
- More costly than HTTP APIs

It is important to veer towards more security for who can read and make changes to these items because there are bad actors who could want to leak exam questions and answers. It is critical that students are appropriately evaluated with fairness and only approved entities are able to fetch and change exam data.

- `POST /api/items` - Create a new exam item
- `GET /api/items/:id` - Retrieve an item by ID
- `PUT /api/items/:id` - Update an item
  - Small updates to an item? E.g. admin changes some tagging metadata?
  - This is still recorded in audit trail.
- `GET /api/items` - List items with pagination
- `POST /api/items/:id/versions` - Create a new version of an item
  - Creates a specific revision of an item and generates a new record
  - This is added to audit trail, updates the version value.
  - Version changes can be defined as the content of the item (answer options or question wording) basically what the student sees on an exam and will be graded against.
- `GET /api/items/:id/audit` - Get audit trail for an item
  - For a given item, retrieve all recorded changes to it including versions and updates

Added Zod validation for the following:

- [x] `POST /api/items` - Create a new exam item
- [x] `GET /api/items/:id` - Retrieve an item by ID

Stretch: Handler factory: Common wrapper for handler validation, error mapping, and logging.

## Data Modeling

- Item storage
  - Read heavy
- Audit Trail
  - Historical data separate to not convolute what is live in item storage
  - Write heavy

**Keys**

- PK Item ID (UUID)

## Infra

## Scalability

## Security

- Authorization

## Trade-offs
