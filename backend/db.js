import mongoose from 'mongoose';

const connectToMongo = () =>{
    mongoose.set('strictQuery', true);
    mongoose.connect("mongodb://127.0.0.1:27017/YouTube").then(()=>{
        console.log("Connected to MongoDB")
    }).catch((err)=>{
        throw err;
    })
}

export default connectToMongo;