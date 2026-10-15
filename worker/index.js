/**
 * just for exp/practive writing this on procedural langauge 
 */
const redis = require('redis');

const redisHost = process.env.REDIS_HOST | "localhost" ;
const redisPort = process.env.REDIS_PORT | '6379';

/**
 * 
 * @param {number} number 
 */
function fibonacci(number){
    if (number <= 2) return 1
    
    return fibonacci(number -2) + fibonacci(number -1); 
}

/**
 * 
 * @param {redis.RedisClientType} redis_conn 
 * @param {number} number 
 * @param {number} value 
 */
function setFibCalculated(redis_conn,number,value){
    redis_conn.hSet('fibs',{[number]:value});
}
/**
 * 
 * @param {redis.RedisClient} redis_conn 
 */
function listenForMessages(redis_conn) {
    redis_conn.subscribe('calculate', (arg) => {
    console.log(arg,'print');
      const val = fibonacci(arg)
      setFibCalculated(redis_conn,arg,val);
    })
}

async function bootStrap(){
    try{
        const redis_conn = redis.createClient(redisPort,redisHost);
        await redis_conn.connect()
        console.table({message: 'connected'});
        listenForMessages(redis_conn);
    }
    catch(err){
        console.error(err);
    }
}

bootStrap();

// redis_Con -> listenForMessages -> setFibCalculated


///


