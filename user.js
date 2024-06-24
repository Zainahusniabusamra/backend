const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const router=express.Router();
var db=require('./db.js');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');


const admin = require('firebase-admin');
const pathModule = require('path');

const serviceAccount = require(pathModule.resolve(__dirname, 'secrets', 'athar-14346-firebase-adminsdk-pembg-cc600d6fac.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Your databaseURL here
  databaseURL: 'https://athar-14346-default-rtdb.firebaseio.com/',
});


router.post('/send-notification', async (req, res) => {
  const { recipient, title, message } = req.body;

  const payload = {
    notification: {
      title: title,
      body: message,
    },
    token: recipient, // The FCM token of the recipient device
  };

  try {
    const response = await admin.messaging().send(payload);
    console.log(`Successfully sent message '${recipient}' & '${title} :`, response);
    res.status(200).send('Notification sent successfully ');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending notification');
  }
});











// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
        user: 'reema1807r@gmail.com',
        pass: 'nrjh ceih bwmv ndcb'
    },
    tls: {
        rejectUnauthorized: false
    }
    
});

router.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
  
    try {
      await transporter.sendMail({
        from: 'zmuruda34@gmail.com',
        to,
        subject,
        text
      });
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });
  





router.route('/register').post((req, res) => {
    // Get params
    var user_name = req.body.user_name;
    var email = req.body.email;
    var password = req.body.password;
    var userType = req.body.userType;
    var status = req.body.status;
    var registeredAt = req.body.registeredAt;
    var age = req.body.age;
    var phone = req.body.phone;

    // Check if phone already exists
    var checkQuery = "SELECT * FROM users WHERE phone = ?";
    var checkQuery2 = "SELECT * FROM users WHERE email = ?";
    
    db.query(checkQuery, [phone], function(error, results, fields) {
        if (error) {
            // If error, send response here
            res.status(500).json({ success: false, message: error });
        } else {
            if (results.length > 0) {
                // If user with the same phone exists, send response here
                return res.status(409).json({ success: false, message: "User with the same phone number already exists." });
            } else {
                // Check if email already exists
                db.query(checkQuery2, [email], function(error, results, fields) {
                    if (error) {
                        // If error, send response here
                        res.status(500).json({ success: false, message: error });
                    } else {
                        if (results.length > 0) {
                            // If user with the same email exists, send response here
                            return res.status(409).json({ success: false, message: "User with the same email already exists." });
                        } else {
                            // If user does not exist, proceed with registration
                            var sqlQuery = "INSERT INTO users(user_name, email, password, userType, status, registeredAt, age, phone) VALUES (?,?,?,?,?,?,?,?)";
                            db.query(sqlQuery, [user_name, email, password, userType, status, registeredAt, age, phone], function(error, data, fields) {
                                if (error) {
                                    // If error, send response here
                                    res.status(500).json({ success: false, message: error });
                                } else {
                                    // If success, send response here
                                    res.status(200).json({ success: true, message: 'register' });
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});


router.route('/login').post((req,res)=>{

    var email=req.body.email;
    var password=req.body.password;

    var sql="SELECT * FROM users WHERE email=? AND password=?";
    
    if(email != "" && password !=""){
        db.query(sql,[email,password],function(err,data,fields){
            if(err){
                res.send(JSON.stringify({success:false,message:err}));

            }else{
                if(data.length > 0)
                {
                    res.send(JSON.stringify({success:true,user:data}));
                }else{
                    res.send(JSON.stringify({success:false,message:'Empty Data'}));
                }
            }
        });
    }else{
        res.send(JSON.stringify({success:false,message:'Email and password required!'}));
    }
});



router.route('/profile').post((req,res)=>{
    var email=req.body.email;
    var sql="SELECT * FROM users WHERE email=? ";
    
    if(email !== "") {
        db.query(sql,[email],function(err,data,fields){
            if(err) {
                res.send(JSON.stringify({success:false,message:err}));
            } else {
                if(data.length > 0) {
                    // Assuming username is retrieved from the database result
                    var username = data[0].userName; // Adjust this according to your database schema
                    res.send(JSON.stringify({success:true, user: {email: email, username: username}}));
                } else {
                    res.send(JSON.stringify({success:false,message:'Empty Data'}));
                }
            }
        });
    } else {
        res.send(JSON.stringify({success:false,message:'Email required!'}));
    }
});









router.route('/userType').post((req,res)=>{
    var email=req.body.email;
    var sql="SELECT * FROM users WHERE email=? ";
    
    if(email !== "") {
        db.query(sql,[email],function(err,data,fields){
            if(err) {
                res.send(JSON.stringify({success:false,message:err}));
            } else {
                if(data.length > 0) {
                    // Assuming username is retrieved from the database result
                    var userType = data[0].userType; // Adjust this according to your database schema
                    res.send(JSON.stringify({success:true, user: {email: email, userType: userType}}));
                } else {
                    res.send(JSON.stringify({success:false,message:'Empty Data'}));
                }
            }
        });
    } else {
        res.send(JSON.stringify({success:false,message:'Email required!'}));
    }
});


router.route('/adminType').post((req,res)=>{
    var admin_name=req.body.admin_name;
    var sql="SELECT * FROM administrators WHERE admin_name=? ";
    
    if(admin_name !== "") {
        db.query(sql,[admin_name],function(err,data,fields){
            if(err) {
                res.send(JSON.stringify({success:false,message:err}));
            } else {
                if(data.length > 0) {
                    // Assuming username is retrieved from the database result
                    var fk_role_id = data[0].fk_role_id; // Adjust this according to your database schema
                    res.send(JSON.stringify({success:true, user: {admin_name: admin_name, fk_role_id: fk_role_id}}));
                } else {
                    res.send(JSON.stringify({success:false,message:'Empty Data'}));
                }
            }
        });
    } else {
        res.send(JSON.stringify({success:false,message:'Email required!'}));
    }
});





router.route('/combinedData').post((req, res) => {
    var email = req.body.email;
    var sql = "SELECT h.*, d.donation_name, u.email AS user_email, u.phone, u.userName FROM history_of_donations h JOIN donations d ON h.fk_donation_id = d.donation_id JOIN donors dn ON h.fk_donor_id = dn.donor_id JOIN users u ON dn.fk_user_id = u.user_id WHERE u.email = ?";

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required!' });
    }

    db.query(sql, [email], function (err, data, fields) {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (data.length > 0) {
            var historyData = data.map(row => ({
                fk_donor_id: row.fk_donor_id,
                data_of_donation: row.data_of_donation,
                amount_of_donation: row.amount_of_donation,
                payment_method: row.payment_method,
                donation_name: row.donation_name,
                user_email: row.user_email,
                phone: row.phone,
                userName: row.userName // Adding username
            }));

            return res.status(200).json({ success: true, user_history: historyData });
        } else {
            return res.status(404).json({ success: false, message: 'No history found for this user' });
        }
    });
});

router.route('/create_table').post((req, res) => {
    const { table_name, table_description, selected_category, main_category } = req.body;

    if (!table_name || !table_description) {
        return res.status(400).json({ success: false, message: 'Table_name and table_description are required' });
    }

    // SQL query to create the main table
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${table_name} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            assetPath BLOB,
            description TEXT(255) NOT NULL,
            donation_target INT NOT NULL,
            current_donation INT NOT NULL,
            remaining_amount INT NOT NULL,
            status ENUM('active', 'inactive') DEFAULT 'active',
            num_of_donations INT NOT NULL
        )`;

    // Proceed with creating the table
    db.query(createTableQuery, (error, results, fields) => {
        if (error) {
            res.status(500).json({ success: false, message: error });
        } else {
            if (selected_category === 'Sub Category') {
                // Insert into sub_categories table
                const insertSubCategoryQuery = `
                    INSERT INTO sub_categories (sub_categories_name, fk_category_id) 
                    VALUES (?, (SELECT category_id FROM donation_categories WHERE category_table_name = ?))
                `;
                db.query(insertSubCategoryQuery, [table_name, main_category], (subError, subResults) => {
                    if (subError) {
                        res.status(500).json({ success: false, message: subError });
                    } else {
                        // Update donation_categories table to set has_a_sub to 1 for the corresponding main category
                        const updateMainCategoryQuery = `
                            UPDATE donation_categories 
                            SET has_a_sub = 1 
                            WHERE category_table_name = ?
                        `;
                        db.query(updateMainCategoryQuery, [main_category], (updateError, updateResults) => {
                            if (updateError) {
                                res.status(500).json({ success: false, message: updateError });
                            } else {
                                res.status(200).json({ success: true, message: 'Table and sub-category created successfully' });
                            }
                        });
                    }
                });
            } else {
                res.status(200).json({ success: true, message: 'Table created successfully' });
            }
        }
    });
});




router.get('/getData', (req, res) => {
    const columnName = 'category_table_name'; // Replace with actual column name
    const tableName = 'donation_categories '; // Replace with actual table name
    const query = `SELECT ${columnName} FROM ${tableName}`;

    // Execute the query
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving data from database');
            return;
        }
        //console.log(`Data from column ${columnName}:`);
        for (const row of results) {
            console.log(row[columnName]);
        }
            res.json(results);
    });
});







const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Destination folder for storing uploads
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Route for uploading image
  router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const { table_name } = req.body; // Get the table name from the request body
  
    if (!table_name) {
      return res.status(400).send('Table name is required.');
    }
});





  router.route('/insertion').post(async (req, res) => {
    const {
        table_name,
        //first_column,
        name_controller,
        assetPath_controller,
        description_controller,
        donation_target_controller,
        current_donation_controller,
        remaining_amount_controller,
        num_of_donations_controller,
        beneficiary_id
    } = req.body;

    const sql = `INSERT INTO ${table_name} (name, assetPath, description, donation_target, current_donation, remaining_amount, num_of_donations) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const sql2 = `INSERT INTO donations (donation_name, fk_sub_category_id , donation_target, current_donation, status, remaining_amount, description ,fk_beneficiary_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        await new Promise((resolve, reject) => {
            db.query(sql, [name_controller, assetPath_controller , description_controller, donation_target_controller, current_donation_controller, remaining_amount_controller, num_of_donations_controller], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    reject(err);
                } else {
                    console.log('Data inserted successfully');
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            db.query(sql2, [name_controller, , donation_target_controller, current_donation_controller, 'active', remaining_amount_controller, description_controller , beneficiary_id], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    reject(err);
                } else {
                    console.log('Data inserted successfully');
                    resolve();
                }
            });
        });

        res.status(200).send('Data inserted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error inserting data');
    }
});










router.get('/searchTable', (req, res) => {
    const tableName = req.query.name; // Get the table name from query parameter

    if (!tableName) {
        return res.status(400).json({ error: 'Table name is required.' });
    }

    const query = `SHOW TABLES LIKE '${tableName}'`;

    // Execute the query
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Error executing query.' });
        }

        if (results.length > 0) {
            return res.json({ exists: true, tableName });
        } else {
            return res.json({ exists: false, tableName });
        }
    });
});


router.get('/getColumnData', (req, res) => {
    const columnName = req.query.columnName; // Get the column name from query parameter
    const tableName = req.query.tableName; // Get the table name from query parameter

    console.log('Received columnName:', columnName); // Debug statement
    console.log('Received tableName:', tableName); // Debug statement


    if (!columnName || !tableName) {
        return res.status(400).json({ error: 'Column name and table name are required.' });
    }

    let query = `SELECT ${columnName} FROM ${tableName}`;

    // // Add condition to exclude rows with has_a_sub = 1 for donation_categories table
    // if (tableName === 'donation_categories') {
    //     query += ' WHERE has_a_sub != 1';
    // }

    // Execute the query
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Error executing query.' });
        }

        // Extract the column values from the query results
        const columnData = results.map(row => row[columnName]);
        
        // Send the column data as the response
        res.json({ columnData, tableName });
    });
});









router.post('/fetchData', (req, res) => {
    const { name } = req.body;
  
    // Query to fetch data from the specified table
    const query = `SELECT * FROM ${name}`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      // Modify each project to include image data
      const projectsWithImageData = results.map(project => ({
        ...project,
        imageData: project.assetPath && project.assetPath.data ? Array.from(project.assetPath.data) : null
    }));
  
      res.json(projectsWithImageData);
    });
});




router.post('/has_a_sub', (req, res) => {
    const { name } = req.body;

    // Query to check if category_table_name exists and has_a_sub is 1
    const checkQuery = `SELECT has_a_sub FROM donation_categories WHERE category_table_name = '${name}'`;

    db.query(checkQuery, (checkErr, checkResults) => {
        if (checkErr) {
            console.error('Error checking category data: ', checkErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (checkResults.length > 0 && checkResults[0].has_a_sub === 1) {
            // If category_table_name exists and has_a_sub is 1, return subCategories flag as true
            res.json({ hasSubCategories: true });
        } else {
            // Otherwise, return subCategories flag as false
            res.json({ hasSubCategories: false });
        }
    });
});


router.post('/fetchSubCategories', (req, res) => {
    const { name } = req.body;

    // Query to fetch sub-category names
    const subQuery = `SELECT sub_categories_name FROM sub_categories WHERE fk_category_id IN (SELECT category_id FROM donation_categories WHERE category_table_name = '${name}')`;
    
    db.query(subQuery, (subErr, subResults) => {
        if (subErr) {
            console.error('Error executing sub-category query: ', subErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Return sub-category names
        const subCategoryNames = subResults.map(sub => sub.sub_categories_name);
        res.json({ subCategories: subCategoryNames });
    });
});


router.post('/fetchGeneralProjects', (req, res) => {

    const query = `SELECT id, description FROM مشاريع_عامه`;
    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching general projects:', error);
            res.status(500).json({ error: 'Failed to fetch general projects' });
        } else {
            // Map the results to extract id and description
            const projects = results.map(row => ({
                id: row.id,
                description: row.description
            }));
            // Send the projects data as a response
            res.json(projects);
        }
    });
});








router.post('/moveSelectedProjects', (req, res) => {
  const selectedProjects = req.body.selectedProjects; // Expecting { projectId1: true, projectId2: false, ... }
  const tableName = req.body.tableName; // Table name where data should be inserted

  console.log('Selected projects:', selectedProjects);
  console.log('Target table name:', tableName);

  // Extract project IDs where value is true
  const projectIds = Object.keys(selectedProjects).filter(key => selectedProjects[key]);

  console.log('Filtered project IDs:', projectIds);

  if (projectIds.length === 0) {
    return res.status(400).json({ message: 'No projects selected' });
  }

  // Convert projectIds to a string format suitable for SQL IN clause
  const projectIdsStr = projectIds.join(',');

  // Begin transaction
  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ message: 'Transaction error', error: err });
    }

    // Select projects to move
    const selectQuery = `SELECT * FROM مشاريع_عامه WHERE id IN (${projectIdsStr})`;

    db.query(selectQuery, (selectError, results) => {
      if (selectError) {
        return db.rollback(() => {
          res.status(500).json({ message: 'Error selecting projects', error: selectError });
        });
      }

      // Prepare values for insertion into the target table
      const insertValues = results.map(row => [
        row.id,
        row.name,
        row.assetPath,
        row.description,
        row.donation_target,
        row.current_donation,
        row.status,
        row.remaining_amount,
        row.num_of_donations
      ]);

      // Insert selected projects into the target table
      const insertQuery = `
        INSERT INTO ${db.escapeId(tableName)} (id, name, assetPath, description, donation_target, current_donation, status, remaining_amount, num_of_donations)
        VALUES ?
      `;

      db.query(insertQuery, [insertValues], (insertError, insertResult) => {
        if (insertError) {
          return db.rollback(() => {
            res.status(500).json({ message: 'Error inserting projects', error: insertError });
          });
        }

        // Delete the selected projects from the original table
        const deleteQuery = `DELETE FROM مشاريع_عامه WHERE id IN (${projectIdsStr})`;

        db.query(deleteQuery, (deleteError, deleteResult) => {
          if (deleteError) {
            return db.rollback(() => {
              res.status(500).json({ message: 'Error deleting projects', error: deleteError });
            });
          }

          // Commit transaction
          db.commit(commitError => {
            if (commitError) {
              return db.rollback(() => {
                res.status(500).json({ message: 'Transaction commit error', error: commitError });
              });
            }

            res.status(200).json({ message: 'Projects moved successfully' });
          });
        });
      });
    });
  });
});




// router.post('/moveSelectedProjects', (req, res) => {
//     const selectedProjects = req.body.selectedProjects; // Expecting { projectId1: true, projectId2: false, ... }
//     console.log('Selected projects:', selectedProjects);
//     const tableName = req.body.tableName; // Expecting { projectId1: true, projectId2: false, ... }

//     // Extract project IDs where value is true
//     const projectIds = Object.keys(selectedProjects).filter(key => selectedProjects[key]);
  
//     console.log('Filtered project IDs:', projectIds);

//     if (projectIds.length === 0) {
//       return res.status(400).json({ message: 'No projects selected' });
//     }
  
//     // Convert projectIds to a string format suitable for SQL IN clause
//     const projectIdsStr = projectIds.join(',');
  
//     // Begin transaction
//     db.beginTransaction(err => {
//       if (err) {
//         return res.status(500).json({ message: 'Transaction error', error: err });
//       }
  
//       // Select projects to move
//       const selectQuery = `SELECT * FROM مشاريع_عامه WHERE id IN (${projectIdsStr})`;
  
//       db.query(selectQuery, (selectError, results) => {
//         if (selectError) {
//           return db.rollback(() => {
//             res.status(500).json({ message: 'Error selecting projects', error: selectError });
//           });
//         }
  
//         // Prepare values for insertion into the target table
//         const insertValues = results.map(row => [
//           row.id,
//           row.name,
//           row.assetPath,
//           row.description,
//           row.donation_target,
//           row.current_donation,
//           row.status,
//           row.remaining_amount,
//           row.num_of_donations
//         ]);
  
//         // Insert selected projects into the target table
//         const insertQuery = `
//           INSERT INTO ${tableName} (id, name, assetPath, description, donation_target, current_donation, status, remaining_amount, num_of_donations)
//           VALUES ?
//         `;
  
//         db.query(insertQuery, [insertValues], (insertError, insertResult) => {
//           if (insertError) {
//             return db.rollback(() => {
//               res.status(500).json({ message: 'Error inserting projects', error: insertError });
//             });
//           }
  
//           // Delete the selected projects from the original table
//           const deleteQuery = `DELETE FROM مشاريع_عامه WHERE id IN (${projectIdsStr})`;
  
//           db.query(deleteQuery, (deleteError, deleteResult) => {
//             if (deleteError) {
//               return db.rollback(() => {
//                 res.status(500).json({ message: 'Error deleting projects', error: deleteError });
//               });
//             }
  
//             // Commit transaction
//             db.commit(commitError => {
//               if (commitError) {
//                 return db.rollback(() => {
//                   res.status(500).json({ message: 'Transaction commit error', error: commitError });
//                 });
//               }
  
//               res.status(200).json({ message: 'Projects moved successfully' });
//             });
//           });
//         });
//       });
//     });
//   });
  


// Multer configuration for file uploads
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); // Generate unique filename
    }
});

const upload2 = multer({ storage: storage2 });


router.post('/submit-form', (req, res) => {
    
    const { userName, email, userType, age, phone, password, beneficiary_id } = req.body;

    // Start a database transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error beginning transaction:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Insert user information into users table
        const userQuery = 'INSERT INTO users (userName, email, userType, age, phone, password) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(userQuery, [userName, email, 'beneficiary', age, phone, password], (err, userResult) => {
            if (err) {
                console.error('Error inserting user data:', err);
                // Rollback the transaction
                db.rollback(() => {
                    res.status(500).json({ error: 'Internal Server Error' });
                });
                return;
            }
            console.log('User data inserted successfully');

            const userId = userResult.insertId;

            // Get the user_pending_id from beneficiaries table
            const beneficiaryQuery = 'SELECT fk_user_pending_id FROM beneficiaries WHERE beneficiary_id = ?';
            db.query(beneficiaryQuery, [beneficiary_id], (err, beneficiaryResult) => {
                if (err) {
                    console.error('Error retrieving beneficiary data:', err);
                    db.rollback(() => {
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
                    return;
                }

                if (beneficiaryResult.length === 0) {
                    console.error('Beneficiary not found');
                    db.rollback(() => {
                        res.status(404).json({ error: 'Beneficiary not found' });
                    });
                    return;
                }

                const userPendingId = beneficiaryResult[0].fk_user_pending_id;

                // Update fk_user_pending_id to NULL in beneficiaries table
                const updateBeneficiaryQuery = 'UPDATE beneficiaries SET fk_user_pending_id = NULL, fk_users_id = ? WHERE beneficiary_id = ?';
                db.query(updateBeneficiaryQuery, [userId, beneficiary_id], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating beneficiary data:', err);
                        db.rollback(() => {
                            res.status(500).json({ error: 'Internal Server Error' });
                        });
                        return;
                    }

                    // Delete the user from users_pending table
                    const deletePendingQuery = 'DELETE FROM users_pending WHERE user_pending_id = ?';
                    db.query(deletePendingQuery, [userPendingId], (err, deleteResult) => {
                        if (err) {
                            console.error('Error deleting user pending data:', err);
                            // Rollback the transaction
                            db.rollback(() => {
                                res.status(500).json({ error: 'Internal Server Error' });
                            });
                            return;
                        }

                        if (deleteResult.affectedRows === 0) {
                            console.error('User pending data not found');
                            // Rollback the transaction
                            db.rollback(() => {
                                res.status(404).json({ error: 'User pending data not found' });
                            });
                            return;
                        }

                        console.log('User pending data deleted successfully');

                        // Commit the transaction
                        db.commit((err) => {
                            if (err) {
                                console.error('Error committing transaction:', err);
                                res.status(500).json({ error: 'Internal Server Error' });
                                return;
                            }

                            // Respond with success message
                            res.status(200).json({ success: true, message: 'User data saved successfully' });
                        });
                    });
                });
            });
        });
    });
});








// router.post('/submit-form', (req, res) => {
//     const { userName, email, userType, age, phone, password, beneficiary_id } = req.body;

//     // Start a database transaction
//     db.beginTransaction((err) => {
//         if (err) {
//             console.error('Error beginning transaction:', err);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         // Insert user information into users table
//         const userQuery = 'INSERT INTO users (userName, email, userType, age, phone, password) VALUES (?, ?, ?, ?, ?, ?)';
//         db.query(userQuery, [userName, email, 'beneficiary', age, phone, password], (err, userResult) => {
//             if (err) {
//                 console.error('Error inserting user data:', err);
//                 // Rollback the transaction
//                 db.rollback(() => {
//                     res.status(500).json({ error: 'Internal Server Error' });
//                 });
//                 return;
//             }
//             console.log('User data inserted successfully');

//             const userId = userResult.insertId;

//             // Get the user_pending_id from beneficiaries table
//             const beneficiaryQuery = 'SELECT fk_user_pending_id FROM beneficiaries WHERE beneficiary_id = ?';
//             db.query(beneficiaryQuery, [beneficiary_id], (err, beneficiaryResult) => {
//                 if (err) {
//                     console.error('Error retrieving beneficiary data:', err);
//                     db.rollback(() => {
//                         res.status(500).json({ error: 'Internal Server Error' });
//                     });
//                     return;
//                 }

//                 if (beneficiaryResult.length === 0) {
//                     console.error('Beneficiary not found');
//                     db.rollback(() => {
//                         res.status(404).json({ error: 'Beneficiary not found' });
//                     });
//                     return;
//                 }

//                 const userPendingId = beneficiaryResult[0].fk_user_pending_id;

//                 // Update fk_user_pending_id to NULL in beneficiaries table
//                 const updateBeneficiaryQuery = 'UPDATE beneficiaries SET fk_user_pending_id = NULL WHERE beneficiary_id = ?';
//                 db.query(updateBeneficiaryQuery, [beneficiary_id], (err, updateResult) => {
//                     if (err) {
//                         console.error('Error updating beneficiary data:', err);
//                         db.rollback(() => {
//                             res.status(500).json({ error: 'Internal Server Error' });
//                         });
//                         return;
//                     }

//                     // Delete the user from users_pending table
//                     const deletePendingQuery = 'DELETE FROM users_pending WHERE user_pending_id = ?';
//                     db.query(deletePendingQuery, [userPendingId], (err, deleteResult) => {
//                         if (err) {
//                             console.error('Error deleting user pending data:', err);
//                             // Rollback the transaction
//                             db.rollback(() => {
//                                 res.status(500).json({ error: 'Internal Server Error' });
//                             });
//                             return;
//                         }

//                         if (deleteResult.affectedRows === 0) {
//                             console.error('User pending data not found');
//                             // Rollback the transaction
//                             db.rollback(() => {
//                                 res.status(404).json({ error: 'User pending data not found' });
//                             });
//                             return;
//                         }

//                         console.log('User pending data deleted successfully');

//                         // Commit the transaction
//                         db.commit((err) => {
//                             if (err) {
//                                 console.error('Error committing transaction:', err);
//                                 res.status(500).json({ error: 'Internal Server Error' });
//                                 return;
//                             }

//                             // Respond with success message
//                             res.status(200).json({ success: true, message: 'User data saved successfully' });
//                         });
//                     });
//                 });
//             });
//         });
//     });
// });



router.post('/submit-form-pending', upload2.array('file', 2), (req, res) => {


    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }

    const { userName, email, age, phone, password, city, address, bio, description, title, amount } = req.body;

    // Extract uploaded file names
    const fileNames = req.files.map(file => file.filename);

    // Start a database transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error beginning transaction:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Insert user information into users_pending table
        const userQuery = 'INSERT INTO users_pending (userName, email, age, phone, password ) VALUES (?, ?, ?, ?, ?)';
        db.query(userQuery, [userName, email, age, phone, password], (err, userResult) => {
            if (err) {
                console.error('Error inserting user data:', err);
                db.rollback(() => {
                    res.status(500).json({ error: 'Internal Server Error' });
                });
                return;
            }
            console.log('User-pending data inserted successfully');

            const userPendingId = userResult.insertId;

            // Insert beneficiary information into beneficiaries table
            const beneficiaryQuery = 'INSERT INTO beneficiaries (beneficiary_name, description, email, phone, address, city, fk_user_pending_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(beneficiaryQuery, [userName, bio, email, phone, address, city, userPendingId], (err, beneficiaryResult) => {
                if (err) {
                    console.error('Error inserting beneficiary data:', err);
                    db.rollback(() => {
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
                    return;
                }
                console.log('Beneficiary data inserted successfully');

                const beneficiaryId = beneficiaryResult.insertId;

                // Insert beneficiary document into beneficiary_documents table
                const documentQuery = 'INSERT INTO beneficiary_documents (fk_beneficiary_id, document_name, document_description, document_content, target_amount) VALUES (?, ?, ?, ?, ?)';
                db.query(documentQuery, [beneficiaryId, title, description, fileNames.join(','), amount], (err, documentResult) => {
                    if (err) {
                        console.error('Error inserting document data:', err);
                        db.rollback(() => {
                            res.status(500).json({ error: 'Internal Server Error' });
                        });
                        return;
                    }
                    console.log('Document data inserted successfully');

                    // Commit the transaction
                    db.commit((err) => {
                        if (err) {
                            console.error('Error committing transaction:', err);
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }

                        res.status(200).json({ success: true, message: 'Data saved successfully' });
                    });
                });
            });
        });
    });
});






