//import PubSub from "./pubsub";

const PubSub = require('./pubsub');
const RedisRepo = require('./redis-repo');
const redisRepo = new RedisRepo();

//const RedisExpiredEvents = function(){
module.exports = function (){
  PubSub.subscribe("__keyevent@0__:expired");
  PubSub.on("message", async (channel, message) => {
    // Handle event
    console.log(`Received message ${message} on ${channel}`);
    const [type, key] = message.split(":");
    switch (type) {
      case "reminder": {
        const value = await redisRepo.get(key);
        console.log("TYPE: ", type);
        console.log("KEY: ", key);
        console.log("VALUE: ", value);
        break;
        }
    }
  });
};

//module.exports.RedisExpiredEvents = RedisExpiredEvents;