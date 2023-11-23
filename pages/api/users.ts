import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../services/mongodbServices";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const db = await connectToDatabase();
  const collection = await db.collection("users")
  if (req.method === "POST") {
    // Create user endpoint
    const { user_name, wallet_address, image } = req.body;

    const body: Record<string, string> = {};
    if (user_name) body["user_name"] = user_name
    if (image) body["image"] = image

    
      const users = await collection.findOne({ wallet_address: wallet_address });
    if (!users) {
        body["wallet_address"] = wallet_address
        await collection.insertOne({ user_name, wallet_address, image });
    } else {
        await collection.updateOne(
          { wallet_address: wallet_address },
          { $set: body }
        );
    }
    res.status(201).json({ message: "User created successfully" });
  } else if (req.method === "GET") {
    // Get users endpoint
    const { userAddress } = req.query;
    if (!userAddress)
      return res
        .status(403)
        .json({ success: false, error: "address not found" });

    const users = await await collection.findOne({wallet_address: userAddress})
    if (!users) {
      return res.status(403).json({success:false, error: "User not found" });
    }
    res.status(200).json({success:true, data: users});
  } else {
    res.status(405).json({success:false, error: "Method not allowed" });
  }
}
