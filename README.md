# image-transformation-service


## Configuration

Variables stores in .env in root.  
Can intermix provider types (eg. aws storage, fs cache)

#### Port

```
PORT="3000"

```

#### Memory provider

Stores the images in memory

```
STORAGE_PROVIDER="memory"
CACHE_PROVIDER="memory"
```

#### File system provider

Stores the images in file system with configurable path

```
STORAGE_PROVIDER="fs"
FS_STORAGE_PATH="storage_test"

CACHE_PROVIDER="fs"
FS_CACHE_PATH="cache_test"
```

#### Aws provider

Stores the images in AWS S3 with configurable bucket

```
AWS_PROVIDER_ACCESS_KEY_ID=""
AWS_PROVIDER_SECRET_ACCESS_KEY=""

STORAGE_PROVIDER="aws"
AWS_STORAGE_BUCKET="image-transformation-service-storage"

CACHE_PROVIDER="aws"
AWS_CACHE_BUCKET="image-transformation-service-cache"
```



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


