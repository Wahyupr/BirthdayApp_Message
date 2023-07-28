

## Birthday App Message 

### System Requirement 

 1. Node 
 2. PostgreSQL 

## How To Run This Project  

 1. Run this code below 
	  ``` bash 
	  npm install 
	  ```
     
 2. Set .env file 
	```bash
	DB_USER = postgres
    DB_PASSWORD = awdsawds
    DB_NAME = birthday_app
    DB_HOST = 127.0.0.1
    DB_PORT = 5432
	```
3. run  
	```bash
	npm start
	```
	
## API Endpoint

 1. Create Use 
	```
	curl --location 'http://localhost:3000/user' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "firstName": "Wahyu",
    "lastName": "Pratama",
    "email": "whyprataama@example.com",
    "birthday": "1980-01-01",
    "location": "Yogyakarta",
    "timeZone": "Asia/Jakarta"
    }'
	```
 2. Delete User 
	```
	curl --location --request DELETE 'http://localhost:3000/user/3'
	```
 3. Update User
	```
	curl --location --request PUT 'http://localhost:3000/user/22' \
    --header 'Content-Type: application/json' \
    --data-raw '{
    "firstName": "Wahyu",
    "lastName": "Doe",
    "email": "john.wahyu@example.com",
    "birthday": "1980-01-01",
    "location": "Yogyakarta",
    "timeZone": "Asia/Jakarta",
    "updatedAt": "2023-07-28T05:39:59.507Z",
    "createdAt": "2023-07-28T05:39:59.507Z"}'
	```
 ## Build With

- Node.js 
- Express.js
- PostgreSQL
- Sequelize

## Authors
- Wahyu Pratama
 