router.route('/registerAdmin1').post((req, res) => {
    // Get params
    var { userName, email, password, status, registeredAt, age, phone, job } = req.body;
    var userType = 'admin';
    var roleId;

    // Determine roleId based on job
    switch (job) {
        case 'document_management':
            roleId = 1;
            break;
        case 'financial_oversight':
            roleId = 2;
            break;
        case 'community_engagement':
            roleId = 3;
            break;
        case 'reporting_and_analytics':
            roleId = 4;
            break;
        default:
            roleId = 1; // Default to document management if job is not specified
    }

    // Check if phone or email already exists
    var checkQuery = "SELECT * FROM users WHERE phone = ? OR email = ?";
    
    db.query(checkQuery, [phone, email], (error, results, fields) => {
        if (error) {
            res.status(500).json({ success: false, message: error });
        } else if (results.length > 0) {
            if (results.some(user => user.phone === phone)) {
                res.status(409).json({ success: false, message: "User with the same phone number already exists." });
            } else {
                res.status(409).json({ success: false, message: "User with the same email already exists." });
            }
        } else {
            // Proceed with registration
            var insertUserQuery = "INSERT INTO users(userName, email, password, userType, status, registeredAt, age, phone) VALUES (?,?,?,?,?,?,?,?)";
            db.query(insertUserQuery, [userName, email, password, userType, status, registeredAt, age, phone], (error, userData) => {
                if (error) {
                    res.status(500).json({ success: false, message: error });
                } else {
                    // Insert into admin table
                    var admin_name = userName;
                    var fk_role_id = roleId; // Assign roleId based on job
                    var fk_user_id = userData.insertId;

                    var insertAdminQuery = "INSERT INTO administrators(admin_name, fk_role_id, fk_user_id) VALUES (?,?,?)";
                    db.query(insertAdminQuery, [admin_name, fk_role_id, fk_user_id], (adminError, adminData) => {
                        if (adminError) {
                            res.status(500).json({ success: false, message: adminError });
                        } else {
                            res.status(200).json({ success: true, message: 'Admin registered successfully' });
                        }
                    });
                }
            });
        }
    });
});








