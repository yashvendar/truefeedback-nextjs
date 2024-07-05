import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}
const connection: ConnectionObject ={};

export async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log('Already connected to db');
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '',{});

        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log(`DB connection failed`,error);
        process.exit(1);
    }
}