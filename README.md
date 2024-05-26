# bookAI Cloud Server

This repository contains the code for the BookAI cloud server. The server provides endpoints for user authentication, searching for books using the Google Books API, managing reading and wishlist, and generating stories. The project is split into two parts: local testing and cloud deployment on Google Cloud Platform (GCP).

## Repository Structure

bookAI_cloud_server/
├── local/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── readingListController.js
│   │   ├── wishlistController.js
│   │   ├── storiesController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── generatedStories.js
│   │   ├── readingList.js
│   │   ├── wishlist.js
│   ├── index.js
│   └── config.js
├── cloud/
│   ├── generated-stories.js
|   ├── getuser.js
│   ├── login.js
│   ├── reading-list.js
│   ├── register.js
│   ├── search.js
│   └── wishlist.js
└── README.md
```

## Local Testing

The `local` folder contains the code for testing the endpoints locally. It includes a Node.js server that interfaces with a Cloud SQL PostgreSQL database. Prior to uploading everything on the cloud server, all the endpoints were created on a local node.js server and tested. Afterwards they were uploaded as cloud functions on GCP. Each endpoint runs on a separate cloud function.

### Endpoints

- **Authentication**
  - `POST /register` - Register a new user
  - `POST /login` - Authenticate a user and return a JWT token
- **Getting user details**
  - `GET /user` - Gets the details of a user if a JWT token is provided
- **Books**
  - `GET /search` - Search for books using the Google Books API
- **Reading List**
  - `POST /reading-list/add` - Add a book to the reading list
  - `GET /reading-list/get` - Get all books in the reading list
  - `DELETE /reading-list/delete/:id` - Remove a book from the reading list
  -  `GET /reading-list/find/:id` - Checks if a book is present in the reading list
- **Wishlist**
  - `POST /wishlist/add` - Add a book to the wishlist
  - `GET /wishlist/get` - Get all books in the wishlist
  - `DELETE /wishlist/delete/:id` - Remove a book from the wishlist
  -  `GET /wishlist/find/:id` - Checks if a book is present in the wishlist
- **Generated Stories**
  - `POST /stories` - Add a generated story
  - `GET /stories` - Get all generated stories
  - `DELETE /stories/:id` - Delete a generated story

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/safwanyasin/bookAI_cloud_server.git
   cd bookAI_cloud_server/local
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the database connection in `config.js`.

4. Start the server:
   ```bash
   node server.js
   ```

## Cloud Deployment

The `cloud` folder contains the code for deploying each feature as separate Google Cloud Functions. Each file corresponds to a specific endpoint. The code is slightly different from the one in the `local` folder since it had to modified to work properly on the cloud.

### Deployment

1. Ensure you have the Google Cloud SDK installed and authenticated:
   ```bash
   gcloud auth login
   gcloud config set project [PROJECT_ID]
   ```
2. Each function will be accessible via its respective HTTP endpoint.



## License

This project is licensed under the MIT License.
```

Copy this content and save it as `README.md` in the root of your repository.
