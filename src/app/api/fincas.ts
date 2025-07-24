//api/fincas.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getAllFincas } from "../lib/fincas";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const fincas = await getAllFincas();
    res.status(200).json(fincas);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fincas", error });
  }
}
