import { createClient } from "redis";

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on("error", (error) => {
      console.error(error);
    });

    this._client.connect().catch((error) => {
      console.error(error);
    });
  }

  async set(key, value, expirationInSecond = 3600) {
    try {
      await this._client.set(key, value, {
        EX: expirationInSecond,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error("Cache tidak ditemukan");

    return result;
  }

  async delete(key) {
    try {
      await this._client.del(key);
    } catch (error) {
      console.error(error);
    }
  }
}

export default CacheService;
