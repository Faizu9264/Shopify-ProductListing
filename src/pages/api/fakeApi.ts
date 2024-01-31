// pages/api/fakeApi.ts
import { NextApiRequest, NextApiResponse } from "next";
import Products from "@/data/dummyData"

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(Products);
};
