import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../services/mongodbServices";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const db = await connectToDatabase();
  const collection = await db.collection("games");
  if (req.method === "POST") {
    const { address, room_Id, winning_address, end_time, host } = req.body;
    if (!room_Id || room_Id == "")
      return res.status(500).json({ error: "room id not found" });
    let data = await collection.findOne({ room_Id: room_Id });

    if (!data) {
      await collection.insertOne({
        room_Id,
        host,
        addresses: { player1: address },
        start_time: Date.now() / 1000,
      });
      data = await collection.findOne({ room_Id: room_Id });
    } else {
      if (winning_address && !data?.winning_address && data?.addresses?.player1 && data?.addresses?.player2) {
        if (data?.winning_address)
          return res
            .status(403)
            .json({ state: false, message: "game already ended" });
        if (
          data?.addresses?.player1 !== winning_address &&
          data?.addresses?.player2 !== winning_address
        )
          return res
            .status(403)
            .json({ state: false, message: "invalid winning address" });
        await collection.findOneAndUpdate(
          { room_Id: room_Id },
          {
            $set: {
              winning_address: winning_address,
              end_time: Date.now() / 1000,
            },
          }
        );
      } else if (data?.addresses?.player2 && data?.addresses?.player1) {
      } else if (
        data?.addresses?.player1 &&
        data?.addresses?.player1 !== address
      ) {
        await collection.findOneAndUpdate(
          { room_Id: room_Id },
          { $set: { "addresses.player2": address } }
        );
      } else
        return res.status(403).json({ state: false, message: "same user" });
    }
    data = await collection.findOne({ room_Id: room_Id });
    return res.status(200).json(data);
  } else if (req.method === "GET") {
    const { id } = req.query;
    let data = await collection.findOne({ room_Id: id });
    if (!data) {
      return res.status(403).json({
        message: false,
      });
    }
    return res.status(200).json({
      message: true,
      data: data,
    });
  } else {
    res.status(500).json({ state: false, error: "Something went wrong" });
  }
}
