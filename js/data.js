/*
 * DỮ LIỆU CỬA HÀNG — chỉ cần sửa file này để cập nhật web.
 *
 * - Ảnh bánh: lưu ảnh (tải từ Facebook/Instagram của shop) vào thư mục images/cakes/
 *   rồi điền đúng tên file vào trường `image` của từng mẫu.
 *   Nếu chưa có ảnh, web tự hiện khung màu thay thế.
 * - Giá: sửa ở `price` của từng mẫu (đơn vị đồng, VD 320000).
 *   Đổi showPrices thành false nếu muốn ẩn giá (khách đặt rồi Anela báo giá).
 */
window.ANELA = {
  shop: {
    name: "Anela Pastry",
    tagline: "Bánh mousse kem lạnh & bánh ngàn lớp Napoleon",
    city: "Hà Nội",
    hotline: "0911104918",
    hours: "9:00 – 19:00",
    followers: "33.8K", // số người theo dõi Instagram
    mode: "Online only · Nhận tại tiệm & ship tận nơi",
    address: "FLC Garden City, Đại Mỗ, Hà Nội", // địa chỉ tiệm (nhận bánh tại tiệm & tính khoảng cách ship)
    mapUrl: "https://www.google.com/maps/search/?api=1&query=FLC+Garden+City+%C4%90%E1%BA%A1i+M%E1%BB%97+H%C3%A0+N%E1%BB%99i",
    facebook: "https://www.facebook.com/anelahanoi",
    instagram: "https://www.instagram.com/anelahanoi",
    messenger: "https://m.me/anelahanoi",
    zalo: "https://zalo.me/0911104918",
    // Thông tin chuyển khoản hiện ở trang Mua hàng (để trống thì ẩn đi)
    bank: { bankName: "", accountNumber: "", accountName: "" },
    // Link Web App Google Apps Script để đơn hàng & đánh giá tự ghi vào Google Sheets.
    // Xem HUONG-DAN.md. Để trống thì đơn chỉ lưu trên máy khách + gửi qua Zalo/Messenger.
    orderWebhook: ""
  },

  // false = ẩn giá, khách đặt bánh và Anela báo giá khi xác nhận đơn
  showPrices: true,

  // Giao bánh trong Hà Nội: phường/xã cách tiệm dưới freeKm km miễn phí ship, xa hơn thu farFee.
  // origin: toạ độ tiệm (FLC Garden City, Đại Mỗ) để tính khoảng cách tới phường/xã khách chọn (js/phuong-hanoi.js).
  // onlyPhuong: true = chỉ cho chọn phường, false = cả phường và xã.
  shipping: { area: "Hà Nội", freeKm: 15, farFee: 30000, origin: [20.9912, 105.7547], onlyPhuong: false },

  // Tỉ lệ tiền cọc trước trên tiền bánh (0.5 = cọc 50%)
  depositRate: 0.5,

  // Giờ mở / đóng cửa (dùng để hiện "Đang mở cửa" trên trang chủ)
  openHour: 9,
  closeHour: 19,

  // Đặt trước tối thiểu bao nhiêu ngày
  minLeadDays: 1,
  timeSlots: ["9:00 – 11:00", "11:00 – 13:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 19:00"],

  /*
   * Phần giới thiệu từng dòng bánh trên trang chủ:
   * tagline (câu ngắn), story (giới thiệu), origin (câu chuyện / nguồn gốc), steps (cách làm, từng bước)
   */
  categories: [
    { id: "mousse", name: "Bánh mousse kem lạnh", short: "Mousse",
      tagline: "Mát lạnh, nhẹ tênh",
      story: "Dòng bánh đặc trưng của Anela: lớp mousse mịn mượt, ít ngọt, kết hợp trái cây tươi. Dùng lạnh là ngon nhất.",
      origin: "“Mousse” trong tiếng Pháp nghĩa là bọt. Món tráng miệng này nổi tiếng ở Pháp từ thế kỷ 18, ban đầu là mousse socola ăn bằng thìa; về sau các thợ bánh đưa mousse lên cốt bánh, phủ lớp gương bóng – thành chiếc bánh mát lạnh ngày nay.",
      steps: [
        "Đánh bông kem tươi thật mịn để tạo những bọt khí li ti – linh hồn của mousse.",
        "Trộn nhẹ tay với purée trái cây tươi, giữ cho lớp mousse xốp nhẹ không bị xẹp.",
        "Đổ khuôn trên cốt bánh mỏng, làm lạnh nhiều giờ cho mousse đông mềm.",
        "Phủ lớp gương hoặc kem, trang trí trái cây ngay trước khi giao."
      ] },
    { id: "napoleon", name: "Bánh ngàn lớp Napoleon", short: "Ngàn lớp",
      tagline: "Giòn tan từng lớp",
      story: "Vỏ bánh ngàn lớp nướng giòn thơm bơ, xen kem vani béo nhẹ và trái cây tươi xếp từng tầng.",
      origin: "Ở Pháp, bánh được gọi là mille-feuille – “ngàn lá”, vì vỏ bánh có hàng trăm lớp bột mỏng chồng lên nhau. Cái tên Napoleon nhiều khả năng bắt nguồn từ chữ “napolitain” (kiểu Naples), dù vẫn có giai thoại gắn chiếc bánh với hoàng đế Napoléon.",
      steps: [
        "Gói bơ lạnh vào bột rồi cán – gấp nhiều lần, tạo nên hàng trăm lớp bột và bơ xen kẽ.",
        "Nướng đến khi các lớp phồng tách và vàng giòn, để nguội hoàn toàn.",
        "Phết kem vani và xếp trái cây giữa từng tầng vỏ bánh.",
        "Lắp bánh gần giờ giao để vỏ bánh vẫn giữ được độ giòn."
      ] },
    { id: "chiffon", name: "Bông lan chiffon kem tươi", short: "Chiffon",
      tagline: "Mềm như bông",
      story: "Cốt chiffon xốp nhẹ, kem tươi không ngấy, trang trí trái cây – nhẹ nhàng cho những bữa tiệc nhỏ.",
      origin: "Chiffon cake ra đời năm 1927 ở Los Angeles, do Harry Baker – một người bán bảo hiểm mê làm bánh – sáng tạo. Ông giữ kín công thức suốt 20 năm trước khi bán lại; bí quyết hoá ra là dùng dầu ăn thay cho bơ.",
      steps: [
        "Trộn lòng đỏ trứng với dầu ăn và bột – dầu giúp bánh mềm ẩm ngay cả khi để lạnh.",
        "Đánh bông lòng trắng trứng rồi trộn nhẹ tay, giữ thật nhiều bọt khí.",
        "Nướng ở nhiệt độ vừa phải, úp ngược khuôn khi nguội để cốt bánh không xẹp.",
        "Phủ kem tươi đánh bông nhẹ và trái cây tươi."
      ] },
    { id: "cheesecake", name: "Cheesecake", short: "Cheesecake",
      tagline: "Béo mịn, chua nhẹ",
      story: "Cheesecake trên đế bánh quy bơ, phủ sốt trái cây chua ngọt – vị phô mai vừa đủ để nhớ.",
      origin: "Từ thời Hy Lạp cổ đại đã có những chiếc bánh làm từ phô mai. Cheesecake hiện đại thành hình khi cream cheese ra đời ở New York cuối thế kỷ 19, tạo nên kiểu bánh béo mịn nổi tiếng khắp thế giới.",
      steps: [
        "Nghiền bánh quy trộn bơ, nén chặt làm đế giòn.",
        "Đánh cream cheese với trứng, đường và kem tươi đến khi thật mịn.",
        "Nướng cách thuỷ ở lửa nhỏ (hoặc làm lạnh với bản không nướng) để mặt bánh mịn, không nứt.",
        "Để bánh nghỉ qua đêm trong ngăn mát rồi phủ sốt trái cây."
      ] },
    { id: "wedding", name: "Bánh cưới & bánh tầng", short: "Bánh cưới",
      tagline: "Cho ngày trọng đại",
      story: "Bánh tầng thiết kế theo tông màu tiệc cưới, kỷ niệm hay khai trương, từ hoa kem đến hoa tươi.",
      origin: "Bánh tầng gắn với tiệc cưới ở Anh từ thế kỷ 19. Tương truyền kiểu bánh nhiều tầng lấy cảm hứng từ ngọn tháp nhà thờ St Bride ở London, còn chiếc bánh cưới phủ đường trắng của Nữ hoàng Victoria năm 1840 khiến màu trắng trở thành truyền thống.",
      steps: [
        "Trao đổi với cô dâu chú rể để chọn vị bánh, tông màu và kiểu trang trí.",
        "Nướng từng tầng cốt bánh riêng, phủ kem và làm phẳng mặt.",
        "Gia cố trụ đỡ bên trong để các tầng đứng vững khi xếp chồng.",
        "Trang trí hoa kem hoặc hoa tươi, hoàn thiện trước giờ tiệc."
      ] },
    { id: "hamper", name: "Hộp quà / Hamper", short: "Hamper",
      tagline: "Món quà xinh",
      story: "Hộp quà gồm bánh và đồ ngọt gói ghém chỉn chu – quà tặng dịp lễ, lời cảm ơn hay tri ân.",
      origin: "“Hamper” bắt nguồn từ chữ Pháp cổ “hanapier” – chiếc hộp đựng cốc quý. Ở Anh thời Victoria, giỏ quà đựng đồ ăn ngon trở thành món quà Giáng sinh quen thuộc, và đến nay vẫn là cách tặng quà chỉn chu trong các dịp lễ.",
      steps: [
        "Chọn các loại bánh và đồ ngọt hợp với dịp tặng và người nhận.",
        "Làm bánh và chuẩn bị đồ ngọt gần ngày giao để luôn tươi ngon.",
        "Sắp xếp vào hộp, chèn giấy lót để bánh không xô lệch.",
        "Thắt nơ, kèm thiệp lời chúc gửi người nhận."
      ] }
  ],

  /*
   * BỘ SƯU TẬP (BST) – hiện ở trang chủ và trang BST mẫu bánh.
   * Mẫu bánh thuộc BST nào thì ghi collection: "<id của BST>" trong phần products.
   * points: các ý gạch đầu dòng (có thể để trống), outro: câu kết (có thể bỏ).
   */
  collections: [
    { id: "mien-hoa", name: "Miền Hoa", subtitle: "Bộ sưu tập 20.10", image: "images/bst/mien-hoa.jpg",
      caption: "Có một miền hoa ngập tràn hương sắc, nơi mỗi đóa hoa mang một nét duyên riêng, lặng lẽ khoe sắc theo cách của mình. Từ cảm hứng ấy, BST Miền Hoa 20.10 của Anela gửi gắm ba đóa hoa vào ba chiếc bánh, tạo nên một miền hoa nhỏ xinh, nơi vẻ đẹp được nâng niu trong từng đường nét và mỗi đóa hoa mang theo một lời chúc dịu dàng dành tặng những người phụ nữ ta trân quý." },
    { id: "napoleon-summer-diary", name: "Layered Summer Diary", subtitle: "BST Napoleon ngàn lớp", image: "images/bst/napoleon-summer-diary.jpg",
      caption: "Mỗi lớp bánh Napoleon giòn rụm là một chương nhỏ của mùa hè được kể bằng những tầng hương vị khác nhau:",
      points: [
        "Napoleon Dứa – rực rỡ như những vệt nắng đầu ngày với vị chua ngọt thanh mát đánh thức mọi giác quan.",
        "Napoleon Nhãn – dịu dàng như cơn gió cuối chiều, mang theo vị ngọt thanh và cảm giác bình yên của mùa hạ.",
        "Napoleon Earl Grey & Xoài – tựa sắc vàng của hoàng hôn mùa hạ, khép lại một ngày hè bằng hương trà Earl Grey thanh lịch hòa quyện cùng vị xoài chín nhiệt đới."
      ],
      outro: "Ba hương vị. Ba sắc thái. Ba chương khác nhau của mùa hạ rực rỡ." },
    { id: "be-my-valentine", name: "Be My Valentine", subtitle: "Valentine's Collection 2025", image: "images/bst/be-my-valentine.jpg",
      caption: "Be My Valentine không chỉ là BST bánh dành cho những trái tim đang yêu mà còn là hành trình tái hiện những cung bậc cảm xúc, giúp bạn tiếp nối câu chuyện tình lãng mạn của mình với người ấy theo cách thật đặc biệt." },
    { id: "capy-bunny", name: "Capy & Bunny", subtitle: "BST Capy & Bunny", image: "images/bst/capy-bunny.jpg",
      caption: "Những chiếc bánh nhỏ xinh chứa đựng cả tuổi thơ rộn ràng đầy tiếng cười. Cùng Capy và Bunny phiêu lưu vào xứ sở diệu kỳ, nơi các bạn nhỏ được lưu giữ những khoảnh khắc hồn nhiên và tràn ngập niềm vui." },
    { id: "ky-uc-ngot-lanh", name: "Ký ức ngọt lành", subtitle: "Sáu tuần · sáu chiếc bánh", image: "images/bst/ky-uc-ngot-lanh.jpg",
      caption: "Sáu tuần, sáu chiếc bánh, sáu mảnh ký ức được gói gọn bằng những hương vị trái cây mùa hè đầy cảm xúc. Anela đã kể bạn nghe lần lượt từng câu chuyện qua những lát cắt bánh nhỏ, có những ngày bồi hồi, có những buổi trưa yên ả, có cả tiếng cười trong veo của tuổi thơ hay chút bâng khuâng không gọi thành lời. Tất cả được thổi hồn bằng những nguyên liệu tươi ngon cùng tinh thần sáng tạo không ngừng của Anela." },
    { id: "time-to-shine", name: "Time to Shine", subtitle: "Women's Day Collection by Anela Pastry", image: "images/bst/time-to-shine.jpg",
      caption: "Mỗi chiếc bánh trong BST “Time to Shine” là một đóa hoa khoe sắc, đại diện cho những nét đẹp riêng biệt của người phụ nữ – dù nhẹ nhàng, mạnh mẽ hay đầy cá tính, tất cả đều mang trong mình một ánh sáng rực rỡ, một vẻ đẹp đầy bí ẩn và sức cuốn hút độc nhất.",
      points: [
        "The Bouquet – cùng đường nét uyển chuyển và màu sắc rực rỡ của hoa tulip, The Bouquet gợi lên vẻ đẹp duyên dáng nhưng đầy cá tính và bản lĩnh của người phụ nữ hiện đại."
      ] }
  ],

  /*
   * MẪU BÁNH – số thứ tự mẫu (01, 02…) tự đánh theo thứ tự trong danh sách này.
   * collection: id của BST (bỏ trống = bánh lẻ). tags: hiện thành #hashtag ở trang Tìm mẫu.
   * gallery: ảnh phụ (tuỳ chọn). Giá 0 = chưa nhập giá.
   */
  products: [
    // ----- BST Miền Hoa -----
    {
      id: "mien-hoa-lan", collection: "mien-hoa", name: "Hoa Lan", isNew: true,
      image: "images/cakes/mien-hoa-lan.jpg",
      description: "Đóa lan dịu dàng trên nền bánh trắng mềm mại – món quà thanh lịch dành tặng bà, mẹ, đồng nghiệp hay người phụ nữ bạn trân quý.",
      tags: ["hoa", "20.10", "quà tặng"], sizes: [{ label: "Size tiêu chuẩn", price: 350000 }]
    },
    {
      id: "mien-hoa-mau-don", collection: "mien-hoa", name: "Hoa Mẫu Đơn", isNew: true,
      image: "images/cakes/mien-hoa-mau-don.jpg",
      description: "Những cánh hoa hồng phấn xếp lớp nở bung trên chiếc bánh hồng – nhẹ nhàng mà rực rỡ.",
      tags: ["hoa", "20.10", "hồng"], sizes: [{ label: "Size tiêu chuẩn", price: 350000 }]
    },
    {
      id: "mien-hoa-hong", collection: "mien-hoa", name: "Vườn Hồng", isNew: true,
      image: "images/cakes/mien-hoa-hong.jpg",
      description: "Những đóa hồng đỏ và hồng phấn nép bên nhau, điểm nơ đỏ duyên dáng.",
      tags: ["hoa", "20.10", "hoa hồng"], sizes: [{ label: "Size tiêu chuẩn", price: 350000 }]
    },
    // ----- BST Layered Summer Diary -----
    {
      id: "napoleon-dua", collection: "napoleon-summer-diary", category: "napoleon", name: "Napoleon Dứa", isNew: true,
      image: "images/cakes/napoleon-dua.jpg",
      description: "Rực rỡ như những vệt nắng đầu ngày với vị chua ngọt thanh mát đánh thức mọi giác quan.",
      tags: ["dứa", "ngàn lớp", "trái cây"], sizes: [{ label: "Size tiêu chuẩn", price: 290000 }]
    },
    {
      id: "napoleon-nhan", collection: "napoleon-summer-diary", category: "napoleon", name: "Napoleon Nhãn", isNew: true,
      image: "images/cakes/napoleon-nhan.jpg",
      description: "Dịu dàng như cơn gió cuối chiều, mang theo vị ngọt thanh và cảm giác bình yên của mùa hạ.",
      tags: ["nhãn", "ngàn lớp", "trái cây"], sizes: [{ label: "Size tiêu chuẩn", price: 290000 }]
    },
    {
      id: "napoleon-earl-grey-xoai", collection: "napoleon-summer-diary", category: "napoleon", name: "Napoleon Earl Grey & Xoài", isNew: true,
      image: "images/cakes/napoleon-earl-grey-xoai.jpg",
      description: "Tựa sắc vàng của hoàng hôn mùa hạ – hương trà Earl Grey thanh lịch hòa quyện cùng vị xoài chín nhiệt đới.",
      tags: ["xoài", "trà", "ngàn lớp"], sizes: [{ label: "Size tiêu chuẩn", price: 300000 }]
    },
    // ----- BST Be My Valentine -----
    {
      id: "valentine-trai-tim-gap", collection: "be-my-valentine", name: "Love Story",
      image: "images/cakes/valentine-trai-tim-gap.jpg",
      description: "Red velvet – trái tim đỏ xếp lớp như trang thư tình trên nền bánh trắng viền đỏ.",
      tags: ["valentine", "red velvet", "trái tim"], sizes: [{ label: "Size tiêu chuẩn", price: 320000 }]
    },
    {
      id: "valentine-nhung-trai-tim", collection: "be-my-valentine", name: "Sweetheart",
      image: "images/cakes/valentine-nhung-trai-tim.jpg",
      description: "Socola, caramen & bơ đậu phộng – lớp gương đỏ bóng điểm những trái tim hồng nhỏ xinh.",
      tags: ["valentine", "socola", "trái tim"], sizes: [{ label: "Size tiêu chuẩn", price: 320000 }]
    },
    {
      id: "valentine-trai-tim-no", collection: "be-my-valentine", name: "Heartbeat",
      image: "images/cakes/valentine-trai-tim-no.jpg",
      description: "Socola & cacao – bánh hình trái tim phủ gương đỏ, thắt chiếc nơ trắng mềm mại.",
      tags: ["valentine", "socola", "trái tim"], sizes: [{ label: "Size tiêu chuẩn", price: 330000 }]
    },
    // ----- BST Capy & Bunny -----
    {
      id: "capy", collection: "capy-bunny", name: "Capy",
      image: "images/cakes/capy.jpg",
      description: "Chú capybara đội vịt vàng, thắt nơ đỏ – ngộ nghĩnh cho các bạn nhỏ.",
      tags: ["trẻ em", "sinh nhật", "con vật"], sizes: [{ label: "Size tiêu chuẩn", price: 330000 }]
    },
    {
      id: "bunny", collection: "capy-bunny", name: "Bunny",
      image: "images/cakes/bunny.jpg",
      description: "Cô thỏ hồng bên ngôi nhà cà rốt – ngọt ngào như một câu chuyện cổ tích.",
      tags: ["trẻ em", "sinh nhật", "con vật"], sizes: [{ label: "Size tiêu chuẩn", price: 330000 }]
    },
    // ----- BST Ký ức ngọt lành -----
    {
      id: "ky-uc-bong-benh", collection: "ky-uc-ngot-lanh", name: "Bồng Bềnh",
      image: "images/cakes/ky-uc-bong-benh.jpg",
      description: "Mặt bánh xanh bơ viền kem tươi, điểm những bông hoa tím nhỏ.",
      tags: ["bơ", "mùa hè", "hộp thiếc"], sizes: [{ label: "Hộp thiếc", price: 250000 }]
    },
    {
      id: "ky-uc-liu-lo", collection: "ky-uc-ngot-lanh", name: "Líu Lo",
      image: "images/cakes/ky-uc-liu-lo.jpg",
      description: "Những dải trái cây vàng cam cuộn tròn trên mặt bánh.",
      tags: ["trái cây", "mùa hè", "hộp thiếc"], sizes: [{ label: "Hộp thiếc", price: 250000 }]
    },
    {
      id: "ky-uc-nong-nan", collection: "ky-uc-ngot-lanh", name: "Nồng Nàn",
      image: "images/cakes/ky-uc-nong-nan.jpg",
      description: "Phủ kín trái cây trong veo, điểm những bông hoa trắng nhỏ.",
      tags: ["trái cây", "mùa hè", "hộp thiếc"], sizes: [{ label: "Hộp thiếc", price: 250000 }]
    },
    {
      id: "ky-uc-ngan-ngo", collection: "ky-uc-ngot-lanh", name: "Ngẩn Ngơ",
      image: "images/cakes/ky-uc-ngan-ngo.jpg",
      description: "Dâu tây tươi xếp kín mặt bánh, điểm hoa cúc trắng.",
      tags: ["dâu", "mùa hè", "hộp thiếc"], sizes: [{ label: "Hộp thiếc", price: 250000 }]
    },
    {
      id: "ky-uc-ngao-ngat", collection: "ky-uc-ngot-lanh", name: "Ngào Ngạt",
      image: "images/cakes/ky-uc-ngao-ngat.jpg",
      description: "Những dải trái cây vàng óng xếp kín mặt bánh.",
      tags: ["trái cây", "mùa hè", "hộp thiếc"], sizes: [{ label: "Hộp thiếc", price: 250000 }]
    },
    {
      id: "ky-uc-xon-xang", collection: "ky-uc-ngot-lanh", name: "Xốn Xang",
      image: "images/cakes/ky-uc-xon-xang.jpg",
      description: "Mặt bánh hồng đỏ viền kem tươi, điểm những bông hoa đỏ nhỏ.",
      tags: ["trái cây", "mùa hè", "hộp thiếc"], sizes: [{ label: "Hộp thiếc", price: 250000 }]
    },
    // ----- BST Time to Shine -----
    {
      id: "the-bouquet", collection: "time-to-shine", name: "The Bouquet",
      image: "images/cakes/the-bouquet.jpg", gallery: ["images/cakes/the-bouquet-2.jpg"],
      description: "Cùng đường nét uyển chuyển và màu sắc rực rỡ của hoa tulip, The Bouquet gợi lên vẻ đẹp duyên dáng nhưng đầy cá tính và bản lĩnh của người phụ nữ hiện đại.",
      tags: ["hoa", "8.3", "ngày của mẹ"], sizes: [{ label: "Size tiêu chuẩn", price: 350000 }]
    },
    {
      id: "tts-mau-don", collection: "time-to-shine", name: "Hồng Phấn",
      image: "images/cakes/tts-mau-don.jpg",
      description: "Đóa hoa hồng phấn nở bung trên nền bánh hồng, lát cắt lộ những lớp bánh socola.",
      tags: ["hoa", "8.3", "hồng"], sizes: [{ label: "Size tiêu chuẩn", price: 340000 }]
    },
    {
      id: "tts-cam-chuong", collection: "time-to-shine", name: "Carnabelle",
      image: "images/cakes/tts-cam-chuong.jpg",
      description: "Đóa cẩm chướng trắng xếp nếp, điểm sắc đỏ trên nền bánh trắng viền đỏ.",
      tags: ["hoa", "8.3", "cẩm chướng"], sizes: [{ label: "Size tiêu chuẩn", price: 350000 }]
    },

    // ----- Bánh lẻ (tên tạm đặt theo hình, Anela sửa lại tên & mô tả cho đúng) -----
    {
      id: "chanh-leo-nang", name: "Chanh Leo Nắng",
      image: "images/cakes/chanh-leo-nang.jpg",
      description: "Mặt bánh vàng cam, điểm những lát chanh leo và kem tươi.",
      tags: ["chanh leo", "trái cây", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 300000 }]
    },
    {
      id: "dau-do", name: "Dâu Đỏ",
      image: "images/cakes/dau-do.jpg",
      description: "Bánh đỏ viền kem trắng, phủ dâu tây tươi và hoa nhỏ.",
      tags: ["dâu", "trái cây", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 300000 }]
    },
    {
      id: "dau-tay-trang", name: "Dâu Tây Trắng",
      image: "images/cakes/dau-tay-trang.jpg",
      description: "Nền bánh trắng viền đỏ, giữa là dâu tây tươi xếp kín và bướm socola trắng.",
      tags: ["dâu", "trái cây", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 310000 }]
    },
    {
      id: "tra-chieu", name: "Trà Chiều",
      image: "images/cakes/tra-chieu.jpg",
      description: "Bánh trắng ngà xoáy kem, gợi hương trà thanh nhẹ cho buổi chiều.",
      tags: ["trà", "thanh nhẹ", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 280000 }]
    },
    {
      id: "ngoc-trai", name: "Ngọc Trai",
      image: "images/cakes/ngoc-trai.jpg",
      description: "Hai tầng trắng và socola, điểm những mảnh socola trắng thanh lịch.",
      tags: ["socola", "thanh lịch", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 300000 }]
    },
    {
      id: "vuong-mien-socola", name: "Vương Miện Socola",
      image: "images/cakes/vuong-mien-socola.jpg",
      description: "Bánh socola bóng mịn đội vương miện socola đen.",
      tags: ["socola", "vương miện", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 320000 }]
    },
    {
      id: "socola-choux", name: "Socola Choux",
      image: "images/cakes/socola-choux.jpg",
      description: "Bánh socola đen phủ bánh su nhỏ và hạt.",
      tags: ["socola", "hạt", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 310000 }]
    },
    {
      id: "hong-nhung", name: "Hồng Nhung",
      image: "images/cakes/hong-nhung.jpg",
      description: "Bánh trắng viền đỏ rượu, điểm đóa hồng đỏ và cánh socola trắng.",
      tags: ["hoa hồng", "đỏ", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 320000 }]
    },
    {
      id: "vuon-tulip", name: "Vườn Tulip",
      image: "images/cakes/vuon-tulip.jpg",
      description: "Bánh hồng cắm những đóa tulip cam, lát cắt lộ lớp bánh mềm.",
      tags: ["hoa", "tulip", "quà tặng"], sizes: [{ label: "Size tiêu chuẩn", price: 340000 }]
    },
    {
      id: "cam-tu-cau", name: "Cẩm Tú Cầu",
      image: "images/cakes/cam-tu-cau.jpg",
      description: "Bánh trắng xanh điểm chùm cẩm tú cầu xanh dương.",
      tags: ["hoa", "xanh", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 330000 }]
    },
    {
      id: "trai-tim-yeu", name: "Trái Tim Yêu",
      image: "images/cakes/trai-tim-yeu.jpg",
      description: "Bánh trắng với trái tim đỏ vỡ đôi ở giữa – lời yêu thương ngọt ngào.",
      tags: ["trái tim", "tình yêu", "kỷ niệm"], sizes: [{ label: "Size tiêu chuẩn", price: 300000 }]
    },
    {
      id: "tai-tho", name: "Tai Thỏ",
      image: "images/cakes/tai-tho.jpg",
      description: "Bánh xanh nhạt với đôi tai thỏ đáng yêu.",
      tags: ["thỏ", "trẻ em", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 290000 }]
    },
    {
      id: "thuong-me-tulip", name: "Thương Mẹ · Tulip",
      image: "images/cakes/thuong-me-tulip.jpg",
      description: "Đóa tulip hồng nằm nghiêng trên nền bánh trắng – “vì luôn kiên nhẫn chẳng một lời than vãn”.",
      tags: ["ngày của mẹ", "hoa", "tulip"], sizes: [{ label: "Size tiêu chuẩn", price: 340000 }]
    },
    {
      id: "thuong-me-trai-tim", name: "Thương Mẹ · Trái Tim",
      image: "images/cakes/thuong-me-trai-tim.jpg",
      description: "Trái tim hồng thắt nơ đỏ – “vì luôn dành cho con những gì tốt đẹp nhất”.",
      tags: ["ngày của mẹ", "trái tim", "hồng"], sizes: [{ label: "Size tiêu chuẩn", price: 320000 }]
    },
    {
      id: "hoa-dao-hong", name: "Hoa Hồng Phấn",
      image: "images/cakes/hoa-dao-hong.jpg",
      description: "Những bông hoa hồng phấn trên nền bánh trắng – Happy Mother's Day Cake Collection.",
      tags: ["ngày của mẹ", "hoa", "hồng"], sizes: [{ label: "Size tiêu chuẩn", price: 340000 }]
    },
    {
      id: "napoleon-tim", category: "napoleon", name: "Napoleon Tím",
      image: "images/cakes/napoleon-tim.jpg",
      description: "Vỏ ngàn lớp giòn rụm, mặt bánh bắt kem tím nhạt xinh xắn.",
      tags: ["ngàn lớp", "tím", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 290000 }]
    },
    {
      id: "napoleon-co-dien", category: "napoleon", name: "Napoleon Cổ Điển",
      image: "images/cakes/napoleon-co-dien.jpg",
      description: "Ngàn lớp giòn thơm bơ, mặt kem kẻ sọc điểm vàng lá.",
      tags: ["ngàn lớp", "cổ điển", "sinh nhật"], sizes: [{ label: "Size tiêu chuẩn", price: 280000 }]
    },
    {
      id: "manh-xanh", name: "Mảnh Xanh",
      image: "images/cakes/manh-xanh.jpg",
      description: "Những lát bánh xanh nhiều lớp, trang trí socola trắng.",
      tags: ["bánh lát", "xanh", "trà chiều"], sizes: [{ label: "Size tiêu chuẩn", price: 260000 }]
    },
    {
      id: "hop-banh-lat", category: "hamper", name: "Hộp Bánh Lát",
      image: "images/cakes/hop-banh-lat.jpg",
      description: "Hộp bốn lát bánh nhiều vị – món quà nhỏ xinh để thử nhiều hương vị.",
      tags: ["bánh lát", "quà tặng", "hộp quà"], sizes: [{ label: "Hộp 4 lát", price: 250000 }]
    },
    {
      id: "vong-quay-ngua-go", name: "Vòng Quay Ngựa Gỗ",
      image: "images/cakes/vong-quay-ngua-go.jpg",
      description: "Bánh đỏ với vòng quay ngựa gỗ – không khí Giáng Sinh rộn ràng.",
      tags: ["giáng sinh", "noel", "đỏ"], sizes: [{ label: "Size tiêu chuẩn", price: 350000 }]
    },
    {
      id: "cay-thong-tuyet", name: "Cây Thông Tuyết",
      image: "images/cakes/cay-thong-tuyet.jpg",
      description: "Cây thông bông tuyết trắng trên bánh trắng thắt nơ đỏ.",
      tags: ["giáng sinh", "noel", "trắng"], sizes: [{ label: "Size tiêu chuẩn", price: 350000 }]
    },
    {
      id: "ong-gia-noel", name: "Ông Già Noel",
      image: "images/cakes/ong-gia-noel.jpg",
      description: "Bánh như chiếc áo ông già Noel, phủ dâu tây và bông tuyết.",
      tags: ["giáng sinh", "noel", "dâu"], sizes: [{ label: "Size tiêu chuẩn", price: 330000 }]
    },
    {
      id: "trung-thu-tho-ngoc", name: "Trung Thu Thỏ Ngọc",
      image: "images/cakes/trung-thu-tho-ngoc.jpg",
      description: "Thỏ ngọc, ông trăng và đèn ông sao – bánh cho mùa Trung Thu.",
      tags: ["trung thu", "thỏ", "trẻ em"], sizes: [{ label: "Size tiêu chuẩn", price: 330000 }]
    }
  ],

  /*
   * Đánh giá thật của khách (ví dụ chép từ mục Đánh giá trên Facebook).
   * Mẫu: { name: "Tên khách", rating: 5, date: "2026-10-20", product: "mousse-dau-tay", text: "Nội dung..." }
   */
  reviews: []
};
