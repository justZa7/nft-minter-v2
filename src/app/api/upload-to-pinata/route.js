import { NextResponse } from "next/server";

export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get("file");

    if(!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const JWT = process.env.PINATA_JWT;

    const pinataForm = new FormData();
    pinataForm.append("file", file);
    pinataForm.append("pinataMetadata", JSON.stringify({ name: file.name || "nft-image" }));
    pinataForm.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${JWT}`,
        },
        body: pinataForm,
    });

    if (!res.ok) {
        const err = await res.json();
        return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ cid: data.IpfsHash });
}