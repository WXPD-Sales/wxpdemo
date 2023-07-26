const Redis = require('ioredis');

class RedisRepo {
  constructor() {
    if(process.env.REDIS_CONN){
      this.redis = new Redis(process.env.REDIS_CONN,{connectionName:`vaporware-repo`});
      this.redis.on("ready", () => {
        this.redis.config("SET", "notify-keyspace-events", "Ex");
      });
    }
  }

  async get(key) {
    return this.redis.get(key);
  }

  async setReminder(key, value, expire) {
    this.redis
      .multi()
      .set(key, value)
      .set(`reminder:${key}`, 1)
      .expire(`reminder:${key}`, expire)
      .exec();
  }

  async set(key, value, expire) {
    this.redis
      .multi()
      .set(key, value)
      .expire(key, expire)
      .exec();
  }
  
  async setURL(key, value, expire) {
    this.redis
      .multi()
      .set(key, value)
      .set(`URL:${key}`, 1)
      .expire(`URL:${key}`, expire)
      .exec();
  }

}

module.exports = RedisRepo;
