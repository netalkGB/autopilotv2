type Rdb = {
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
}

type Redis = {
    host: string,
    port: number,
    username: string,
    password: string,
}

export class DatabaseConfig {
    static rdb: Rdb
    static redis: Redis
}
