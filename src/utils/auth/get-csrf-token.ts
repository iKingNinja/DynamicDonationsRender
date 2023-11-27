export default async () => {
    const res = await fetch("https://auth.roblox.com", {
        method: "POST",
        headers: {
            Cookie: `.ROBLOSECURITY=${process.env.ROBLOSECURITY}`
        }
    })

    return res.headers.get("x-csrf-token");
}