const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
});


pool.connect();

const login = (req, res) => {
    const queryStr = `select * from users where username = '${req.body.username}'`

    pool.query(queryStr, (err, dbRes) => {
        if (err) {
            console.error(err.stack);
            res.status(500).json({ error: 'A server error occurred while logging in.' });
        } else {
            if (dbRes.rows[0].hash === req.body.password)
            {
                res.status(201).json(dbRes.rows[0]);
            }
        }
    });
}

const addUser = (req, res) => {
    const text = 'insert into users(username, email, hash, isadmin, firstname, lastname, telephone, address, createdate) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *';

    const values = [
        req.body.username, req.body.email, req.body.password, false, req.body.fname, req.body.lname, req.body.phone, req.body.address, new Date()
    ]
    pool.query(text, values, (err, dbRes) => {
        if (err) {
            console.error(err.stack);
            res.status(500).json({ error: 'An error occurred while adding the user.' });
        } else {
            console.log(dbRes.rows[0]);
            res.status(201).json(dbRes.rows[0]);
        }
    });
}

const updateUser = (req, res) => {
    let username = req.body.username;
    let firstname = req.body.firstName;
    pool.query('update user set first_name = $1 where username = $2 returning *',
        [firstname, username],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        })
}

const getCourse = (req, res) => {
    console.log(`db getCourse`);
    pool.query('select courseid from course', (err, results) => {
        if (err) {
            throw error;
        }
        res.status(200).json(results.rows)
    })
}

const displayCourses = (req, res) => {
    console.log('display courses');
    pool.query('select * from course', (err, results) => {
        if (err) {
            throw error;
        }
        res.status(200).json(results.rows)
    })
}

module.exports = {login, addUser, getCourse, displayCourses, updateUser}