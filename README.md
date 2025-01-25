# Turtle Book Watchlist Website

Turtle Book Watchlist is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that allows users to search for books, movies, and anime, rate them, add them to a watchlist, and view watchlists of other users. This project is containerized using Docker for easy deployment.

## Prerequisites

Ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

## Running the Application

### **To Run the Frontend with Docker**
Run the following command to start the frontend container:
```sh
 docker run -p 5173:5173 turtle:dev
```
OR to keep it running after restarts:
```sh
 docker run -p 5173:5173 --restart unless-stopped turtle:dev
```

### **To Run the Backend with Docker**
Run the following command to start the backend container:
```sh
 docker run -p 5000:5000 turtle-backend:dev
```
OR to keep it running after restarts:
```sh
 docker run -p 5000:5000 --restart unless-stopped turtle-backend:dev
```

### **To Run Without Docker**
#### **Run Backend Locally**
```sh
cd backend
npm install
npm start
```

#### **Run Frontend Locally**
```sh
cd frontend
npm install
npm run dev
```

## **Project Structure**
```
Turtle-Book-Watchlist/
│── backend/          # Express.js backend
│── frontend/         # React.js frontend
│── docker-compose.yml  # Docker Compose file (optional)
│── README.md         # Documentation
```

## **Future Enhancements**
- Implement user authentication.
- Add a recommendation system.
- Deploy using Kubernetes.

## **Contributing**
Feel free to contribute to the project by submitting issues or pull requests.

## **License**
This project is licensed under the MIT License.

