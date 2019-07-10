import Redis from "ioredis";

//connect to RedisLabs
const subscriber = new Redis(process.env.REDIS_CONN,{connectionName:`vaporware-sub`}); //connection to publish events & write data
const publisher = new Redis(process.env.REDIS_CONN,{connectionName:`vaporware-pub`}); // connection to subcribe to events

export default class RedisRepo {
  constructor() {
    this.redis = new Redis();
    this.redis.on("ready", () => {
      this.redis.config("SET", "notify-keyspace-events", "Ex");
    });
  }
}