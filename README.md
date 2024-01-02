# Communication Platform with Postmarkapp.com

This is a Communication Platform where Person can Send Emails,Receive Emails and see communication History also.

## Getting Started

These instructions will help you set up a development environment and run the application on your local machine.

### Prerequisites

Make sure you have Node.js and npm installed on your computer.

### Installation

1. Clone the repository or download the source code.

```bash

    git clone https://github.com/Isheka123/communication_platform.git

```

2. Navigate to the project directory.

```bash

   cd communication_platform

```

3. Install the project dependencies Seperately for Client and Server.

```bash

   npm install

```

## Running the Application

To start the development server and run the application, use the following command for both server and client:

```bash

     npm start

```
To start receiving emails

```bash

     nodemon webhook.js

```

Client application will be available at http://localhost:3000 and server application will be available at http://localhost:8000 in your web browser. To receive emails first install ngrok in your computer then webhook.js in another port(eg:8001) also parallely run run this command ngrok http 8001 in command prompt.Update in the settings of inbound settings- webhook URI.

The Client application looks like this
<div align="center">

   <img src="/client/public/login.png"/>

</div>


## Features

This Communication Platform allows you to:

- Sending and Receive Emails.
- View the communication history.

## Contributing

Feel free to contribute to this project if you'd like to add more features or improve it.

## Acknowledgments

Thank you for using this Communication Platform!
Happy coding!
