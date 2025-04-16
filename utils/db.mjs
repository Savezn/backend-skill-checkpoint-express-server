// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:postgres@localhost:5432/quora-mock",
});

// "postgresql://postgres:password@localhost:5432/name-of-database"

export default connectionPool;
