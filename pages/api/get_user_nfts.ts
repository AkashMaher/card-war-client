import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
const OPENSEA_API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY;

const header = {
  accept: "application/json",
  "X-API-KEY": OPENSEA_API_KEY,
};

const dictContract: Record<string, string> = {
  "0x61621722798e4370a0d965a5bd1fdd0f527699b1": "the_cult_dao",
  "0x5b80a9383ea914ad8eed822a5db1bd330baf2f6b": "movinfrens",
  "0x8c3fb10693b228e8b976ff33ce88f97ce2ea9563": "the_plague",
  "0xbe0e87fa5bcb163b614ba1853668ffcd39d18fcb": "the_plague",
  "0xc527ede68f14a4a52c32a1264cc02fb5ea6bb56d": "squishiverse",
};

const contractAddresses: string[] = Object.keys(dictContract);

let urlParams = "";

for (let i = 0; i < contractAddresses.length; i++) {
  urlParams += `&asset_contract_addresses=${contractAddresses[i]}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const userAddress = req.query.userAddress;
    if (!userAddress)
      return res
        .status(403)
        .json({ access: false, error: "address not found" });
    const options = {
      method: "GET",
      url: `https://api.opensea.io/api/v1/assets?owner=${userAddress}${urlParams}`,
      headers: header,
    };

    await axios
      .request(options)
      .then(async function (response) {
        if (response.data.assets.length == 0) {
          return res.status(200).json({ access: false, data: null });
        }
        const nftsByCollection = await parseNftsSeparateForEachCollection(
          response.data.assets
        );
        return res.status(200).json({ access: true, data: nftsByCollection });
      })
      .catch(async function (error) {
        return res
          .status(500)
          .json({ access: false, error: "Something went wrong" });
      });
  } catch (err) {
    return res
      .status(500)
      .json({ access: false, error: "Something went wrong" });
  }
}

async function parseNftsSeparateForEachCollection(nfts: any) {
  let nftsByCollection: any = {};
  for (let i = 0; i < contractAddresses.length; i++) {
    const name = dictContract[contractAddresses[i]];
    if (!nftsByCollection[name]) nftsByCollection[name] = [];
  }

  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];
    const collection = nft.asset_contract.address;
    const nameInDict = dictContract[collection];
    if (nftsByCollection[nameInDict]) {
      nftsByCollection[nameInDict].push(nft);
    } else {
      nftsByCollection[nameInDict] = [nft];
    }
  }
  return nftsByCollection;
}
