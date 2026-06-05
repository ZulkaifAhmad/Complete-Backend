# Simple CRUD Backend API

> A lightweight REST API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** — demonstrating full CRUD operations with a clean, beginner-friendly structure.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Key Learnings](#key-learnings)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

This project is a simple backend API that performs **Create, Read, Update, and Delete (CRUD)** operations on a MongoDB database. It is designed to be straightforward and serves as a solid foundation for understanding how REST APIs work in Node.js.

---

## Features

- Create a new record via `POST`
- Retrieve all records via `GET`
- Retrieve a single record by ID via `GET`
- Update an existing record via `PATCH`
- Delete a record via `DELETE`
- Persistent data storage using MongoDB

---

## Tech Stack

| Technology | Purpose              |
|------------|----------------------|
| Node.js    | Runtime environment  |
| Express.js | HTTP server & routing |
| MongoDB    | NoSQL database       |
| Mongoose   | ODM for MongoDB      |

---


## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/your-repo-name.git
```

**2. Navigate into the project directory**

```bash
cd your-repo-name
```

**3. Install dependencies**

```bash
npm install
```

**4. Set up environment variables**

Create a `.env` file in the root of the project (see [Environment Variables](#environment-variables) below).

**5. Start the server**

```bash
node app.js
```

Or with live reloading via nodemon:

```bash
npx nodemon app.js
```

The server will start at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

> **Note:** Never commit your `.env` file to version control. Add it to `.gitignore`.

---

## API Reference

**Base URL:** `http://localhost:3000`

### Create a Record

```http
POST /
```

**Request Body (JSON):**

```json
{
  "title": "My Note",
  "content": "This is my first note."
}
```

---

### Get All Records

```http
GET /
```

---

### Get a Single Record

```http
GET /:id
```

| Parameter | Type     | Description                  |
|-----------|----------|------------------------------|
| `id`      | `string` | The MongoDB ObjectId of the record |

---

### Update a Record

```http
PATCH /:id
```

**Request Body (JSON):**

```json
{
  "title": "Updated Title"
}
```

---

### Delete a Record

```http
DELETE /:id
```


## Author

**Zulkaif Ahmad**  
MERN Stack Developer


---

> If you found this project helpful, consider giving it a ⭐ on GitHub!