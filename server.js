
const express = require('express');
const app = express();
const port = 3000;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const axios = require('axios');//Quiz 09
const url = require('url');//Quiz 09
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware'); //Quiz 09
const options = {
    swaggerDefinition: {
        openapi:'3.0.0',
        info: {
            title:  'Personal System Integration API for Assignment 08',
            version: '1.0.0',
            description: 'API generated using REST + SWAGGER'
        },
        host: 'localhost:3000',
        basePath: '/'
    },
    apis: ['./server.js']
}

const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

app.use(awsServerlessExpressMiddleware.eventContext());//Quiz 09

var bodyParser = require("body-parser");

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    "host": "0.0.0.0",
    "user": "root",
    "password": "root",
    "database": "sample",
    "port": 3306,
    "connectionLimit": 5
});

pool.getConnection((err, connection) => {
    if(err){
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connection');
        }
        if (err.code === 'ECONNREFUSED'){
            console.error('Database connection was refused');
        }
    }
    if(connection) connection.release();

    return;
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const {body, param, validationResult} = require('express-validator');
//Quiz 09 code
app.get('/say', function(req, res) {
    //Define base url
    let queryObject = url.parse(req.url, true).search;
    let apiUrl = "";
    if(queryObject!=null){
        apiUrl='https://t9qcqaqs37.execute-api.us-east-1.amazonaws.com/test/say' + queryObject; }
    else
        apiUrl='https://t9qcqaqs37.execute-api.us-east-1.amazonaws.com/test/say';
   //call api and return response
   axios.get(apiUrl)
 
   .then(response => {
       console.log("test" +response.data);
      res.json(response.data)
    })
    .catch(err => res.json({ error: err }))
 })
 


app.get('/', (request, response) => {
    response.status(200).send("This is not why you're here. Head to /user/:id and replace :id with your user id")
})

/**
 * @swagger
 * /agents:
 *     get:
 *       description: Return all the agents
 *       produces:
 *           - application/json
 *       responses:
 *          '200':
 *               description: Successfully fetched all the agents
 */

app.get('/agents', async function(req, res){
    try{
        const sqlQuery = "select * from agents";
        const rows = await pool.query(sqlQuery);
        return res.status(200).json(rows);
    } catch(error)
    {
        return res.status(400).send(error.message);
    }
    return res.status(200).json(rows);
});











/**
 * @swagger
 * /company:
 *     get:
 *       description: Return all the companies
 *       produces:
 *           - application/json
 *       responses:
 *          '200':
 *               description: Successfully fetched all companies
 */

 app.get('/company', async function(req, res){
    try{
        const sqlQuery = "select * from company";
        const rows = await pool.query(sqlQuery);
        return res.status(200).json(rows);
    } catch(error)
    {
        return res.status(400).send(error.message);
    }
    return res.status(200).json(rows);
});

/**
 * @swagger
 * /student:
 *     get:
 *       description: Return all the students
 *       produces:
 *           - application/json
 *       responses:
 *          '200':
 *               description: Successfully return all students
 */
app.get('/student', async function(req, res){
    try{
        const sqlQuery = "select * from student";
        const rows = await pool.query(sqlQuery);
        return res.status(200).json(rows);
    } catch(error)
    {
        return res.status(400).send(error.message);
    }
    return res.status(200).json(rows);
});

/**
 * @swagger
 * /company:
 *   post:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#definitions/company'
 *     responses:
 *       200:
 *         description: The company was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/company'
 *       500:
 *         description: Some server error
 *       400:
 *         description: Please provide correct inputs
 * definitions:
 *  company:
 *    type: object
 *    properties:
 *      company_id:
 *        type: string
 *        pattern: ^(?!\s*$).+
 *      company_name:
 *        type: string
 *        pattern: ^(?!\s*$).+
 *      company_city:
 *        type: string
 *        pattern: ^(?!\s*$).+
 *
 *
 *
 */

 app.post("/company",[body('company_id').trim().not().isEmpty().escape(),
                        body('company_name').trim().not().isEmpty().escape(),
                        body('company_city').trim().not().isEmpty().escape()],async function(req, res){

res.header('Content-type', 'application/json');
const errors = validationResult(req);
console.log(errors.isEmpty());
 if(!errors.isEmpty()){
  return res.status(400).json({
         'error':errors.array()

  })
}
    try {
        const {company_id,company_name, company_city}=req.body;
        const compData= await pool.query("insert into company(company_id, company_name, company_city) values(?, ?, ?)",
                    [req.body.company_id, req.body.company_name,req.body.company_city]);
        return res.status(200).json(compData);
    } catch (error) {
        return res.status(500).json(error);
    }

});

/**
 * @swagger
 * /company:
 *    put:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#definitions/company'
 *     responses:
 *       200:
 *         description: The company was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/company'
 *       500:
 *         description: Some server error
 *       400:
 *         description: Please provide valid inputs
 *
 * definitions:
 *  company:
 *    type: object
 *    properties:
 *      company_id:
 *        type: string
 *      company_name:
 *        type: string
 *      company_city:
 *        type: string
 *
 *
 *
 */

app.put("/company",[body('company_id').trim().not().isEmpty().escape(),
 body('company_name').trim().not().isEmpty().escape(),
 body('company_city').trim().not().isEmpty().escape()], async function(req, res){
 res.header('Content-type','application/json');
 const errors = validationResult(req);
 console.log(errors.isEmpty());
  if(!errors.isEmpty()){
        return res.status(400).json({
             'error': errors.array()
    })
  }
    try {
        const {id}=req.params;
        const {company_id,company_name, company_city}=req.body;
        const compData=await pool.query("update company set company_name=?, company_city=? where company_id= ?",
        [req.body.company_name,req.body.company_city, req.body.company_id]);
        if(compData.affectedRows == 0)
        {
            res.status(400).json({
                'error':'Invalid Input'
            });
        }else{
        res.status(200).json(compData);}

    } catch (error) {
        res.status(500).json(error);
    }
})


 /**
 * @swagger
 * /company/{id}:
 *    delete:
 *       description: Delete a company by ID
 *       parameters:
 *         - in : path
 *           name: id
 *           description: company id
 *           schema:
 *             type: string
 *           required: true
 *       produces:
 *           - application/json
 *       responses:
 *          '200':
 *               description: Successfully deleted
 *          '400':
 *               description: Please provide valid input
 *          '500':
 *               description: Some server error
 */
 app.delete('/company/:id',[param('id').trim().not().isEmpty().escape()], async function (req, res) {
    res.header('Content-type', 'application/json');
    try{
        console.log(req.body);
        const delData = await pool.query('delete from company where COMPANY_ID=?', [req.params.id]);
        if(delData.affectedRows == 0)
        {
            res.status(400).json({
                'error':'Invalid Input'
            });
        }else{
        res.status(200).json(delData);}
        } catch (error) {
            return res.status(500).json(error);
        }

});



/**
 * @swagger
 * /company:
 *    patch:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#definitions/company1'
 *     responses:
 *       200:
 *         description: The company was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/company1'
 *       500:
 *         description: Some server error
 *       400:
 *         description: Please provide valid input
 *
 * definitions:
 *  company1:
 *    type: object
 *    properties:
 *      company_id:
 *        type: string
 *      company_city:
 *        type: string
 *
 *
 *
 */

 app.patch("/company",[body('company_id').trim().not().isEmpty().escape(),
 body('company_city').trim().not().isEmpty().escape()], async function(req, res){
    res.header('Content-type', 'application/json');
     const errors = validationResult(req)
     console.log(errors.isEmpty());
     if(!errors.isEmpty()){
         return res.status(400).json({
             'error':errors.array()
         })
     }
    try {
        const {id}=req.params;
        const {company_id,company_city}=req.body;
        const compData=await pool.query("update company set company_city=? where company_id= ?",
        [req.body.company_city, req.body.company_id]);
        if(compData.affectedRows == 0)
        {
            res.status(400).json({
                'error':'Invalid Input'
            });
        }else{
        res.status(200).json(compData);}
    } catch (error) {
        res.status(500).json(error);
    }
})




app.listen(port, () => {
    console.log('Server is running in port', port);
});