// Route to get admins based on title
router.get('/admins', (req, res) => {
    const title = req.query.title;
  
    let roleId;
    switch (title) {
      case 'إدارة الوثائق':
        roleId = 1;
        break;
      case 'اضافة قوائم':
        roleId = 2;
        break;
      case 'التقارير':
        roleId = 3;
        break;
      case 'Reporting and Analytics':
        roleId = 4;
        break;
      default:
        roleId = null;
    }
  
    if (roleId === null) {
      return res.status(400).json({ success: false, message: 'Invalid title' });
    }
  
    const query = 'SELECT admin_name FROM administrators WHERE fk_role_id = ?';
    db.query(query, [roleId], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch admins' });
      }
  
      const adminNames = results.map(result => result.admin_name);
      res.status(200).json({ success: true, admins: adminNames });
    });
  });
  



  



  router.put('/admin/updateRole', (req, res) => {
    const { adminName } = req.body; // Change adminId to adminName

    console.log('Received adminName:', adminName); // Log the received adminName

    const updateQuery = 'UPDATE administrators SET fk_role_id = ? WHERE admin_name = ?'; // Assuming admin_name is the column name

    db.query(updateQuery, [5, adminName], (error, results) => {
        if (error) {
            console.error('Error updating admin role:', error); // Log any errors
            return res.status(500).json({ success: false, message: 'Failed to update admin role' });
        }

        console.log('Admin role updated successfully'); // Log success message
        res.status(200).json({ success: true, message: 'Admin role updated successfully' });
    });
});




