const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Account = require("../models/Account");
const Card = require("../models/Card");
const Order = require("../models/Order");
const Deposit = require("../models/Deposit");

const seedData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopgame",
    );
    console.log("MongoDB connected for seeding...");

    await User.deleteMany();
    await Account.deleteMany();
    await Card.deleteMany();
    await Order.deleteMany();
    await Deposit.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedUserPass = await bcrypt.hash("demo123", salt);
    const hashedAdminPass = await bcrypt.hash("admin123", salt);

    const demoUser = await User.create({
      name: "Khách Hàng Vip (Demo)",
      email: "user@demo.com",
      password: hashedUserPass,
      role: "user",
      balance: 5000000,
      avatar: "/img/avatar_user.png",
      vipLevel: 3,
    });

    const demoAdmin = await User.create({
      name: "Quản Trị Viên (Demo)",
      email: "admin@demo.com",
      password: hashedAdminPass,
      role: "admin",
      balance: 99000000,
      avatar: "/img/avatar_admin.png",
      vipLevel: 9,
    });

    console.log("Created Users:", demoUser.email, demoAdmin.email);

    const accountsData = [
      {
        game: "Liên Quân",
        title:
          "Acc Liên Quân Full Tướng 350 Skin, Nakroth Thứ Nguyên Vệ Thần, Raz Muay Thái",
        code: "LQ-9981",
        price: 850000,
        originalPrice: 1500000,
        rank: "Cao Thủ 35 Sao",
        skinCount: 350,
        heroCount: 118,
        loginType: "Garena trắng thông tin",
        images: ["/img/anh_acc1.png", "/img/anh_acc1_phu.png"],
        description:
          "Tài khoản cực phẩm gồm Nakroth Thứ Nguyên Vệ Thần bậc SSS, Raz Muay Thái, Flo Tinh Hệ, Ngộ Không Nhóc Tì. Tỉ lệ thắng 68%. Thông tin trắng sạch 100% đổi pass và mail tức thì.",
        accountDetails: {
          username: "lq_sieuvip_nakroth",
          password: "PasswordLQ@2026",
          note: "Tài khoản sạch, có thể liên kết email cá nhân và số điện thoại mới ngay.",
        },
        badge: "SIÊU PHẨM",
        highlightSkins: [
          "Nakroth Thứ Nguyên",
          "Raz Muay Thái",
          "Florentino Tinh Hệ",
          "Ngộ Không Nhóc Tì",
        ],
      },
      {
        game: "Liên Quân",
        title:
          "Acc Liên Quân Rank Thách Đấu Top 50 Server, 280 Skin Bậc SS Tuyệt Đẹp",
        code: "LQ-5520",
        price: 1200000,
        originalPrice: 2000000,
        rank: "Thách Đấu",
        skinCount: 280,
        heroCount: 118,
        loginType: "Garena trắng thông tin",
        images: ["/img/anh_acc2.png", "/img/anh_acc2_phu.png"],
        description:
          "Acc rank Thách Đấu khung danh giá, Quillen Đặc Công, Tulen Tân Thần Thiên Hà, Murad Siêu Việt bậc 5. Đủ ngọc 30 bảng.",
        accountDetails: {
          username: "lq_thachdau_top50",
          password: "TopServerLQ#8899",
          note: "Khung Thách đấu vĩnh viễn, đổi thông tin tại trang chủ garena.",
        },
        badge: "HOT DEAL",
        highlightSkins: [
          "Tulen Tân Thần",
          "Quillen Đặc Công",
          "Murad Siêu Việt V",
          "Airi Bạch Kiem",
        ],
      },
      {
        game: "PUBG",
        title:
          "Acc PUBG PC M416 Glacier Băng Cấp 7 Max Lửa Băng Kèm Beryl Bách Bọ Xít",
        code: "PUBG-7711",
        price: 1850000,
        originalPrice: 3200000,
        rank: "Master (3800 RP)",
        skinCount: 195,
        heroCount: 1,
        loginType: "Steam Full Mail Gốc",
        images: ["/img/anh_acc3.png", "/img/anh_acc3_phu.png"],
        description:
          "Acc PUBG Steam cực xịn, M416 Băng lv7 hiệu ứng hòm xác rực sáng, Beryl Nâng cấp lv4, Mini14 Tuyết. Giao tài khoản Steam kèm email gốc đầu tiên, bao back vĩnh viễn.",
        accountDetails: {
          username: "steam_pubg_m4glacier",
          password: "GlacierPubg!2026",
          note: "Kèm Email gốc Steam ban đầu, không VAC ban.",
        },
        badge: "VIP BẬC NHẤT",
        highlightSkins: [
          "M416 Glacier Lv7",
          "Beryl M762 Lv4",
          "AWM Rainbow",
          "Set Vàng Son",
        ],
      },
      {
        game: "PUBG",
        title:
          "Acc PUBG Mobile Set X-Suit Pharaon Cấp 6, M416 Nguyệt Vũ Siêu Hiếm",
        code: "PUBGM-3301",
        price: 980000,
        originalPrice: 1600000,
        rank: "Chí Tôn (Ace Master)",
        skinCount: 160,
        heroCount: 1,
        loginType: "Liên kết Twitter/Google sạch",
        images: ["/img/anh_acc4.png", "/img/anh_acc4_phu.png"],
        description:
          "Bộ X-Suit Pharaon lv6 hiệu ứng bay nhảy cực đẹp mắt, M416 Nguyệt Vũ lv4 có hòm xác và thông báo hạ gục đặc biệt.",
        accountDetails: {
          username: "pubgm_pharaon_suit",
          password: "PubgMobileSafe@99",
          note: "Chuyển nhượng tài khoản mạng xã hội liên kết trong 2 phút.",
        },
        badge: "HOT DEAL",
        highlightSkins: [
          "X-Suit Pharaon 6 sao",
          "M416 Nguyệt Vũ",
          "Uzi Thần Thoại",
          "Xe UAZ Bọc Thép",
        ],
      },
      {
        game: "Valorant",
        title:
          "Acc Valorant Radiant Dao Kuronami + Vandal Prime, Phantom Reaver, Vandal RGX 11z",
        code: "VAL-8890",
        price: 1450000,
        originalPrice: 2400000,
        rank: "Radiant",
        skinCount: 48,
        heroCount: 24,
        loginType: "Riot Games đổi Mail tức thì",
        images: ["/img/anh_acc5.png", "/img/anh_acc5_phu.png"],
        description:
          "Tài khoản Valorant rank cao thủ Radiant, đầy đủ kiếm Kuronami, Vandal Prime, RGX Pro Blade, Phantom ChronoVoid, Operator Origin. Điểm Radiant ngút ngàn.",
        accountDetails: {
          username: "riot_val_kuronami",
          password: "ValRadiant2026#",
          note: "Đổi Riot ID và email cá nhân ngay trên tài khoản.",
        },
        badge: "RADIANT VIP",
        highlightSkins: [
          "Dao Kuronami",
          "Vandal Prime",
          "Phantom Reaver",
          "RGX 11z Pro Blade",
        ],
      },
      {
        game: "Valorant",
        title:
          "Acc Valorant Immortal 3 Dao Ignite Fan Cực Hiếm + Set Champions 2023",
        code: "VAL-4412",
        price: 990000,
        originalPrice: 1700000,
        rank: "Immortal 3",
        skinCount: 35,
        heroCount: 24,
        loginType: "Riot Games Server Việt Nam",
        images: ["/img/anh_acc6.png", "/img/anh_acc6_phu.png"],
        description:
          "Sở hữu chiếc Quạt Ignite Fan độc quyền không còn mở bán, trọn bộ Champions 2023 Vandal & Kunai. Rank Immortal 3 ổn định cày cuốc.",
        accountDetails: {
          username: "riot_val_ignitefan",
          password: "ImmortalVal!887",
          note: "Tài khoản máy chủ VNG/SEA, đổi mail không cần xác minh cũ.",
        },
        badge: "GIỚI HẠN",
        highlightSkins: [
          "Quạt Ignite Fan",
          "Champions 2023 Vandal",
          "Champions Kunai",
          "Vandal Gaia",
        ],
      },
      {
        game: "Genshin Impact",
        title:
          "Acc Genshin Impact AR 60, Raiden Shogun C2 Trấn, Furina C6, Neuvillette C1 Trấn",
        code: "GI-6632",
        price: 1650000,
        originalPrice: 2800000,
        rank: "Cấp Mạo Hiểm AR 60",
        skinCount: 42,
        heroCount: 45,
        loginType: "Hoyoverse Trắng Thông Tin",
        images: ["/img/anh_acc7.png", "/img/anh_acc7_phu.png"],
        description:
          "Tài khoản đại gia roll Furina C6 full opt, Lôi Thần Raiden C2 Đoạn Thảo Trường Đao, Thuỷ Thần Neuvillette quét map siêu tốc. La Hoàn 36 sao nhàn nhã mỗi kỳ.",
        accountDetails: {
          username: "genshin_furina_c6",
          password: "HoyoverseGenshin#26",
          note: "Không liên kết mạng xã hội hay PSN, đổi email an toàn 100%.",
        },
        badge: "CỰC PHẨM C6",
        highlightSkins: [
          "Furina C6",
          "Raiden C2 + Trấn",
          "Neuvillette C1 + Trấn",
          "Kazuha Trấn Cổ Kiếm",
        ],
      },
      {
        game: "Free Fire",
        title:
          "Acc Free Fire Quỷ Dạ Xoa, AK Rồng Xanh Lv7 Max, MP40 Mãng Xà Lv7 Max",
        code: "FF-2291",
        price: 750000,
        originalPrice: 1300000,
        rank: "Huyền Thoại 45 Sao",
        skinCount: 220,
        heroCount: 50,
        loginType: "Facebook Độc Quyền",
        images: ["/img/anh_acc8.png", "/img/anh_acc8_phu.png"],
        description:
          "Acc FF cực chất với AK Rồng Xanh lv7 bắn ra đạn rồng, MP40 Mãng Xà lv7, XM8 Lôi Thần lv6. Trang phục Quỷ Dạ Xoa, Quần Đi Biển huyền thoại.",
        accountDetails: {
          username: "ff_rongxanh_maxlv7",
          password: "FreeFireMax@2026",
          note: "Tài khoản kèm số điện thoại bảo mật sẵn sàng chuyển đổi.",
        },
        badge: "GIÁ RẺ",
        highlightSkins: [
          "AK Rồng Xanh Max 7",
          "MP40 Mãng Xà Max 7",
          "Set Quỷ Dạ Xoa",
          "Quần Đi Biển",
        ],
      },
      {
        game: "FC Online",
        title:
          "Acc FC Online Giá Trị Đội Hình 15.000 Tỷ BP, Gullit ICON +5, Ronaldo Béo ICON +5",
        code: "FC-1109",
        price: 1350000,
        originalPrice: 2200000,
        rank: "Siêu Sao 1",
        skinCount: 90,
        heroCount: 36,
        loginType: "Garena trắng thông tin",
        images: ["/img/anh_acc9.png", "/img/anh_acc9_phu.png"],
        description:
          "Đội hình AC Milan / Real Madrid siêu khủng 15 ngàn tỷ BP. Bộ đôi bất tử Ruud Gullit ICON +5 và Ronaldo R9 Béo ICON +5 đè bẹp mọi hàng phòng ngự.",
        accountDetails: {
          username: "fconline_15kt_gullit",
          password: "FCOnlineVip@2026",
          note: "Chưa cài mật khẩu cấp 2 hoặc hỗ trợ reset mật khẩu cấp 2.",
        },
        badge: "ĐỘI HÌNH 15K TỶ",
        highlightSkins: [
          "Ruud Gullit ICON +5",
          "Ronaldo R9 ICON +5",
          "Maldini ICON +5",
          "Zidane LN +7",
        ],
      },
      {
        game: "Tốc Chiến",
        title:
          "Acc LMHT Tốc Chiến Rank Cao Thủ, Yasuo Ma Kiếm, Zed Tử Thần Không Gian",
        code: "TC-5582",
        price: 490000,
        originalPrice: 850000,
        rank: "Cao Thủ",
        skinCount: 95,
        heroCount: 88,
        loginType: "Riot Account",
        images: ["/img/anh_acc10.png", "/img/anh_acc10_phu.png"],
        description:
          "Full tướng hot meta, Yasuo Ma Kiếm múa mượt mà, Zed Tử Thần, Lee Sin Tuyệt Vô Thần, Ahri Chiêu Hồn. Giá siêu sinh viên.",
        accountDetails: {
          username: "wildrift_yasuo_makiem",
          password: "WildRiftSafe#11",
          note: "Chuyển Riot Account về email khách hàng lập tức.",
        },
        badge: "ƯU ĐÃI",
        highlightSkins: [
          "Yasuo Ma Kiếm",
          "Lee Sin Tuyệt Vô Thần",
          "Zed Tử Thần Không Gian",
          "Jinx Pháo Hoa",
        ],
      },
    ];

    await Account.insertMany(accountsData);
    console.log(`Seeded ${accountsData.length} Game Accounts.`);

    const standardDenominations = [
      { value: 10000, stock: 100 },
      { value: 20000, stock: 100 },
      { value: 50000, stock: 100 },
      { value: 100000, stock: 100 },
      { value: 200000, stock: 100 },
      { value: 500000, stock: 100 },
    ];

    const cardsData = [
      {
        type: "game",
        brand: "Garena",
        name: "Thẻ Garena (Sò)",
        logo: "/img/the_garena.png",
        discountRate: 6,
        denominations: standardDenominations,
        description:
          "Nạp Quân Huy Liên Quân Mobile, FC Online, Free Fire nhanh chóng và an toàn.",
      },
      {
        type: "game",
        brand: "Zing",
        name: "Thẻ Zing (Zing Xu)",
        logo: "/img/the_zing.png",
        discountRate: 5.5,
        denominations: standardDenominations,
        description:
          "Nạp game VNG: Võ Lâm Truyền Kỳ, Kiếm Thế, PUBG Mobile VNG, Tốc Chiến...",
      },
      {
        type: "game",
        brand: "Gate",
        name: "Thẻ Gate (FPT)",
        logo: "/img/the_gate.png",
        discountRate: 7,
        denominations: standardDenominations,
        description:
          "Nạp game phát hành bởi FPT và nhiều tựa game online đồ hoạ đỉnh cao.",
      },
      {
        type: "game",
        brand: "Vcoin",
        name: "Thẻ Vcoin (VTC)",
        logo: "/img/the_vcoin.png",
        discountRate: 6.5,
        denominations: standardDenominations,
        description:
          "Nạp Đột Kích (Crossfire), Audition, Phục Kích và hệ sinh thái VTC Game.",
      },
      {
        type: "phone",
        brand: "Viettel",
        name: "Thẻ Viettel",
        logo: "/img/the_viettel.png",
        discountRate: 4.5,
        denominations: standardDenominations,
        description:
          "Nạp tiền điện thoại mạng Viettel tốc độ cao, hỗ trợ cả trả trước và trả sau.",
      },
      {
        type: "phone",
        brand: "Vinaphone",
        name: "Thẻ Vinaphone",
        logo: "/img/the_vinaphone.png",
        discountRate: 5,
        denominations: standardDenominations,
        description:
          "Nạp tiền điện thoại mạng Vinaphone chiết khấu ưu đãi cực tốt.",
      },
      {
        type: "phone",
        brand: "Mobifone",
        name: "Thẻ Mobifone",
        logo: "/img/the_mobifone.png",
        discountRate: 4.8,
        denominations: standardDenominations,
        description:
          "Mã thẻ Mobifone nạp ngay tức thì, bảo hành mã cào chuẩn 100%.",
      },
    ];

    await Card.insertMany(cardsData);
    console.log(`Seeded ${cardsData.length} Card brands.`);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
