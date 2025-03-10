# Skywall-Backend
 
## Code Generation Scripts
 
Generate various components using our CLI tools. All scripts follow this pattern:
 
```bash

node scripts/crud/<script-name>.js -name <model-name>

```
 
### Available Generators
 
#### CURL Generator
 
```bash

node scripts/crud/curl-generator.js -name <model-name>

```
 
Creates API request templates.
 
 
---
 
#### Handler Generator
 
```bash

node scripts/crud/handler-generator.js -name <model-name>

```
 
Creates business logic handlers.
 
---
 
#### Helper Generator
 
```bash

node scripts/crud/helper-generator.js -name <model-name>

```
 
Creates utility helper classes.
 
---
 
#### Model Generator
 
```bash

node scripts/crud/model-generator.js -name <model-name>

```
 
Creates MongoDB schema models.
 
---
 
#### Route Generator
 
```bash

node scripts/crud/route-generator.js -name <model-name>

```
 
Creates API route handlers.
 
---
 
## Example Usage
 
Generate all components for a "user" model:
 
```bash

node scripts/crud/curl-generator.js -name user

node scripts/crud/handler-generator.js -name user

node scripts/crud/helper-generator.js -name user

node scripts/crud/model-generator.js -name user

node scripts/crud/route-generator.js -name user

```
 