router.get('/beneficiary_documents', (req, res) => {
    const query = `
      SELECT bd.document_id, bd.fk_beneficiary_id, bd.document_name, bd.document_description, 
             bd.document_content, bd.upload_date, bd.target_amount, bd.is_accepted, 
             b.beneficiary_id, b.beneficiary_name, b.description as beneficiary_description, b.email, b.phone,
             up.password  , up.age 
      FROM beneficiary_documents bd
      INNER JOIN beneficiaries b ON bd.fk_beneficiary_id = b.beneficiary_id
      LEFT JOIN users_pending up ON b.fk_user_pending_id = up.user_pending_id
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data: ' + err.stack);
        res.status(500).send('Error fetching data');
        return;
      }
  
      res.json(results);
    });
});




// router.get('/beneficiary_documents', (req, res) => {
//     const query = `
//       SELECT bd.document_id, bd.fk_beneficiary_id, bd.document_name, bd.document_description, 
//              bd.document_content, bd.upload_date, bd.target_amount, bd.is_accepted, 
//              b.beneficiary_name, b.description as beneficiary_description ,email , phone
//       FROM beneficiary_documents bd
//       INNER JOIN beneficiaries b ON bd.fk_beneficiary_id = b.beneficiary_id
//     `;
  
//     db.query(query, (err, results) => {
//       if (err) {
//         console.error('Error fetching data: ' + err.stack);
//         res.status(500).send('Error fetching data');
//         return;
//       }
  
//       res.json(results);
//     });
// });


router.post('/update_request_status', (req, res) => {
    const { requestId, newStatus } = req.body;
  
    // Assuming you have a database connection named db
    const query = `
      UPDATE beneficiary_documents
      SET is_accepted = ?
      WHERE document_id = ?
    `;
  
    db.query(query, [newStatus, requestId], (err, results) => {
      if (err) {
        console.error('Error updating request status: ' + err.stack);
        res.status(500).send('Error updating request status');
        return;
      }
  
      res.status(200).send('Request status updated successfully');
    });
});
 


// router.post('/update_request_status', (req, res) => {
//     const { requestId, newStatus } = req.body;
  
//     // Assuming you have a database connection named db
//     const query = `
//       UPDATE beneficiary_documents
//       SET is_accepted = ?
//       WHERE document_id = ?
//     `;
  
//     db.query(query, [newStatus === 'Accepted' ? 1 : 0, requestId], (err, results) => {
//       if (err) {
//         console.error('Error updating request status: ' + err.stack);
//         res.status(500).send('Error updating request status');
//         return;
//       }
  
//       res.status(200).send('Request status updated successfully');
//     });
//   });




const calculateUserPreferences = (userId, callback) => {
    const query = `
        SELECT d.fk_sub_category_id, SUM(h.amount_of_donation) AS total_amount
        FROM history_of_donations h
        JOIN donations d ON h.fk_donation_id = d.donation_id
        WHERE h.fk_donor_id = ?
        GROUP BY d.fk_sub_category_id
        ORDER BY total_amount DESC
        LIMIT 1
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        const preferredCategory = results[0]?.fk_sub_category_id || null;
        callback(null, preferredCategory);
    });
};

// Function to get recommended cases
const getRecommendedCases = (userId, callback) => {
    calculateUserPreferences(userId, (err, preferredCategory) => {
        if (err) {
            callback(err, null);
            return;
        }

        if (!preferredCategory) {
            callback(null, []);
            return;
        }

        const query = `
            SELECT * FROM donations
            WHERE fk_sub_category_id = ?
            ORDER BY current_donation DESC
            LIMIT 5
        `;
        db.query(query, [preferredCategory], (err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, results);
        });
    });
};

// Define a route to get recommendations for a user
router.get('/recommendations', (req, res) => {
    const userId = req.query.user_id;
    if (!userId) {
        res.status(400).send('User ID is required');
        return;
    }

    getRecommendedCases(userId, (err, recommendations) => {
        if (err) {
            res.status(500).send('Error fetching recommendations');
            return;
        }
        res.json(recommendations);
    });
});


// router.get('/donations', async (req, res) => {
//     try {
//       const result = await new Promise((resolve, reject) => {
//         db.query(
//           'SELECT donation_id, donation_name FROM donations WHERE donation_target = current_donation',
//           (error, results) => {
//             if (error) return reject(error);
//             resolve(results);
//           }
//         );
//       });
  
//       // Log the result to ensure it's being populated
//       console.log('Database query result:', result);
  
//       // Check if result is defined and is an array
//       if (result && Array.isArray(result)) {
//         const donations = result.map(row => ({
//           donation_id: row.donation_id,
//           donation_name: row.donation_name
//         }));
  
//         res.json({ donations });
//       } else {
//         // If result is not defined or not an array, return an empty list
//         res.json({ donations: [] });
//       }
//     } catch (err) {
//       console.error('Error fetching donations', err);
//       res.status(500).send('Server Error');
//     }
//   });
  
router.get('/donations', async (req, res) => {
    try {
        const result = await new Promise((resolve, reject) => {
            db.query(
                'SELECT donation_id, donation_name FROM donations WHERE status = ? AND donation_target = current_donation',
                ['active'],
                (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                }
            );
        });

        // Log the result to ensure it's being populated
        console.log('Database query result:', result);

        // Check if result is defined and is an array
        if (result && Array.isArray(result)) {
            const donations = result.map(row => ({
                donation_id: row.donation_id,
                donation_name: row.donation_name
            }));

            res.json({ donations });
        } else {
            // If result is not defined or not an array, return an empty list
            res.json({ donations: [] });
        }
    } catch (err) {
        console.error('Error fetching donations', err);
        res.status(500).send('Server Error');
    }
});

// Define endpoint to handle requests
router.get('/donation3/:donationId', (req, res) => {
    const donationId = req.params.donationId;
  
    // Query donations table to get fk_beneficiary_id
    const sqlDonationsQuery = `SELECT fk_beneficiary_id FROM donations WHERE donation_id = ${donationId}`;
    db.query(sqlDonationsQuery, (err, donationResult) => {
      if (err) {
        console.error('Error querying donations table: ' + err.stack);
        res.status(500).send('Error querying donations table');
        return;
      }
  
      if (donationResult.length === 0) {
        res.status(404).send('Donation not found');
        return;
      }
  
      const fkBeneficiaryId = donationResult[0].fk_beneficiary_id;
  
      // Query beneficiaries table to get email and name
      const sqlBeneficiaryQuery = `SELECT email, beneficiary_name FROM beneficiaries WHERE beneficiary_id = ${fkBeneficiaryId}`;
      db.query(sqlBeneficiaryQuery, (err, beneficiaryResult) => {
        if (err) {
          console.error('Error querying beneficiaries table: ' + err.stack);
          res.status(500).send('Error querying beneficiaries table');
          return;
        }
  
        if (beneficiaryResult.length === 0) {
          res.status(404).send('Beneficiary not found');
          return;
        }
  
        const beneficiaryData = {
          email: beneficiaryResult[0].email,
          name: beneficiaryResult[0].beneficiary_name
        };
  
        res.json(beneficiaryData);
      });
    });
  });
  




  router.route('/beneficiary').get((req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const sqlBeneficiary = `SELECT beneficiary_id, beneficiary_name, city, address, phone, description FROM beneficiaries WHERE email = ?`;

    db.query(sqlBeneficiary, [email], (err, beneficiaryResult) => {
        if (err) {
            console.error('Error executing SQL query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (beneficiaryResult.length === 0) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        const beneficiary = beneficiaryResult[0];
        const beneficiaryId = beneficiary.beneficiary_id;

        console.log('Beneficiary ID:', beneficiaryId); // Log beneficiary ID for debugging

        const sqlDonations = `SELECT donation_id, donation_target, current_donation FROM donations WHERE fk_beneficiary_id = ?`;

        db.query(sqlDonations, [beneficiaryId], (err, donationResult) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            console.log('Donation result:', donationResult); // Log donation result for debugging

            if (donationResult.length === 0) {
                return res.status(404).json({ error: 'No donations found for the provided beneficiary ID' });
            }

            // Combine beneficiary data with donation data
            const response = {
                ...beneficiary,
                donation: donationResult[0]
            };

            return res.json(response);
        });
    });
});





// Define a route to fetch the 5 lowest num_of_donations
router.get('/low-donations', (req, res) => {
    const query = 'SELECT * FROM مشاريع_عامه ORDER BY num_of_donations ASC LIMIT 5';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query: ' + error.stack);
        res.status(500).send('Error executing query');
        return;
      }
  
      res.json(results);
    });
  });



  router.post('/get-username', (req, res) => {
    const email = req.body.email;
  
    if (!email) {
      return res.status(400).send({ error: 'Email is required' });
    }
  
    const query = 'SELECT userName FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send({ error: 'Internal server error' });
      }
  
      if (results.length > 0) {
        res.send({ userName: results[0].userName });
      } else {
        res.status(404).send({ error: 'User not found' });
      }
    });
  });






// Route to fetch donation details by ID
router.post('/donations2', (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ error: 'ID parameter is required' });
    }
  
    const sql = `SELECT * FROM donations WHERE donation_id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Failed to fetch donations' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: `No donation found with ID ${id}` });
      }
  
      res.status(200).json(results);
    });
  });






