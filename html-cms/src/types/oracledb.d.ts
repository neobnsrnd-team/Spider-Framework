declare module 'oracledb' {
    export interface Result<T = unknown> {
        rows?: T[];
        rowsAffected?: number;
        metaData?: Array<{ name: string }>;
    }

    export interface Connection {
        execute<T = unknown>(sql: string, binds?: unknown, options?: unknown): Promise<Result<T>>;
        commit(): Promise<void>;
        rollback(): Promise<void>;
        close(): Promise<void>;
    }

    export interface Pool {
        close(drainTime?: number): Promise<void>;
    }

    export interface CreatePoolOptions {
        user?: string;
        password?: string;
        connectString?: string;
        poolMin?: number;
        poolMax?: number;
        poolIncrement?: number;
        poolTimeout?: number;
        queueTimeout?: number;
    }

    namespace oracledb {
        const CLOB: number;
        const BLOB: number;
        const OUT_FORMAT_OBJECT: number;
        let fetchAsString: number[];
        let fetchAsBuffer: number[];

        function initOracleClient(options?: unknown): void;
        function createPool(options: CreatePoolOptions): Promise<Pool>;
        function getPool(alias?: string): Pool;
        function getConnection(alias?: string): Promise<Connection>;

        type Connection = import('oracledb').Connection;
    }

    export default oracledb;
}
