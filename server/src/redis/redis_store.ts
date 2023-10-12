import redisClient from "./redis_client";
import RedisStore from "connect-redis";

redisClient.connect().catch(console.error)
const redisStore = new RedisStore({client: redisClient})
export default redisStore