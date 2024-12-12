import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config(); // Load environment variables from .env

const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'master',
    options: {
        encrypt: false,  // Set true if using Azure
        trustServerCertificate: true,  // Skip self-signed certificate errors
    },
    port: parseInt(process.env.DB_PORT, 10) || 1433,  // Default SQL Server port
    authentication: process.env.DB_USER
        ? {
            type: 'default', // SQL Server Authentication
            options: {
                userName: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            },
        }
        : {
            type: 'ntlm', // Windows Authentication
            options: {
                domain: process.env.DB_DOMAIN || '', // Optional domain for NTLM
            },
        },
};

const poolPromise = sql.connect(config)
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed!', err);
        process.exit(1);
    });
