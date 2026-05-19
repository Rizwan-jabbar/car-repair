# AutoSphere ERD (Entity Relationship Diagram)

## 1. Drawn ERD (Text Version)
```text
+-------------------+            +-------------------+
|       USER        |1          M|      BOOKING      |
|-------------------|------------|-------------------|
| PK _id            |            | PK _id            |
| name              |            | FK user -> USER   |
| email (unique)    |            | fullName          |
| contact           |            | phone             |
| password          |            | carModel          |
| role              |            | service (text)    |
| createdAt         |            | status            |
+-------------------+            | preferredDate     |
                                 | preferredTime     |
                                 | createdAt         |
                                 +-------------------+

+-------------------+            +-------------------+
|       USER        |1          M|       REVIEW      |
|-------------------|------------|-------------------|
| PK _id            |            | PK _id            |
| name              |            | FK user -> USER   |
| ...               |            | rating            |
+-------------------+            | title             |
                                 | service (text)    |
                                 | body              |
                                 | visible           |
                                 | verified          |
                                 | createdAt         |
                                 +-------------------+

+-------------------+   conceptual   +-------------------+
|      SERVICE      |1------------M  | BOOKING / REVIEW  |
|-------------------|                | service name text |
| PK _id            |                +-------------------+
| title             |
| description       |
| price             |
| isAvailable       |
+-------------------+

+-------------------+   +-------------------+   +-------------------+
|      CONTACT      |   |        FAQ        |   |      BANNER       |
|-------------------|   |-------------------|   |-------------------|
| PK _id            |   | PK _id            |   | PK _id            |
| name              |   | category          |   | imageOne          |
| phone             |   | question          |   | imageTwo          |
| email             |   | answer            |   | imageThree        |
| message           |   | createdAt         |   | title             |
| createdAt         |   +-------------------+   | description       |
+-------------------+                           | link              |
                                                | createdAt         |
                                                +-------------------+
```

## 2. Mermaid ERD (For Report/Docs)
```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string name
        string email UK
        string contact
        string password
        string role
        date createdAt
    }

    SERVICE {
        ObjectId _id PK
        string title
        string description
        number price
        boolean isAvailable
        date createdAt
        date updatedAt
    }

    BOOKING {
        ObjectId _id PK
        ObjectId user FK
        string fullName
        string phone
        string email
        string carModel
        string service
        string otherService
        string cityArea
        date preferredDate
        string preferredTime
        string notes
        boolean consent
        string status
        string arrivalTime
        date arrivalDate
        date createdAt
        date updatedAt
    }

    REVIEW {
        ObjectId _id PK
        ObjectId user FK
        string name
        string phone
        string email
        number rating
        string title
        string service
        string body
        boolean visible
        boolean verified
        date createdAt
        date updatedAt
    }

    CONTACT {
        ObjectId _id PK
        string name
        string phone
        string email
        string message
        date createdAt
        date updatedAt
    }

    FAQ {
        ObjectId _id PK
        string category
        string question
        string answer
        date createdAt
        date updatedAt
    }

    BANNER {
        ObjectId _id PK
        string imageOne
        string imageTwo
        string imageThree
        string title
        string description
        string link
        date createdAt
        date updatedAt
    }

    USER ||--o{ BOOKING : creates
    USER ||--o{ REVIEW : writes
    SERVICE ||--o{ BOOKING : selected_as_text
    SERVICE ||--o{ REVIEW : selected_as_text
```

## 3. Cardinality Notes
- `USER (1) -> (M) BOOKING`
- `USER (1) -> (M) REVIEW`
- `SERVICE` to `BOOKING/REVIEW` is conceptual (service name stored as string, not ObjectId FK).
- `CONTACT`, `FAQ`, and `BANNER` are standalone admin-managed entities.
