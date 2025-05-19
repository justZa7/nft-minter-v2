import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

const JWT = process.env.PINATA_JWT;

export async function POST(req) {
  try {
    const form = await req.formData();

    const file = form.get("file");
    const name = form.get("name");
    const description = form.get("description");

    if (!file || !name || !description) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Convert file to stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const formData = new FormData();
    formData.append("file", buffer, file.name);

    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: name,
      })
    );

    formData.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: 0,
      })
    );

    formData.append(
      "pinataContent",
      JSON.stringify({
        name: name,
        description: description,
        image: "ipfs://" 
      })
    );

    const uploadRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      headers: {
        Authorization: `Bearer ${JWT}`,
        ...formData.getHeaders(),
      },
    });

    const imageCID = uploadRes.data.IpfsHash;

    const metadata = {
      name,
      description,
      image: `ipfs://${imageCID}`,
    };

    const metadataRes = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({
      uri: `ipfs://${metadataRes.data.IpfsHash}`,
    });
  } catch (error) {
    console.error("Upload Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to upload to Pinata" }, { status: 500 });
  }
}
