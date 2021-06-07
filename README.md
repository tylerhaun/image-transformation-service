# image-transformation-service

## Use

#### Upload image
POST
http://localhost:3000/images/

#### Transform image
GET
http://localhost:3000/images/00000000000000000?width=300&height=200&quality=10

sets image width to 300, height to 200, quality to 10 then caches the transformation for quicker fetching next request

### Supported Transformations

width
type: integer

height
type: integer

quality
type: integer


