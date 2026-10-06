const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(len + 12);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, "ascii");
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, len + 8);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, len + 8);
  return buf;
}

function createPng(width, height, r, g, b, accentR, accentG, accentB) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(2, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdr = createChunk("IHDR", ihdrData);

  const raw = Buffer.alloc(height * (width * 3 + 1));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    raw[offset++] = 0;
    const factorY = y / height;
    for (let x = 0; x < width; x++) {
      const factorX = x / width;
      const isBorder = x < 12 || x > width - 13 || y < 12 || y > height - 13;
      const isInner =
        x > 25 &&
        x < width - 26 &&
        y > 25 &&
        y < height - 26 &&
        (x < 28 || x > width - 29 || y < 28 || y > height - 29);
      const isGrid = x % 40 === 0 || y % 40 === 0;

      if (isBorder || isInner) {
        raw[offset++] = accentR;
        raw[offset++] = accentG;
        raw[offset++] = accentB;
      } else if (isGrid) {
        raw[offset++] = Math.min(
          255,
          Math.round(r * (1 - factorY) + accentR * 0.25),
        );
        raw[offset++] = Math.min(
          255,
          Math.round(g * (1 - factorY) + accentG * 0.25),
        );
        raw[offset++] = Math.min(
          255,
          Math.round(b * (1 - factorY) + accentB * 0.25),
        );
      } else {
        raw[offset++] = Math.round(
          r * (0.6 + 0.4 * factorX) * (1 - factorY * 0.3),
        );
        raw[offset++] = Math.round(
          g * (0.6 + 0.4 * factorX) * (1 - factorY * 0.3),
        );
        raw[offset++] = Math.round(
          b * (0.6 + 0.4 * factorX) * (1 - factorY * 0.3),
        );
      }
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idat = createChunk("IDAT", compressed);
  const iend = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const targetDir = path.join(__dirname, "../client/public/img");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const imagesToCreate = [
  {
    name: "anh_acc1.png",
    w: 800,
    h: 500,
    r: 18,
    g: 25,
    b: 45,
    ar: 255,
    ag: 180,
    ab: 0,
  },
  {
    name: "anh_acc1_phu.png",
    w: 800,
    h: 500,
    r: 25,
    g: 15,
    b: 40,
    ar: 0,
    ag: 245,
    ab: 255,
  },
  {
    name: "anh_acc2.png",
    w: 800,
    h: 500,
    r: 28,
    g: 12,
    b: 45,
    ar: 180,
    ag: 50,
    ab: 255,
  },
  {
    name: "anh_acc2_phu.png",
    w: 800,
    h: 500,
    r: 15,
    g: 20,
    b: 35,
    ar: 255,
    ag: 50,
    ab: 150,
  },
  {
    name: "anh_acc3.png",
    w: 800,
    h: 500,
    r: 10,
    g: 25,
    b: 45,
    ar: 0,
    ag: 245,
    ab: 255,
  },
  {
    name: "anh_acc3_phu.png",
    w: 800,
    h: 500,
    r: 12,
    g: 18,
    b: 35,
    ar: 255,
    ag: 180,
    ab: 0,
  },
  {
    name: "anh_acc4.png",
    w: 800,
    h: 500,
    r: 35,
    g: 15,
    b: 20,
    ar: 255,
    ag: 180,
    ab: 0,
  },
  {
    name: "anh_acc4_phu.png",
    w: 800,
    h: 500,
    r: 25,
    g: 10,
    b: 30,
    ar: 255,
    ag: 50,
    ab: 150,
  },
  {
    name: "anh_acc5.png",
    w: 800,
    h: 500,
    r: 35,
    g: 12,
    b: 25,
    ar: 0,
    ag: 245,
    ab: 255,
  },
  {
    name: "anh_acc5_phu.png",
    w: 800,
    h: 500,
    r: 15,
    g: 20,
    b: 38,
    ar: 255,
    ag: 50,
    ab: 150,
  },
  {
    name: "anh_acc6.png",
    w: 800,
    h: 500,
    r: 30,
    g: 10,
    b: 40,
    ar: 180,
    ag: 50,
    ab: 255,
  },
  {
    name: "anh_acc6_phu.png",
    w: 800,
    h: 500,
    r: 35,
    g: 15,
    b: 20,
    ar: 255,
    ag: 180,
    ab: 0,
  },
  {
    name: "anh_acc7.png",
    w: 800,
    h: 500,
    r: 12,
    g: 25,
    b: 50,
    ar: 0,
    ag: 245,
    ab: 255,
  },
  {
    name: "anh_acc7_phu.png",
    w: 800,
    h: 500,
    r: 25,
    g: 15,
    b: 45,
    ar: 180,
    ag: 50,
    ab: 255,
  },
  {
    name: "anh_acc8.png",
    w: 800,
    h: 500,
    r: 40,
    g: 15,
    b: 15,
    ar: 255,
    ag: 180,
    ab: 0,
  },
  {
    name: "anh_acc8_phu.png",
    w: 800,
    h: 500,
    r: 15,
    g: 20,
    b: 35,
    ar: 255,
    ag: 50,
    ab: 150,
  },
  {
    name: "anh_acc9.png",
    w: 800,
    h: 500,
    r: 10,
    g: 35,
    b: 25,
    ar: 0,
    ag: 255,
    ab: 130,
  },
  {
    name: "anh_acc9_phu.png",
    w: 800,
    h: 500,
    r: 15,
    g: 30,
    b: 25,
    ar: 255,
    ag: 180,
    ab: 0,
  },
  {
    name: "anh_acc10.png",
    w: 800,
    h: 500,
    r: 15,
    g: 22,
    b: 45,
    ar: 0,
    ag: 245,
    ab: 255,
  },
  {
    name: "anh_acc10_phu.png",
    w: 800,
    h: 500,
    r: 25,
    g: 15,
    b: 40,
    ar: 255,
    ag: 180,
    ab: 0,
  },
  {
    name: "anh_hero.png",
    w: 800,
    h: 500,
    r: 30,
    g: 15,
    b: 35,
    ar: 0,
    ag: 245,
    ab: 255,
  },
  {
    name: "anh_acc_default.png",
    w: 800,
    h: 500,
    r: 15,
    g: 20,
    b: 35,
    ar: 0,
    ag: 245,
    ab: 255,
  },
  {
    name: "the_garena.png",
    w: 400,
    h: 400,
    r: 180,
    g: 25,
    b: 35,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "the_zing.png",
    w: 400,
    h: 400,
    r: 20,
    g: 100,
    b: 200,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "the_gate.png",
    w: 400,
    h: 400,
    r: 220,
    g: 100,
    b: 20,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "the_vcoin.png",
    w: 400,
    h: 400,
    r: 120,
    g: 30,
    b: 180,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "the_viettel.png",
    w: 400,
    h: 400,
    r: 200,
    g: 30,
    b: 30,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "the_vinaphone.png",
    w: 400,
    h: 400,
    r: 10,
    g: 120,
    b: 220,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "the_mobifone.png",
    w: 400,
    h: 400,
    r: 20,
    g: 70,
    b: 180,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "avatar_user.png",
    w: 200,
    h: 200,
    r: 0,
    g: 150,
    b: 220,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "avatar_admin.png",
    w: 200,
    h: 200,
    r: 160,
    g: 30,
    b: 180,
    ar: 255,
    ag: 255,
    ab: 255,
  },
  {
    name: "avatar_default.png",
    w: 200,
    h: 200,
    r: 35,
    g: 45,
    b: 65,
    ar: 0,
    ag: 245,
    ab: 255,
  },
  {
    name: "logo.png",
    w: 200,
    h: 200,
    r: 0,
    g: 200,
    b: 220,
    ar: 255,
    ag: 50,
    ab: 150,
  },
];

imagesToCreate.forEach((item) => {
  const pngBuffer = createPng(
    item.w,
    item.h,
    item.r,
    item.g,
    item.b,
    item.ar,
    item.ag,
    item.ab,
  );
  const filePath = path.join(targetDir, item.name);
  fs.writeFileSync(filePath, pngBuffer);
});

for (let i = 1; i <= 10; i++) {
  const standardName = path.join(targetDir, `anh_acc${i}.png`);
  const vietName = path.join(targetDir, `ảnh_acc${i}.png`);
  if (fs.existsSync(standardName)) {
    fs.copyFileSync(standardName, vietName);
  }
}

console.log("All image files generated successfully in", targetDir);
