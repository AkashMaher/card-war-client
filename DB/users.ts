// import { MongoClient } from "mongodb";

// const mongoUrl:any = process.env.NEXT_PUBLIC_MONGODB_URI || ''
// async function connectToDatabase() {
//   const client = await MongoClient.connect(mongoUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   return client;
// }


// export default async function handler(req, res) {
//   const client = await connectToDatabase();

//   const db = client.db("mydatabase");
//   const collection = db.collection("mycollection");

//   const data = await collection.find().toArray();

//   res.json(data);
// }
