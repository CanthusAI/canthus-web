import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import pngToIco from "png-to-ico";

async function main() {
    const publicDir = join(process.cwd(), "public", "images");
    const inputSvg = join(publicDir, "fish.svg");
    const outputs = [
        { file: "fish-16.png", size: 16 },
        { file: "fish-32.png", size: 32 },
        { file: "fish-48.png", size: 48 },
        { file: "fish-180.png", size: 180 },
        { file: "fish-192.png", size: 192 },
        { file: "fish-512.png", size: 512 },
    ];

    await mkdir(publicDir, { recursive: true });

    for (const o of outputs) {
        const outPath = join(publicDir, o.file);
        await sharp(inputSvg)
            .resize(o.size, o.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png({ compressionLevel: 9 })
            .toFile(outPath);
        console.log(`Wrote ${outPath}`);
    }

    // Generate favicon.ico (multi-size)
    const icoBuffer = await pngToIco([
        join(publicDir, "fish-16.png"),
        join(publicDir, "fish-32.png"),
        join(publicDir, "fish-48.png"),
    ]);
    const icoPath = join(process.cwd(), "public", "favicon.ico");
    await writeFile(icoPath, icoBuffer);
    console.log(`Wrote ${icoPath}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});