// Route to handle POST request from Postman
router.post('/process-donation', (req, res) => {
    const { donation_id, name } = req.body;
  
    // Fetch data from donations table for the specified donation_id
    const selectQuery = `SELECT * FROM donations WHERE donation_id = ?`;
  
    db.query(selectQuery, [donation_id], (err, results) => {
      if (err) {
        console.error('Error fetching donation:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Donation not found' });
        return;
      }
  
      // Extract relevant data
      const { donation_name, donation_target } = results[0];
  
      // Prepare data for insertion into done_donations table
      const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const insertQuery = `
        INSERT INTO done_donations 
        (done_donations_name, end_date, start_date, person_name, documents, target_amount, fk_donations_id, has_doc) 
        VALUES (?, ?, NULL, ?, NULL, ?, ?, 0)
      `;
  
      const values = [donation_name, currentDate, name, donation_target, donation_id];
  
      // Insert into done_donations table
      db.query(insertQuery, values, (err, results) => {
        if (err) {
          console.error('Error inserting into done_donations:', err);
          res.status(500).json({ error: 'Database error' });
          return;
        }
  
        // Update status of the donation to 'inactive' in donations table
        const updateQuery = `UPDATE donations SET status = 'inactive' WHERE donation_id = ?`;
  
        db.query(updateQuery, [donation_id], (err, results) => {
          if (err) {
            console.error('Error updating donation status:', err);
            res.status(500).json({ error: 'Database error' });
            return;
          }
  
          res.status(200).json({ message: 'Donation processed successfully' });
        });
      });
    });
});




router.post('/upload3', upload.single('file'), (req, res) => {
  const file = req.file; // Uploaded file object
  const donationId = req.body.donationId; // Donation ID sent as a field

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Read the file to get its buffer
  fs.readFile(file.path, (err, imageBuffer) => {
    if (err) {
      console.error('Error reading the file:', err);
      return res.status(500).send('File read failed.');
    }

    // SQL query to update the done_donations table
    const query = `UPDATE done_donations SET documents = ?, has_doc = 1 WHERE fk_donations_id = ?`;

    db.query(query, [imageBuffer, donationId], (err, results) => {
      if (err) {
        console.error('Error updating the database:', err);
        return res.status(500).send('Database update failed.');
      }

      // Remove the file from the server after processing
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Error deleting the file:', err);
          return res.status(500).send('File deletion failed.');
        }

        res.send('File uploaded and database updated successfully.');
      });
    });
  });
});




// Endpoint to get all rows from done_donations where has_doc = 1
router.get('/donations-with-documents', (req, res) => {
    const query = 'SELECT * FROM done_donations WHERE has_doc = 1';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).send('Database query failed.');
      }
  
      res.json(results);
    });
  });



  module.exports = router;