# 🍃 MongoDB — Complete Guide (Beginner to Intermediate)

> Theory + Commands + Comments explaining WHAT, WHY, and WHEN for everything.

---

## Table of Contents

1. [What is MongoDB?](#1-what-is-mongodb)
2. [Core Concepts & Terminology](#2-core-concepts--terminology)
3. [Installation & Setup](#3-installation--setup)
4. [MongoDB Shell (mongosh)](#4-mongodb-shell-mongosh)
5. [Databases & Collections](#5-databases--collections)
6. [CRUD Operations](#6-crud-operations)
7. [Why the Dollar Sign $ ?](#7-why-the-dollar-sign-)
8. [Query Operators](#8-query-operators)
9. [Update Operators](#9-update-operators)
10. [Projection](#10-projection)
11. [Sorting, Limiting & Skipping](#11-sorting-limiting--skipping)
12. [Indexes](#12-indexes)
13. [Aggregation Pipeline](#13-aggregation-pipeline)
14. [Relationships: Embedding vs Referencing](#14-relationships-embedding-vs-referencing)
15. [MongoDB with Node.js (Mongoose)](#15-mongodb-with-nodejs-mongoose)
16. [Why Schema in Mongoose?](#16-why-schema-in-mongoose)
17. [Authentication & Security](#17-authentication--security)
18. [Backup & Restore](#18-backup--restore)
19. [Best Practices](#19-best-practices)
20. [Quick Reference Cheatsheet](#20-quick-reference-cheatsheet)

---

## 1. What is MongoDB?

MongoDB is a **NoSQL**, **document-oriented** database.

Normal SQL databases store data in tables (rows and columns). MongoDB instead stores data as **documents** — which look exactly like JSON objects. This makes it very natural to use with JavaScript/Node.js.

```
SQL:      Table → Row → Column
MongoDB:  Collection → Document → Field
```

### Why MongoDB?

| Feature | MongoDB | SQL (MySQL/PostgreSQL) |
|---|---|---|
| Data format | JSON/BSON documents | Tables (rows & columns) |
| Schema | Flexible — each doc can have different fields | Fixed — all rows must match the table structure |
| Scalability | Easy horizontal scaling | Mostly vertical scaling |
| Speed | Very fast for reads/writes | Depends on query complexity |
| Use case | Unstructured or varying data | Structured, relational data |

### When to use MongoDB?

- Real-time apps (chats, live feeds, notifications)
- E-commerce product catalogs (products have different attributes)
- User profiles (some have phone, some don't — flexible structure)
- Blogging / CMS platforms
- Any app built with Node.js / Next.js (JSON feels native)

---

## 2. Core Concepts & Terminology

| MongoDB Term | SQL Equivalent | What it means |
|---|---|---|
| **Database** | Database | A container that holds multiple collections |
| **Collection** | Table | A group of related documents (like a "users" table) |
| **Document** | Row | One single record stored as JSON/BSON |
| **Field** | Column | A key-value pair inside a document |
| **`_id`** | Primary Key | A unique ID auto-generated for every document |
| **Index** | Index | Makes queries faster by creating a lookup structure |
| **Cursor** | Result Set | A pointer to the results returned by a query |

### What is BSON?

BSON = Binary JSON. It's how MongoDB actually stores data on disk. It's like JSON but:
- Faster to read/write
- Supports more data types: `Date`, `ObjectId`, `Binary`, etc.
- You write normal JSON, MongoDB handles BSON internally

### What is ObjectId?

Every document automatically gets an `_id` field. By default it's an `ObjectId`:

```
ObjectId("507f1f77bcf86cd799439011")
```

It's a 12-byte unique identifier that includes a timestamp — so it's always unique, even across multiple servers. You don't need to create it yourself.

---

## 3. Installation & Setup

### Option A — MongoDB Atlas (Cloud — Best for Beginners)

No installation needed. Free tier available.

1. Go to https://cloud.mongodb.com
2. Create a free cluster (M0 — free forever)
3. Create a database user (username + password)
4. Add your IP to the whitelist (or allow all: `0.0.0.0/0` for development)
5. Click "Connect" → get your connection string:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

### Option B — Install Locally (Ubuntu/WSL)

```bash
# Step 1: Import MongoDB's official GPG security key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Step 2: Add the MongoDB repository to apt sources
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Step 3: Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Step 4: Start the MongoDB service
sudo systemctl start mongod

# Step 5: Make MongoDB start automatically on system boot
sudo systemctl enable mongod

# Step 6: Verify it's running
sudo systemctl status mongod
```

### Option C — macOS

```bash
brew tap mongodb/brew          # Add MongoDB's official Homebrew tap
brew install mongodb-community # Install MongoDB
brew services start mongodb-community  # Start as a background service
```

### Option D — Windows

Download the `.msi` installer from: https://www.mongodb.com/try/download/community  
Run it and follow the wizard. MongoDB Compass (GUI) is included.

---

## 4. MongoDB Shell (mongosh)

The shell is a command-line tool to interact with MongoDB directly. Great for testing queries.

```bash
# Connect to MongoDB running on your own machine (localhost)
mongosh

# Connect to a specific database on localhost
mongosh "mongodb://localhost:27017/myDatabase"

# Connect to MongoDB Atlas (cloud)
mongosh "mongodb+srv://cluster0.xxxx.mongodb.net/mydb" --username yourUsername
```

### Basic Shell Commands

```js
// See all databases on this server
show dbs

// See which database you're currently in
db

// Switch to a database (creates it if it doesn't exist yet)
// MongoDB won't actually create it until you insert data
use myDatabase

// See all collections in the current database
show collections

// Clear the terminal screen
cls

// Exit the shell
exit
```

---

## 5. Databases & Collections

### Working with Databases

```js
// Switch to "shopDB" — creates it automatically when you first insert data
use shopDB

// Permanently delete the current database and all its data — be careful!
db.dropDatabase()
```

> **Note:** MongoDB uses a "lazy creation" approach. A database or collection is only actually created on disk when you insert the first document into it.

### Working with Collections

```js
// Manually create a collection called "users"
// Usually you don't need this — MongoDB creates it automatically on first insert
db.createCollection("users")

// Create a "capped" collection — a fixed-size collection that auto-deletes old docs
// Useful for: logs, activity feeds, anything where you only want the latest N entries
db.createCollection("activityLogs", {
  capped: true,        // enable fixed-size mode
  size: 1048576,       // max size in bytes (1MB here)
  max: 500             // max number of documents — oldest deleted when limit hit
})

// Delete a collection and all its documents permanently
db.users.drop()

// Get a list of all collection names in the current database
db.getCollectionNames()
```

---

## 6. CRUD Operations

CRUD = **C**reate, **R**ead, **U**pdate, **D**elete — the four fundamental database operations.

### CREATE — Inserting Documents

```js
// ─── insertOne() ────────────────────────────────────────────────────────────
// Use when: you want to add a single document
// MongoDB automatically adds "_id" if you don't provide one
db.users.insertOne({
  name: "Zulkaif",
  age: 21,
  email: "zulkaif@example.com",
  role: "developer",
  skills: ["React", "Next.js", "MongoDB"],  // arrays are perfectly fine as field values
  createdAt: new Date()   // new Date() gives current timestamp — explained below
})

// ─── insertMany() ───────────────────────────────────────────────────────────
// Use when: you want to insert multiple documents in one go (faster than multiple insertOne calls)
// Pass an array [] of document objects {}
db.users.insertMany([
  { name: "Ali",   age: 25, city: "Lahore"   },
  { name: "Sara",  age: 22, city: "Karachi"  },
  { name: "Ahmed", age: 30, city: "Peshawar" }
])

// ─── Custom _id ─────────────────────────────────────────────────────────────
// Use when: you want a human-readable ID instead of an auto ObjectId
// Warning: you are responsible for making sure it's unique
db.products.insertOne({
  _id: "prod-001",    // custom string ID
  name: "Laptop",
  price: 85000
})
```

**Why `new Date()`?**  
`new Date()` is a JavaScript constructor that creates a Date object representing the current date and time. MongoDB stores it as a BSON Date type, which allows date comparisons, sorting by date, and TTL (time-to-live) indexes. If you just wrote `"2024-01-01"` as a string, MongoDB would store it as text and you couldn't do date math on it.

---

### READ — Finding Documents

```js
// ─── find() ──────────────────────────────────────────────────────────────────
// Use when: you want to get multiple documents
// {} means "no filter" = return everything
db.users.find()

// find() with a filter — only returns documents where city equals "Peshawar"
db.users.find({ city: "Peshawar" })

// ─── findOne() ───────────────────────────────────────────────────────────────
// Use when: you only need one result (e.g. find user by email for login)
// Returns the first matching document, or null if not found
db.users.findOne({ email: "zulkaif@example.com" })

// Find by _id — you must wrap the id string in ObjectId()
// because _id is stored as ObjectId type, not a plain string
db.users.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })

// ─── countDocuments() ────────────────────────────────────────────────────────
// Use when: you just need a number count, not the actual documents
db.users.countDocuments()                    // count all users
db.users.countDocuments({ city: "Lahore" }) // count only Lahore users
```

---

### UPDATE — Modifying Documents

```js
// ─── updateOne() ─────────────────────────────────────────────────────────────
// Use when: you want to update ONE matching document
// Takes two arguments:
//   1. Filter: which document to find
//   2. Update: what changes to make (always use an operator like $set — see section 7)
db.users.updateOne(
  { name: "Zulkaif" },     // 1. find the document where name is "Zulkaif"
  { $set: { age: 22 } }    // 2. set the age field to 22 — $set only changes specified fields
)

// ─── updateMany() ────────────────────────────────────────────────────────────
// Use when: you want to update ALL documents that match the filter
db.users.updateMany(
  { city: "Lahore" },              // find all users in Lahore
  { $set: { verified: true } }     // add/update the "verified" field to true for all of them
)

// ─── replaceOne() ────────────────────────────────────────────────────────────
// Use when: you want to completely swap out a document (except its _id)
// WARNING: this deletes all existing fields and replaces with the new object
db.users.replaceOne(
  { name: "Ali" },                                       // find document
  { name: "Ali Raza", age: 26, city: "Islamabad" }      // completely replace it
)

// ─── upsert ──────────────────────────────────────────────────────────────────
// Use when: update if exists, insert a new doc if it doesn't exist
// { upsert: true } is passed as the third argument (options)
db.users.updateOne(
  { email: "newuser@example.com" },              // look for this email
  { $set: { name: "New User", role: "guest" } }, // if found: update these fields
  { upsert: true }                               // if NOT found: create a new document
)
```

---

### DELETE — Removing Documents

```js
// ─── deleteOne() ─────────────────────────────────────────────────────────────
// Use when: delete only the first document that matches
// Useful when the filter is a unique field like email or _id
db.users.deleteOne({ name: "Ali" })

// ─── deleteMany() ────────────────────────────────────────────────────────────
// Use when: delete all documents matching a condition
db.users.deleteMany({ verified: false })   // delete all unverified users

// Delete every document in the collection (collection itself still exists)
// WARNING: this is irreversible — all data gone
db.users.deleteMany({})   // empty filter {} matches everything
```

---

## 7. Why the Dollar Sign `$` ?

This is one of the most confusing things for beginners. Here's the full explanation:

**`$` is MongoDB's prefix for operators.**

MongoDB uses `$` to distinguish between:
- A **field name** (your data): `{ name: "Ali" }`
- An **operator** (MongoDB command): `{ $set: { name: "Ali" } }`

Without the `$`, MongoDB would think `set` is a field name in your document. With `$`, MongoDB knows it's an instruction to execute.

```js
// ❌ Wrong — MongoDB thinks "set" is a field name you're looking for
db.users.updateOne({ name: "Ali" }, { set: { age: 25 } })

// ✅ Correct — $set tells MongoDB "this is an update operator, execute it"
db.users.updateOne({ name: "Ali" }, { $set: { age: 25 } })
```

### Types of `$` operators

| Type | Examples | What they do |
|---|---|---|
| **Update operators** | `$set`, `$unset`, `$inc`, `$push` | Modify document fields |
| **Query/Comparison** | `$eq`, `$gt`, `$lt`, `$in` | Filter documents in queries |
| **Logical** | `$and`, `$or`, `$not` | Combine query conditions |
| **Array** | `$push`, `$pull`, `$addToSet` | Work with array fields |
| **Aggregation** | `$match`, `$group`, `$sort` | Pipeline stages |

Think of `$` like a keyword in programming — `if`, `for`, `return` have special meaning. In MongoDB, `$` marks something as a special instruction, not data.

---

## 8. Query Operators

Query operators are used inside `find()` to filter documents with more complex conditions than simple equality.

### Comparison Operators

```js
// $eq — equal to (same as just writing the value directly)
db.products.find({ price: { $eq: 1000 } })
// Same as: db.products.find({ price: 1000 })

// $ne — NOT equal to — get everything except this value
db.products.find({ price: { $ne: 1000 } })

// $gt — greater than
// Use when: filtering by minimum price, age, score, etc.
db.products.find({ price: { $gt: 500 } })    // price > 500

// $gte — greater than OR equal to
db.products.find({ price: { $gte: 500 } })   // price >= 500

// $lt — less than
db.products.find({ price: { $lt: 2000 } })   // price < 2000

// $lte — less than or equal to
db.products.find({ price: { $lte: 2000 } })  // price <= 2000

// $in — field value matches ANY value in the given array
// Use when: filtering by multiple allowed values (like a dropdown with multi-select)
db.users.find({ city: { $in: ["Lahore", "Karachi", "Peshawar"] } })

// $nin — NOT in array — field value must NOT match any of these
db.users.find({ city: { $nin: ["Quetta", "Multan"] } })
```

### Logical Operators

```js
// $and — ALL conditions must be true
// Use when: you have multiple required conditions
db.users.find({
  $and: [
    { age: { $gte: 18 } },   // must be 18 or older
    { city: "Lahore" }        // AND must be in Lahore
  ]
})

// Shorthand AND — just put multiple conditions in the same object
// This is the same as above but shorter — use this by default
db.users.find({ age: { $gte: 18 }, city: "Lahore" })

// $or — AT LEAST ONE condition must be true
// Use when: looking for documents that match any of several values
db.users.find({
  $or: [
    { city: "Lahore" },
    { city: "Karachi" }
  ]
})

// $not — reverses the condition
// Use when: you want to negate a condition
// Find users who are NOT younger than 18 (i.e., 18 and above)
db.users.find({ age: { $not: { $lt: 18 } } })
```

### Element Operators

```js
// $exists — check if a field exists on a document
// Use when: some documents might not have a certain field (flexible schema)

// Find users who HAVE a phone field
db.users.find({ phone: { $exists: true } })

// Find users who DON'T have a phone field
db.users.find({ phone: { $exists: false } })
```

### Array Operators

```js
// Simple array query — find docs where array contains this value
// MongoDB automatically searches inside the array
db.users.find({ skills: "React" })   // finds users who have "React" in their skills array

// $all — array must contain ALL listed values
// Use when: filtering users who know multiple specific technologies
db.users.find({ skills: { $all: ["React", "Next.js"] } })

// $size — array must have exactly this many elements
db.users.find({ skills: { $size: 3 } })   // only users with exactly 3 skills

// $elemMatch — at least ONE element in the array must match ALL conditions
// Use when: filtering arrays of objects with multiple conditions on one element
db.orders.find({
  items: {
    $elemMatch: {
      product: "Laptop",
      qty: { $gte: 2 }   // find orders where one item is Laptop AND qty >= 2
    }
  }
})
```

---

## 9. Update Operators

Used inside `updateOne()` or `updateMany()` to specify HOW to change a document.

### Field Operators

```js
// $set — add a new field or update an existing field's value
// Most common update operator — changes only the specified fields, leaves others untouched
db.users.updateOne({ name: "Zulkaif" }, { $set: { age: 22, city: "Peshawar" } })

// $unset — completely remove a field from a document
// Use when: a field is no longer needed
db.users.updateOne({ name: "Zulkaif" }, { $unset: { phone: "" } })
// Note: the value "" doesn't matter — $unset ignores the value, just removes the field

// $inc — increment (increase) or decrement (decrease) a number field
// Use when: counting views, likes, stock quantity, score, etc.
db.products.updateOne({ _id: id }, { $inc: { views: 1 } })      // add 1 to views
db.products.updateOne({ _id: id }, { $inc: { stock: -5 } })     // subtract 5 from stock

// $rename — rename a field across your documents
// Use when: you made a typo or want to refactor your field names
db.users.updateMany({}, { $rename: { "fullname": "name" } })   // rename "fullname" to "name" everywhere

// $currentDate — set a field to the current date/time
// Use when: you want to track "last updated" timestamps automatically
db.users.updateOne({ _id: id }, { $currentDate: { updatedAt: true } })
```

### Array Update Operators

```js
// $push — add an element to an array
// Use when: adding items to a list (messages, tags, scores)
db.users.updateOne({ _id: id }, { $push: { scores: 95 } })

// $push with $each — add multiple elements at once
db.users.updateOne({ _id: id }, {
  $push: { tags: { $each: ["developer", "frontend"] } }
})

// $addToSet — add element to array ONLY if it doesn't already exist
// Use when: you want a unique array (like a set of tags or categories)
// Unlike $push, it won't create duplicates
db.users.updateOne({ _id: id }, { $addToSet: { skills: "TypeScript" } })
// If "TypeScript" is already in skills, nothing happens

// $pull — remove all elements from array that match a condition
// Use when: removing a specific item from a list
db.users.updateOne({ _id: id }, { $pull: { skills: "jQuery" } })

// $pull with condition — remove array elements that match a query
db.users.updateOne({ _id: id }, {
  $pull: { scores: { $lt: 50 } }   // remove all scores below 50
})

// $pop — remove the first or last element of an array
db.users.updateOne({ _id: id }, { $pop: { scores: 1 } })    //  1 = remove last element
db.users.updateOne({ _id: id }, { $pop: { scores: -1 } })   // -1 = remove first element
```

---

## 10. Projection

Projection controls **which fields come back** in your query results.

By default, `find()` returns the entire document with all fields. Projection lets you say "I only want name and email" — like `SELECT name, email FROM users` in SQL.

**Why use projection?**  
- Less data transferred over the network = faster responses
- Don't send sensitive fields like `password` to the client by mistake
- Cleaner data to work with in your app

```js
// Include only specific fields — put 1 next to fields you WANT
// Note: _id is always included unless you explicitly exclude it
db.users.find({}, { name: 1, email: 1 })
// Returns: { _id: ..., name: "...", email: "..." }
// The {} first arg means no filter — get all documents

// Exclude _id as well
db.users.find({}, { name: 1, email: 1, _id: 0 })
// Returns: { name: "...", email: "..." }

// Exclude specific fields — put 0 next to fields you DON'T want
// Useful when you want everything EXCEPT sensitive fields
db.users.find({}, { password: 0, __v: 0 })

// ⚠️ You cannot mix 1s and 0s in the same projection
// The only exception: you can always set _id: 0 alongside 1s
db.users.find({}, { name: 1, password: 0 })  // ❌ ERROR — invalid
db.users.find({}, { name: 1, _id: 0 })       // ✅ OK — _id exception
```

### Nested field projection

```js
// Access nested fields with dot notation
db.users.find({}, { "address.city": 1 })
// Returns only the city from inside the address object
```

---

## 11. Sorting, Limiting & Skipping

These are chained after `find()` to control the shape and size of results.

```js
// ─── sort() ──────────────────────────────────────────────────────────────────
//  1 = ascending  (A→Z, 1→9, oldest→newest)
// -1 = descending (Z→A, 9→1, newest→oldest)

db.users.find().sort({ age: 1 })     // youngest to oldest
db.users.find().sort({ age: -1 })    // oldest to youngest
db.users.find().sort({ name: 1 })    // alphabetical A to Z

// Sort by multiple fields — primary sort first, secondary sort second
db.users.find().sort({ city: 1, age: -1 })   // group by city A-Z, within each city oldest first

// ─── limit() ─────────────────────────────────────────────────────────────────
// Use when: you only want the top N results
// Always use limit() to avoid accidentally loading thousands of documents
db.users.find().limit(10)   // only return first 10 users

// ─── skip() ──────────────────────────────────────────────────────────────────
// Use when: implementing pagination — skip the first N documents
db.users.find().skip(20).limit(10)
// Skip first 20, take next 10 → this is page 3 (if page size is 10)
```

### Pagination Formula

```js
// Pagination pattern — very common in real apps
const page = 2      // which page the user is on (1-indexed)
const pageSize = 10 // how many items per page

db.users.find()
  .sort({ createdAt: -1 })           // newest first
  .skip((page - 1) * pageSize)       // (2-1)*10 = skip 10 docs
  .limit(pageSize)                    // take 10 docs
  // Page 1: skip 0,  take 10 → items 1-10
  // Page 2: skip 10, take 10 → items 11-20
  // Page 3: skip 20, take 10 → items 21-30
```

---

## 12. Indexes

### Why Indexes?

Without an index, when you run `db.users.find({ email: "x@x.com" })`, MongoDB reads **every single document** in the collection to find a match. This is called a **Collection Scan** and it's slow with large data.

An index is like the index at the back of a textbook — instead of reading every page to find "MongoDB", you go to the index, find "MongoDB → page 42", and jump straight there.

```
Without index: scan 1,000,000 documents → find 1 match  ❌ slow
With index:    jump directly to match                    ✅ fast
```

### Creating Indexes

```js
// Single field index — the most common type
// 1 = ascending order, -1 = descending order (for single index, doesn't usually matter)
// Use when: you frequently query or filter by this field
db.users.createIndex({ email: 1 })

// Unique index — prevents duplicate values in this field
// Use when: a field must be unique across all documents (email, username, etc.)
db.users.createIndex({ email: 1 }, { unique: true })

// Compound index — indexes multiple fields together
// Use when: you often query with multiple fields together (e.g. filter by userId AND sort by date)
// Field order matters! Put equality fields first, then sort/range fields
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Text index — enables full-text search inside string fields
// Use when: building a search feature (search blog posts, product names, etc.)
db.posts.createIndex({ title: "text", body: "text" })
// To use text search:
db.posts.find({ $text: { $search: "mongodb tutorial" } })

// TTL (Time-To-Live) index — automatically deletes documents after a time period
// Use when: sessions, OTP codes, temporary tokens, logs that expire
// expireAfterSeconds: how many seconds after the date field to delete the document
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
// A session document created at 10:00 AM will be auto-deleted at 11:00 AM
```

### Managing Indexes

```js
// See all indexes on a collection
// _id always has an index by default (you can't remove it)
db.users.getIndexes()

// Remove an index by its name (name shown in getIndexes() output, e.g. "email_1")
db.users.dropIndex("email_1")

// Remove all indexes except the required _id index
db.users.dropIndexes()
```

### How to check if your query uses an index

```js
// explain() shows MongoDB's query execution plan
// Use when: a query feels slow and you want to diagnose it
db.users.find({ email: "test@test.com" }).explain("executionStats")

// In the output, look for:
// "stage": "IXSCAN"   → good! Using an index
// "stage": "COLLSCAN" → bad!  Scanning the whole collection
```

---

## 13. Aggregation Pipeline

### What is it?

The aggregation pipeline lets you **transform, group, and analyze** your data — like SQL's `GROUP BY`, `JOIN`, `COUNT`, `SUM`, etc., but more powerful.

Think of it as a **water pipe** — data flows in, passes through multiple transformation stages, and comes out the other end as the result you want.

```
Collection → [$stage1] → [$stage2] → [$stage3] → Final Result
```

Each stage takes the output of the previous stage as its input.

```js
// Basic structure — pass an array of stage objects
db.orders.aggregate([
  { $match: { ... } },     // Stage 1: filter
  { $group: { ... } },     // Stage 2: group and calculate
  { $sort:  { ... } },     // Stage 3: sort
  { $limit: 10 }           // Stage 4: limit
])
```

### Common Stages

```js
// ─── $match — filter documents (like find's filter) ──────────────────────────
// Use when: you want to process only a subset of documents
// ALWAYS put $match early in the pipeline to reduce data before expensive stages
{ $match: { status: "completed", total: { $gte: 1000 } } }

// ─── $group — group documents and run aggregate calculations ─────────────────
// Use when: you want totals, counts, averages grouped by a field
// _id is required — it's the "group by" field. Use null to group all docs together.
{ $group: {
  _id: "$city",                    // group by the "city" field
                                   // Note: "$city" with $ means "the value of the city field"
  totalUsers: { $sum: 1 },         // count — add 1 for each document in the group
  avgAge:     { $avg: "$age" },    // average of the "age" field
  maxAge:     { $max: "$age" },    // maximum age in group
  minAge:     { $min: "$age" }     // minimum age in group
}}

// ─── $sort — sort the results ────────────────────────────────────────────────
{ $sort: { totalUsers: -1 } }   // sort by totalUsers descending (most users first)

// ─── $limit — keep only the first N results ──────────────────────────────────
{ $limit: 5 }   // only keep top 5

// ─── $project — reshape or rename fields in the output ──────────────────────
// Use when: you want to control what the final result looks like
// 1 = include,  0 = exclude
{ $project: {
  _id: 0,                    // exclude _id from output
  city: "$_id",              // rename "_id" field to "city"
  totalUsers: 1,             // include totalUsers
  avgAge: { $round: ["$avgAge", 1] }   // round to 1 decimal place
}}

// ─── $addFields — add new computed fields without removing existing ones ─────
// Use when: you want to add a calculated field but keep all original fields
{ $addFields: {
  totalWithTax: { $multiply: ["$total", 1.17] }   // add new field "totalWithTax"
}}

// ─── $unwind — break an array field into separate documents ──────────────────
// Use when: you need to process each array element individually
// Example: user has skills: ["React", "Next.js", "MongoDB"]
// $unwind creates 3 documents, one per skill
{ $unwind: "$skills" }

// ─── $count — count how many documents passed through to this stage ──────────
{ $count: "totalMatchingDocs" }

// ─── $lookup — JOIN with another collection ──────────────────────────────────
// Use when: you have related data in separate collections (like userId in orders)
{ $lookup: {
  from: "users",            // the other collection to join
  localField: "userId",     // field in the CURRENT collection (orders.userId)
  foreignField: "_id",      // field in the OTHER collection (users._id)
  as: "userDetails"         // name of the new field that holds the joined data (array)
}}
```

### Real-World Example — Sales Report

```js
// "Show me monthly revenue for the year 2024"
db.orders.aggregate([

  // Stage 1: Only look at completed orders from 2024
  { $match: {
    status: "completed",
    createdAt: { $gte: new Date("2024-01-01"), $lt: new Date("2025-01-01") }
  }},

  // Stage 2: Group by month and calculate revenue
  { $group: {
    _id: { $month: "$createdAt" },   // $month extracts the month number from a date field
    revenue:    { $sum: "$total" },  // add up all "total" values in this group
    orderCount: { $sum: 1 }          // count how many orders in this group
  }},

  // Stage 3: Sort by month (January first)
  { $sort: { _id: 1 } },

  // Stage 4: Clean up the output shape
  { $project: {
    _id: 0,
    month: "$_id",
    revenue: { $round: ["$revenue", 2] },
    orderCount: 1
  }}
])

// Result example:
// { month: 1, revenue: 125000.50, orderCount: 45 }
// { month: 2, revenue: 98000.00, orderCount: 38 }
// ...
```

---

## 14. Relationships: Embedding vs Referencing

MongoDB is document-based, so how you handle related data is different from SQL.

You have two choices:

### Option A — Embedding (store related data inside the document)

```js
// A user with their address embedded directly inside the same document
// The address object lives INSIDE the user document
{
  _id: ObjectId("..."),
  name: "Zulkaif",
  email: "z@example.com",
  address: {          // embedded sub-document
    street: "Main Bazaar",
    city: "Peshawar",
    country: "Pakistan"
  },
  skills: ["React", "Next.js"]   // embedded array
}
```

**Use embedding when:**
- The related data is always accessed with the parent (you always need address when you fetch user)
- One-to-few relationship (one user, a few addresses)
- The sub-data doesn't change independently and frequently

**Advantages:** One query fetches everything. Fast.  
**Disadvantage:** If the embedded data is large or changes a lot, documents get bloated.

---

### Option B — Referencing (store an ID that points to another collection)

```js
// orders collection — stores a reference to the user
{
  _id: ObjectId("order1"),
  userId: ObjectId("user1"),   // just storing the ID, not the full user object
  total: 5000,
  status: "completed"
}

// users collection — separate document
{
  _id: ObjectId("user1"),
  name: "Zulkaif",
  email: "z@example.com"
}

// To get all orders for a user:
db.orders.find({ userId: ObjectId("user1") })

// To get orders WITH user details (using aggregation $lookup):
db.orders.aggregate([
  { $lookup: {
    from: "users",
    localField: "userId",
    foreignField: "_id",
    as: "user"
  }}
])
```

**Use referencing when:**
- One-to-many relationship (one user → many orders)
- Many-to-many relationship (students ↔ courses)
- The related data is large and you don't always need it
- The related data changes frequently (updating it in one place is easier)

**Advantages:** Data stays normalized, easier to update.  
**Disadvantage:** Requires a second query or `$lookup` to fetch related data.

---

### Quick Decision Guide

| Situation | Use |
|---|---|
| User and their profile (always together) | Embed |
| User and their 1000 orders | Reference |
| Product and its 3 images | Embed |
| Product and its reviews (can be thousands) | Reference |
| Blog post and its tags (few tags) | Embed |
| Student and their enrolled courses | Reference (many-to-many) |

---

## 15. MongoDB with Node.js (Mongoose)

### What is Mongoose?

Mongoose is an **ODM (Object Document Mapper)** for MongoDB in Node.js. It sits on top of the native MongoDB driver and adds:

- **Schema** — define the structure and rules for your documents
- **Validation** — enforce rules before saving
- **Methods** — add custom functions to your models
- **Middleware** — run code before/after operations (e.g. hash password before save)

```bash
npm install mongoose
```

### Connecting to MongoDB

```js
// lib/mongodb.js
// This is a connection utility optimized for Next.js
// The "cached" pattern prevents creating a new connection on every hot-reload in dev mode

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI  // always store connection string in .env

if (!MONGODB_URI) {
  // Throw early during startup if the env variable is missing
  throw new Error("Please add MONGODB_URI to your .env file")
}

// global.mongoose persists across Next.js hot-reloads in development
// Without this, each file save creates a new DB connection = connection leak
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  // If already connected, return the existing connection
  if (cached.conn) return cached.conn

  // If a connection attempt is in progress, wait for it
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,  // don't queue commands if not connected — fail fast
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
```

---

## 16. Why Schema in Mongoose?

### The Problem MongoDB Solves (and Creates)

MongoDB is flexible — you can insert any shape of document. But in a real app, this becomes a problem:

```js
// Without Schema — all of these would succeed:
db.users.insertOne({ name: "Ali" })
db.users.insertOne({ naam: "Sara" })        // typo! "naam" instead of "name"
db.users.insertOne({ name: 123 })           // wrong type! name should be a string
db.users.insertOne({ xyz: "random" })       // completely wrong field
```

Your database becomes inconsistent and your app crashes in unexpected ways.

### The Solution — Mongoose Schema

A **Schema** is a blueprint that defines:
- What fields a document should have
- What type each field should be
- Which fields are required
- Default values
- Validation rules

```js
// Why do we write "new mongoose.Schema()"?
// "mongoose.Schema" is a CLASS (constructor function) provided by the Mongoose library
// "new" creates an INSTANCE of that class — one specific schema for one collection
// It's like: const date = new Date() — Date is a class, new creates an instance of it

import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  // Each field is defined as: fieldName: { type, rules... }

  name: {
    type: String,            // must be a String
    required: [true, "Name is required"],  // can't save without this field
    trim: true,              // automatically remove leading/trailing spaces
    minlength: 2,            // minimum 2 characters
    maxlength: 50            // maximum 50 characters
  },

  email: {
    type: String,
    required: true,
    unique: true,            // no two users can have the same email
    lowercase: true,         // auto-convert to lowercase before saving
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    // match: takes a regex and an error message
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false            // NEVER return this field in queries by default
                             // You must explicitly ask for it with .select("+password")
                             // This prevents accidentally exposing passwords in API responses
  },

  role: {
    type: String,
    enum: ["admin", "user", "moderator"],  // value must be one of these three options
    default: "user"                         // if not provided, use "user"
  },

  age: {
    type: Number,
    min: [0, "Age cannot be negative"],
    max: [120, "Age seems too high"]
  },

  skills: [String],          // shorthand for an array of strings
                             // Same as: skills: { type: [String] }

  address: {                 // nested object (embedded sub-document)
    city: String,
    country: { type: String, default: "Pakistan" }
  },

  isVerified: {
    type: Boolean,
    default: false           // new users are unverified by default
  }

}, {
  timestamps: true   // automatically adds "createdAt" and "updatedAt" fields
                     // MongoDB manages these — you don't need to set them manually
})
```

### Why `new mongoose.model()`?

```js
// A Model is a class that lets you interact with a MongoDB collection
// It's built from your schema

// Why mongoose.models.User || mongoose.model("User", userSchema)?
// In Next.js, files are re-imported on every hot-reload
// Without the check, you'd get "Cannot overwrite `User` model once compiled" error
// mongoose.models.User checks if the model was already registered
// If yes: use the existing one. If no: create a new one.

const User = mongoose.models.User || mongoose.model("User", userSchema)
//                                                    ↑         ↑
//                                              Model name   Schema to use
//                                           (also = collection name: "users")

export default User
```

### Mongoose CRUD Operations

```js
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

await connectDB()  // always connect before any DB operation

// ─── CREATE ──────────────────────────────────────────────────────────────────

// Create.create() = validate against schema + insert into DB
const user = await User.create({
  name: "Zulkaif",
  email: "z@example.com",
  password: "hashedPassword",
  role: "developer"
})
// If validation fails (e.g. missing required field), it throws a ValidationError

// ─── READ ─────────────────────────────────────────────────────────────────────

// Get all users
const allUsers = await User.find()

// Get users with a filter
const admins = await User.find({ role: "admin" })

// Find by MongoDB _id — Mongoose automatically converts string to ObjectId
const user = await User.findById("507f1f77bcf86cd799439011")

// Find one by any field
const user = await User.findOne({ email: "z@example.com" })

// Chaining — like the shell, you can chain sort/select/limit
const recentUsers = await User
  .find({ isVerified: true })
  .select("name email")       // only return name and email fields (like projection)
  .sort({ createdAt: -1 })    // newest first
  .limit(10)
  .lean()   // .lean() returns plain JS objects instead of Mongoose Documents
            // Faster for read-only operations — no Mongoose overhead

// ─── UPDATE ──────────────────────────────────────────────────────────────────

// Find by ID and update — returns updated document if { new: true }
const updated = await User.findByIdAndUpdate(
  id,
  { $set: { isVerified: true } },  // use $set to only update specific fields
  { new: true }                     // return the NEW document (after update)
                                    // without this, it returns the ORIGINAL document
)

// Update many at once
await User.updateMany(
  { isVerified: false },    // filter: all unverified users
  { $set: { role: "guest" } }   // update: set role to "guest"
)

// ─── DELETE ──────────────────────────────────────────────────────────────────

// Delete by ID
await User.findByIdAndDelete(id)

// Delete many
await User.deleteMany({ isVerified: false })

// ─── POPULATE — Resolve a referenced ID into the actual document ──────────────
// Use when: you stored an ID reference (like authorId) and want the full object

const posts = await Post.find()
  .populate("authorId", "name email")
  // "authorId" is the field in Post that holds a User's _id
  // "name email" is the projection — only bring back name and email from User
  // Result: authorId becomes { name: "...", email: "..." } instead of just an ObjectId
```

---

## 17. Authentication & Security

### Create Admin User (in mongosh)

```js
use admin   // switch to the admin database

db.createUser({
  user: "adminUser",
  pwd: "securePassword123",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
  // userAdminAnyDatabase = can manage users across all databases
})
```

### Enable Authentication

By default MongoDB has no password. To enable it, edit `/etc/mongod.conf`:

```yaml
security:
  authorization: enabled
```

```bash
sudo systemctl restart mongod   # restart for changes to take effect

# Now connect with credentials
mongosh -u adminUser -p securePassword123 --authenticationDatabase admin
```

### Create App-Specific User (least privilege principle)

```js
use myAppDB   // switch to your app's database

db.createUser({
  user: "appUser",
  pwd: "strongAppPassword",
  roles: [{ role: "readWrite", db: "myAppDB" }]
  // readWrite = can read and write to myAppDB only
  // This user can't touch any other database — safer than root access
})
```

### Security Checklist

| ✅ Do | ❌ Don't |
|---|---|
| Store credentials in `.env` files | Hardcode passwords in code |
| Use IP whitelisting (Atlas) | Expose port 27017 to the internet |
| Create app-specific users with limited roles | Use the root user for your app |
| Whitelist `0.0.0.0/0` only in development | Leave unrestricted access in production |
| Add `.env` to `.gitignore` | Commit `.env` to Git |

---

## 18. Backup & Restore

### mongodump / mongorestore — Binary backup

```bash
# Backup the entire MongoDB server to a folder
mongodump --out /backup/mongo

# Backup one specific database
mongodump --db myApp --out /backup/

# Backup one specific collection
mongodump --db myApp --collection users --out /backup/

# Backup with authentication
mongodump --uri "mongodb://user:pass@localhost:27017/myApp" --out /backup/

# Restore an entire backup
mongorestore /backup/mongo/

# Restore a specific database
mongorestore --db myApp /backup/myApp/

# Restore and drop existing data first (clean restore)
mongorestore --drop --db myApp /backup/myApp/
```

### mongoexport / mongoimport — Human-readable backup

```bash
# Export a collection to a JSON file (human-readable, good for sharing data)
mongoexport --db myApp --collection users --out users.json

# Export to CSV (useful for opening in Excel/Sheets)
mongoexport --db myApp --collection users --type=csv --fields name,email --out users.csv

# Import from a JSON file
mongoimport --db myApp --collection users --file users.json

# Import and wipe existing data first
mongoimport --db myApp --collection users --file users.json --drop
```

---

## 19. Best Practices

### Index Best Practices

```js
// ✅ Always index fields you frequently query/filter/sort by
db.users.createIndex({ email: 1 })         // you always look up users by email
db.orders.createIndex({ userId: 1 })       // you always get orders by userId
db.sessions.createIndex({ token: 1 }, { unique: true })  // session lookups by token

// ✅ Use explain() to verify your queries use indexes
db.users.find({ email: "x@x.com" }).explain("executionStats")
// Look for: "stage": "IXSCAN" (good) vs "stage": "COLLSCAN" (bad)

// ❌ Don't index every field — indexes take up disk space and slow down writes
// Only index what you actually query
```

### Query Best Practices

```js
// ✅ Use projection — don't fetch fields you don't need
const user = await User.findById(id).select("name email role")

// ✅ Use .lean() in Mongoose for read-only queries
const users = await User.find().lean()  // 2-5x faster for reads

// ✅ Use limit() to prevent loading thousands of documents by accident
db.users.find().limit(100)

// ✅ Put $match early in aggregation pipelines to filter data ASAP
db.orders.aggregate([
  { $match: { status: "completed" } },  // filter first!
  { $group: { ... } }                   // then group the smaller dataset
])
```

### Schema Best Practices

```js
// ✅ Keep arrays bounded — don't let arrays grow indefinitely
// Instead of storing all order IDs in a user document (can grow to millions):
// ❌ Bad
{ userId: "u1", orderIds: ["o1", "o2", "o3", ...// 100,000 items] }

// ✅ Good — reference from the order side
// orders collection: { _id: "o1", userId: "u1", ... }
// Then query: db.orders.find({ userId: "u1" })

// ✅ Use timestamps: true in Mongoose — always useful for debugging and sorting
new mongoose.Schema({ ... }, { timestamps: true })

// ✅ Use select: false for sensitive fields like password
password: { type: String, select: false }
```

### General Rules

| ✅ Do | ❌ Don't |
|---|---|
| Keep documents under 1MB | Store large files in MongoDB — use S3 or Cloudinary |
| Use `lean()` for reads in Mongoose | Forget `await` on async Mongoose operations |
| Validate data in your Schema | Trust user input without validation |
| Use environment variables for DB URI | Hardcode connection strings |
| Index fields you frequently query | Create indexes on every field |
| Use `new: true` in `findByIdAndUpdate` | Wonder why you're getting old data back |

---

## 20. Quick Reference Cheatsheet

```js
// ══════════════════════════════════════════════════
//  DATABASE
// ══════════════════════════════════════════════════
use dbName              // switch to (or create) a database
show dbs                // list all databases
db                      // show current database name
db.dropDatabase()       // delete current database permanently

// ══════════════════════════════════════════════════
//  COLLECTIONS
// ══════════════════════════════════════════════════
show collections        // list collections in current db
db.createCollection("name")  // manually create a collection
db.collectionName.drop()     // delete a collection

// ══════════════════════════════════════════════════
//  INSERT
// ══════════════════════════════════════════════════
db.col.insertOne({ field: value })          // insert 1 document
db.col.insertMany([{ ... }, { ... }])       // insert multiple documents

// ══════════════════════════════════════════════════
//  FIND / READ
// ══════════════════════════════════════════════════
db.col.find()                               // get all documents
db.col.find({ field: value })              // get documents matching filter
db.col.findOne({ field: value })           // get first matching document
db.col.countDocuments({ field: value })    // count matching documents
db.col.find().sort({ field: 1 })           // sort ascending
db.col.find().sort({ field: -1 })          // sort descending
db.col.find().skip(10).limit(5)            // pagination: skip 10, take 5

// ══════════════════════════════════════════════════
//  UPDATE
// ══════════════════════════════════════════════════
db.col.updateOne({ filter }, { $set: { field: value } })   // update 1 doc
db.col.updateMany({ filter }, { $set: { field: value } })  // update all matching
db.col.replaceOne({ filter }, { newDoc })  // replace entire document
db.col.updateOne({ filter }, { $set: {...} }, { upsert: true }) // insert if not found

// ══════════════════════════════════════════════════
//  DELETE
// ══════════════════════════════════════════════════
db.col.deleteOne({ filter })       // delete 1 matching document
db.col.deleteMany({ filter })      // delete all matching documents
db.col.deleteMany({})              // delete ALL documents in collection

// ══════════════════════════════════════════════════
//  COMMON QUERY OPERATORS  (used inside find/update)
// ══════════════════════════════════════════════════
// $eq   → equal to               { age: { $eq: 25 } }
// $ne   → not equal              { age: { $ne: 25 } }
// $gt   → greater than           { age: { $gt: 18 } }
// $gte  → greater or equal       { age: { $gte: 18 } }
// $lt   → less than              { price: { $lt: 100 } }
// $lte  → less or equal          { price: { $lte: 100 } }
// $in   → matches any in array   { city: { $in: ["Lahore", "Karachi"] } }
// $nin  → not in array           { city: { $nin: ["Quetta"] } }
// $and  → all conditions true    { $and: [{...}, {...}] }
// $or   → any condition true     { $or: [{...}, {...}] }
// $not  → negate condition       { age: { $not: { $lt: 18 } } }
// $exists → field exists/not     { phone: { $exists: true } }

// ══════════════════════════════════════════════════
//  COMMON UPDATE OPERATORS  (used inside updateOne/Many)
// ══════════════════════════════════════════════════
// $set       → set field value         { $set: { name: "Ali" } }
// $unset     → remove a field          { $unset: { phone: "" } }
// $inc       → increment a number      { $inc: { views: 1 } }
// $push      → add to array            { $push: { tags: "new" } }
// $pull      → remove from array       { $pull: { tags: "old" } }
// $addToSet  → add to array (unique)   { $addToSet: { tags: "unique" } }

// ══════════════════════════════════════════════════
//  INDEXES
// ══════════════════════════════════════════════════
db.col.createIndex({ field: 1 })               // create index
db.col.createIndex({ field: 1 }, { unique: true })  // unique index
db.col.getIndexes()                            // list all indexes
db.col.dropIndex("field_1")                    // remove index by name

// ══════════════════════════════════════════════════
//  AGGREGATION
// ══════════════════════════════════════════════════
db.col.aggregate([
  { $match: { status: "active" } },          // filter
  { $group: { _id: "$city", count: { $sum: 1 } } },  // group + count
  { $sort: { count: -1 } },                  // sort by count
  { $limit: 10 },                            // top 10
  { $project: { _id: 0, city: "$_id", count: 1 } }   // rename _id to city
])
```

---

*Made with ❤️ for Zulkaif — keep building!*