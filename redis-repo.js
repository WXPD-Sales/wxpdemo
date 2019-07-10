const Redis = require('ioredis');

class RedisRepo {
  constructor() {
    this.redis = new Redis(process.env.REDIS_CONN,{connectionName:`vaporware-repo`});
    this.redis.on("ready", () => {
      this.redis.config("SET", "notify-keyspace-events", "Ex");
    });
  }
  
  get(key) {
    return this.redis.get(key);
  }
  
  setReminder(key, value, expire) {
    this.redis
      .multi()
      .set(key, value)
      .set(`reminder:${key}`, 1)
      .expire(`reminder:${key}`, expire)
      .exec();
  }
  
}

module.exports = RedisRepo;