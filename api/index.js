const redis = require('redis');
const express = require('express');
const pg = require('pg');
const cors = require('cors');


const redisHost = process.env.REDIS_HOST | "localhost" ;
const redisPort = process.env.REDIS_PORT | '6379';

const redisConn = redis.createClient(redisPort,redisHost);

/**
 * @type {pg.Client | null}
 */
let pgCon = null;


const app = express();

const port = 3000

app.use(express.json())
app.use(cors());


app.post('/fibo',async (req,res) => {
    console.log(req.body,'body');
    const number = req.body.number;
    redisConn.publish('calculate',String(number));
    await pgCon.query(`insert into fibs(number) values($1::integer)`,[number]);
    res.status(200).json({
        message : "done",
    })
});

app.get('/fibo',async (req,res)=> {
    const fibs = await pgCon.query('select * from fibs;');
    console.log(fibs);
    res.status(200).json({
        message : "success",
        rows : fibs.rows
    })
})

app.get('/fiboCache', async (req, res) => {
    const allKeys = await redisConn.hGetAll('fibs');
    res.status(200).json({
        message: "success",
        rows: allKeys,
    })
})

/**
 * 
 * @param {pg.Client} pgCon 
 */
async function migrationCheck(pgCon) {
    const tableExist = await pgCon.query(`
        CREATE TABLE IF NOT EXISTS fibs (
            id SERIAL PRIMARY KEY,
            number Integer
        );
    `);
}

async function bootStrap(){
    await redisConn.connect();

    pgCon = await (new pg.Client({
        user: 'postgres',
        password: 'dev',
        host:'localhost',
        port:5432
    })).connect()

    await migrationCheck(pgCon);

    console.log('connected to db');
    app.listen(port,(err) => {
        if(err) console.error(err);
        else console.log(`Started listening on ${port}`);
    });
}


bootStrap();