import dotenv from 'dotenv'
import postgres from 'postgres'
dotenv.config()

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

async function validateConnection() {
    try {
        await sql`SELECT NOW() AS current_time`
        console.log('Conexión exitosa a la base de datos.')
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message)
    }
}


export  default sql