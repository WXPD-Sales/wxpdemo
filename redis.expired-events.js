//import PubSub from "./pubsub";

const PubSub = require('./pubsub');

const RedisExpiredEvents = function(){
  PubSub.subscribe("__keyevent@0__:expired");
  PubSub.on("message", async (channel, message) => {
    // Handle event
  });
}

module.exports = RedisExpiredEvents;