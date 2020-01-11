# Password Checker written in Javascript

## Host
- Type npm i install
- node .

## Endpoints
### /password/save
#### Method: POST
#### Description: This endpoint will take the user's username and password and save them into the database
#### Error handling: 
- Will throw error code 400 if the client forgets either the **user** or **password** body parameters
- Will throw error code 500 if the server has issue
### /password/login
#### Method: POST
#### Description: This enpoint will check for the user's password
#### Error handling:
- Will throw error code 400 if the client forgets either the **user** or **password** body parameters
- Will throw error code 500 if the server has issue