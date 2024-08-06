const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // replace with your MySQL username
  password: "", // replace with your MySQL password
  database: "college", // replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Define a route to get data
// app.get('/api/items', (req, res) => {
//   const query = 'SELECT * FROM student';
//   // select*from student where email like '%pr%'or name like '%pr%'
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     res.json(results);
//   });
// });
app.get("/api/items", (req, res) => {
  const search = req.query.search || "";
  const query = `
    SELECT * FROM student 
   WHERE email LIKE ? OR name LIKE ? OR CAST(age AS CHAR) LIKE ? OR CAST(class AS CHAR) LIKE ?
  `;
  const searchParam = `%${search}%`;
  db.query(
    query,
    [searchParam, searchParam, searchParam, searchParam],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    }
  );
});

// Delete API
app.delete("/api/items/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM student WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error deleting item", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.send({ message: "Item deleted successfully" });
  });
});

// Edit API
// Edit API
app.put("/api/edit-items/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, email, class: studentClass } = req.body;

  if (age <= 4) {
    return res.status(400).send({ message: "Age must be greater than 4" });
  }

  const emailCheckQuery = "SELECT * FROM student WHERE email = ? AND id != ?";
  db.query(emailCheckQuery, [email, id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Error checking email", error: error });
    }
    if (results.length > 0) {
      return res.send({
        message: "Email already in use, please try with a different email",
      });
    }

    const updateQuery =
      "UPDATE student SET name=?, age=?, email=?, class=? WHERE id=?";
    db.query(
      updateQuery,
      [name, age, email, studentClass, id],
      (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: "Error updating item", error: error });
        }
        if (result.affectedRows === 0) {
          return res.status(404).send({ message: "Item not found" });
        }
        res.send({ message: "Item updated successfully" });
      }
    );
  });
});
// Add API
app.post("/api/add-items", (req, res) => {
  const { name, age, email, class: studentClass } = req.body;

  // Validate age
  if (age <= 4) {
    return res.status(400).send({ message: "Age must be greater than 4" });
  }

  const Emailcheck = "SELECT * FROM student WHERE email = ?";
  db.query(Emailcheck, [email], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      return res.send({
        message: "Email already in use, please try with a different email",
        status: false,
      });
    }

    const query =
      "INSERT INTO student (name, age, email, class) VALUES (?, ?, ?, ?)";
    db.query(query, [name, age, email, studentClass], (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error adding item", error: err, status: false });
      }

      const query1 = "SELECT * FROM student ORDER BY id DESC LIMIT 1";
      db.query(query1, (err, results) => {
        if (err) {
          return res.status(500).send({
            message: "Error fetching item",
            error: err,
            status: false,
          });
        }
        res.send({
          message: "Item added successfully",
          data: results,
          status: true,
        });
      });
    });
  });
});
// Get item by ID API
app.get("/api/get-items/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM student WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Teacher api

app.get("/api/teachers", (req, res) => {
  const search = req.query.search || "";
  const query = `
    SELECT * FROM Teacher
   WHERE email LIKE ? OR name LIKE ? OR subject LIKE ? OR CAST(age AS CHAR) LIKE ? 
  `;
  const searchParam = `%${search}%`;
  db.query(
    query,
    [searchParam, searchParam, searchParam, searchParam],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    }
  );
});

// Add teacher
// Add teacher
app.post("/api/add-teachers", (req, res) => {
  const { name, age, email, subject } = req.body;

  // Validate age
  if (age <= 18) {
    return res.status(400).send({ message: "Age must be greater than 18" });
  }

  const Emailcheck = "SELECT * FROM Teacher WHERE email = ?";
  db.query(Emailcheck, [email], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length > 0) {
      // Email already exists
      return res.send({
        message: "Email already in use, please try with a different email",
        status: false,
      });
    }

    // If email does not exist, proceed with the registration logic
    const query =
      "INSERT INTO Teacher (name, age, email, subject) VALUES (?, ?, ?, ?)";
    db.query(query, [name, age, email, subject], (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error adding item", error: err, status: false });
      }

      const query1 = "SELECT * FROM Teacher ORDER BY id DESC LIMIT 1";
      db.query(query1, (err, results) => {
        if (err) {
          return res.status(500).send({
            message: "Error fetching item",
            error: err,
            status: false,
          });
        }
        res.send({
          message: "Item added successfully",
          data: results,
          status: true,
        });
      });
    });
  });
});

// delete teachers

app.delete("/api/teachers/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Teacher WHERE id = ?"; // replace with your table name and column

  db.query(query, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error deleting item", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Item not found" });
    }
    res.send({ message: "Item deleted successfully" });
  });
});

// edit teacher
app.put("/api/edit-teachers/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, email, subject } = req.body;

  // Validate age
  if (age <= 18) {
    return res.status(400).send({ message: "Age must be greater than 18" });
  }

  // Check if the new email is already in use by another student
  const emailCheckQuery = "SELECT * FROM Teacher WHERE email = ? AND id != ?";
  db.query(emailCheckQuery, [email, id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .send({ message: "Error checking email", error: error });
    }
    if (results.length > 0) {
      // Email already exists for another student
      return res.send({
        message: "Email already in use, please try with a different email",
      });
    }

    // If email does not exist for another student, proceed with the update
    const updateQuery = "UPDATE Teacher SET name=?, age=?, email=? WHERE id=?";
    db.query(updateQuery, [name, age, email, id], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error updating item", error: error });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.send({ message: "Item updated successfully" });
    });
  });
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM User WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error checking credentials", error: err });
    }
    if (results.length === 0) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    res.send({ message: "Login successful", data: results });
  });
});

// Signup API
app.post("/api/signup", (req, res) => {
  const { username, email, password, phone } = req.body;

  // Validate input
  if (!username || !email || !password || !phone) {
    return res.status(400).send({ message: "All fields are required" });
  }

  // Check if the email already exists
  const emailCheckQuery =
    "SELECT * FROM User WHERE email = ? OR username=? OR phone= ?";
  db.query(emailCheckQuery, [email, username, phone], (err, results) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error checking email", error: err });
    }
    var message= "error"
    if (results.length > 0) {
      for (x in results) {
console.log(results[x])
        if (results[x].email === email) {
        var message =
            "Email already in use, please try with a different email";
        } else if (results[x].username === username) {
        var message =
            "username already in use, please try with a different username";
        } else if (results[x].phone === phone) {
          var message =
            "phone already in use, please try with a different phone";
        }
      }
      console.log(results);
      
      return res.send({
        message: message,
        status: false,
      });
    }

    // Insert new user into the database
    const query =
      "INSERT INTO User (username, email, password,phone) VALUES (?, ?, ?,?)";
    db.query(query, [username, email, password, phone], (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Error adding user", error: err, status: false });
      }
      res.send({ message: "User registered successfully", status: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
