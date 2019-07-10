//import Redis from "ioredis";

const Redis = require('ioredis');

//connect to RedisLabs
const subscriber = new Redis(process.env.REDIS_CONN,{connectionName:`vaporware-sub`}); //connection to publish events & write data
const publisher = new Redis(process.env.REDIS_CONN,{connectionName:`vaporware-pub`}); // connection to subcribe to events

class PubSub {
  publish(channel, message) {
    publisher.publish(channel, message);
  }
  subscribe(channel) {
    subscriber.subscribe(channel);
  }
  on(event, callback) {
    subscriber.on(event, (channel, message) => {
      callback(channel, message);
    });
  }
};

module.exports = { PubSub: PubSub};