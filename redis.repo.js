const Redis = require('ioredis');

//connect to RedisLabs

const RedisRepo =  new class RedisRepo {
  constructor() {
    this.redis = new Redis(process.env.REDIS_CONN,{connectionName:`vaporware-repo`});
    this.redis.on("ready", () => {
      this.redis.config("SET", "notify-keyspace-events", "Ex");
    });
  }
}

module.exports = RedisRepo;