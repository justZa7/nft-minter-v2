export async function uploadToPinata(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-to-pinata", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    const data = await res.json();
    return `ipfs://${data.cid}`;
}
