(function () {
  "use strict";

  const D = window.ANELA;
  const S = D.shop;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------- Helpers ----------
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";
  // showPrices: false trong data.js => ẩn mọi giá, Anela báo giá khi xác nhận đơn
  const SHOW_PRICES = D.showPrices !== false;
  const ASK_PRICE = "Anela báo giá khi xác nhận đơn";
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().trim();
  const param = (k) => new URLSearchParams(location.search).get(k);
  const product = (id) => D.products.find((p) => p.id === id);
  const category = (id) => D.categories.find((c) => c.id === id) || { name: "", short: "" };
  const collection = (id) => (D.collections || []).find((c) => c.id === id);
  const inBst = (c) => D.products.filter((p) => p.collection === c.id);
  const bstLink = (c) => `bo-suu-tap.html?bst=${c.id}`;
  // Nhãn nhỏ của mẫu bánh: tên BST nếu mẫu thuộc BST, không thì là bánh lẻ
  const labelOf = (p) => (collection(p.collection) ? `BST ${collection(p.collection).name}` : "Bánh lẻ");
  const minPrice = (p) => Math.min(...p.sizes.map((s) => s.price));
  const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString("vi-VN"); };
  D.products.forEach((p, i) => { p.no = String(i + 1).padStart(2, "0"); });

  const store = {
    get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* bộ nhớ bị chặn */ } }
  };

  const ICON = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>'
  };

  // ---------- Hình minh hoạ bánh (hiện khi chưa có ảnh thật) ----------
  const FLAVOR_COLORS = [
    ["dâu", "#E8788A"], ["việt quất", "#7C6DB8"], ["xoài", "#F3B843"], ["chanh leo", "#F0A93B"],
    ["matcha", "#8DBA68"], ["socola", "#6B3B2C"], ["vani", "#EBCB86"]
  ];
  const CATEGORY_COLORS = { mousse: "#E8788A", napoleon: "#E8788A", chiffon: "#F3B843", cheesecake: "#7C6DB8", wedding: "#E9A1A6", hamper: "#A9D18E" };

  function mix(a, b, t) {
    const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const A = rgb(a), B = rgb(b);
    return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("");
  }

  function flavorColor(p) {
    const hit = FLAVOR_COLORS.find(([t]) => p.tags.includes(t));
    return hit ? hit[1] : CATEGORY_COLORS[p.category] || "#E8788A";
  }

  function cakeArt(kind, c) {
    const light = mix(c, "#ffffff", 0.35);
    const dark = mix(c, "#3a221d", 0.28);
    const leaf = '<path d="M0 0c5-7 12-8 16-6-3 6-10 8-16 6z" fill="#7DAF5E"/>';
    const plate = '<ellipse cx="100" cy="164" rx="84" ry="14" fill="#7a3f30" opacity=".12"/><ellipse cx="100" cy="158" rx="80" ry="13" fill="#fff"/><ellipse cx="100" cy="156" rx="70" ry="9" fill="#FBF4EC"/>';
    const cyl = (x1, x2, top, bottom, side, cap) => {
      const rx = (x2 - x1) / 2, cx = x1 + rx, ry = Math.max(8, rx * 0.22);
      return `<path d="M${x1} ${top}V${bottom}a${rx} ${ry} 0 0 0 ${x2 - x1} 0V${top}z" fill="${side}"/><ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="${cap}"/>`;
    };
    const drips = (xs, y, color) => xs.map(([x, len]) => `<path d="M${x} ${y}v${len}a3.5 3.5 0 0 0 7 0v-${len}z" fill="${color}"/>`).join("");
    const berries = (pts, color) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 4}" fill="#fff" opacity=".7"/>`).join("");
    const shine = (x, y1, y2) => `<path d="M${x} ${y1}V${y2}" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>`;
    let art = "";

    if (kind === "napoleon") {
      const pastry = "#E3A55C", cream = "#FFF5DE";
      const layers = [[92, 8, pastry], [100, 10, cream], [110, 8, pastry], [118, 10, cream], [128, 8, pastry], [136, 10, cream], [146, 6, pastry]];
      art = plate +
        '<polygon points="148,92 172,76 172,136 148,152" fill="#C98840"/>' +
        layers.map(([y, h, col]) => `<rect x="34" y="${y}" width="114" height="${h}" fill="${col}"/>`).join("") +
        '<polygon points="34,92 58,76 172,76 148,92" fill="#FFFBF3"/>' +
        berries([[64, 84, 6.5], [84, 82, 7], [104, 84, 6.5], [124, 81, 7], [146, 82, 6]], c) +
        `<g transform="translate(92 74)">${leaf}</g>`;
    } else if (kind === "chiffon") {
      art = plate + cyl(44, 156, 88, 146, "#FFF8EE", "#FFFFFF") +
        `<path d="M44 128a56 12 0 0 0 112 0" stroke="${light}" stroke-width="7" fill="none"/>` +
        [0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = 52 + i * 16, y = 88 + 12 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 100) / 56, 2)));
          return `<circle cx="${x}" cy="${y - 2}" r="7.5" fill="#fff" stroke="#F0E2D3"/>`;
        }).join("") +
        berries([[90, 80, 9], [110, 82, 9], [100, 72, 8]], c) +
        `<g transform="translate(104 64)">${leaf}</g>`;
    } else if (kind === "cheesecake") {
      art = plate + cyl(42, 158, 100, 146, "#FFF0CC", light) +
        '<path d="M42 136V146a58 13 0 0 0 116 0V136a58 13 0 0 1-116 0z" fill="#C98B4E"/>' +
        `<ellipse cx="100" cy="100" rx="58" ry="13" fill="${c}"/>` +
        drips([[50, 10], [66, 18], [86, 12], [108, 20], [128, 11], [146, 15]], 104, c) +
        berries([[88, 96, 6], [100, 92, 6.5], [112, 96, 6]], dark);
    } else if (kind === "wedding") {
      const side = "#FBF2E8", cap = "#FFFDF8";
      art = plate + cyl(42, 158, 120, 150, side, cap) + cyl(58, 142, 92, 122, side, cap) + cyl(72, 128, 64, 94, side, cap) +
        shine(52, 128, 146) + shine(66, 100, 116) +
        [[118, 70, 9, c], [130, 80, 7, light], [126, 98, 8, c], [140, 106, 6.5, light], [136, 126, 8, c], [150, 132, 6, light], [86, 64, 6, light]]
          .map(([x, y, r, col]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x}" cy="${y}" r="${r / 3}" fill="#FFF3C4"/>`).join("") +
        `<g transform="translate(138 88)">${leaf}</g><g transform="translate(142 116)">${leaf}</g>`;
    } else if (kind === "hamper") {
      art = '<ellipse cx="100" cy="160" rx="72" ry="11" fill="#7a3f30" opacity=".12"/>' +
        `<rect x="50" y="100" width="100" height="58" rx="8" fill="${light}"/>` +
        `<rect x="44" y="86" width="112" height="20" rx="6" fill="${c}"/>` +
        '<rect x="93" y="86" width="14" height="72" fill="#fff" opacity=".9"/>' +
        '<ellipse cx="86" cy="78" rx="15" ry="8" fill="#fff" transform="rotate(-18 86 78)"/><ellipse cx="114" cy="78" rx="15" ry="8" fill="#fff" transform="rotate(18 114 78)"/>' +
        `<circle cx="100" cy="82" r="6" fill="${dark}"/>` +
        '<path d="M120 120h22v16h-22z" fill="#fff" opacity=".85" transform="rotate(-8 131 128)"/>';
    } else {
      // mousse kem lạnh
      art = plate + cyl(44, 156, 104, 146, c, light) +
        drips([[52, 12], [68, 20], [88, 10], [110, 18], [132, 13], [146, 9]], 108, light) +
        shine(54, 122, 140) +
        berries([[86, 98, 7], [100, 93, 8], [114, 98, 6.5]], dark) +
        '<circle cx="74" cy="102" r="4" fill="#fff"/><circle cx="126" cy="102" r="4" fill="#fff"/>' +
        `<g transform="translate(104 86)">${leaf}</g>`;
    }
    return `<svg class="cake" viewBox="0 0 200 200" aria-hidden="true">${art}</svg>`;
  }

  // Ảnh bánh: có file ảnh thật thì hiện ảnh, không có thì hiện hình minh hoạ
  function thumb(p, extraClass = "", inner = "") {
    const c = flavorColor(p);
    return `<div class="thumb ${extraClass}" style="--bg1:${mix(c, "#ffffff", 0.8)};--bg2:${mix(c, "#F5EBC9", 0.62)}">
      ${inner}${cakeArt(p.category, c)}
      ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ""}
    </div>`;
  }

  function stars(n) {
    const r = Math.round(n);
    return `<span class="stars" aria-label="${n} trên 5 sao">${"★".repeat(r)}<span class="off">${"★".repeat(5 - r)}</span></span>`;
  }

  // Thẻ mẫu bánh: ảnh + số mẫu, tên, #hashtag, nút đặt và hỏi giá
  function productCard(p, i = 0) {
    const tag = p.isNew ? '<span class="tag-moi">Mới</span>' : p.bestSeller ? '<span class="tag-moi">Bán chạy</span>' : "";
    return `<article class="mau" style="--i:${i}">
      <button class="mau-anh" data-open="${p.id}" aria-label="Xem mẫu ${p.no} – ${esc(p.name)}">${thumb(p, "", `<span class="so">${p.no}</span>${tag}`)}</button>
      <div class="mau-info">
        <h3><button data-open="${p.id}">${esc(p.name)}</button></h3>
        <p class="hashtag">${p.tags.map((t) => `#${esc(t)}`).join(" ")}</p>
        <div class="mau-nut">
          <button class="nut-dat" data-open="${p.id}">Đặt mẫu này</button>
          ${SHOW_PRICES && minPrice(p) > 0
            ? `<button class="nut-hoi" data-open="${p.id}" aria-label="Giá ${money(minPrice(p))}">${money(minPrice(p))}</button>`
            : `<a class="nut-hoi" href="${S.messenger}" target="_blank" rel="noopener">Hỏi giá</a>`}
        </div>
      </div>
    </article>`;
  }

  function emptyState(title, text, action = "") {
    return `<div class="empty"><h3>${title}</h3><p>${text}</p>${action}</div>`;
  }

  let toastTimer;
  function toast(html) {
    let el = $(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.innerHTML = html;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  function sendToSheet(payload) {
    if (!S.orderWebhook) return;
    fetch(S.orderWebhook, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) })
      .catch(() => { /* đơn vẫn được lưu trên máy và gửi qua Zalo/Messenger */ });
  }

  async function copyText(text, msg = "Đã sao chép nội dung đơn hàng") {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (err) { /* bỏ qua */ }
      ta.remove();
    }
    toast(msg);
  }

  function isOpenNow() {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    return h >= D.openHour && h < D.closeHour;
  }

  // ---------- Giỏ hàng ----------
  const cart = {
    items() { return store.get("anela_cart", []).filter((i) => product(i.id) && product(i.id).sizes[i.size]); },
    save(items) { store.set("anela_cart", items); updateCartCount(); },
    add(id, sizeIdx, qty, note) {
      const items = cart.items();
      const found = items.find((i) => i.id === id && i.size === sizeIdx && (i.note || "") === (note || ""));
      if (found) found.qty += qty; else items.push({ id, size: sizeIdx, qty, note: note || "" });
      cart.save(items);
    },
    count() { return cart.items().reduce((a, i) => a + i.qty, 0); },
    total() { return cart.items().reduce((a, i) => a + product(i.id).sizes[i.size].price * i.qty, 0); }
  };

  function updateCartCount() {
    const n = cart.count();
    $$(".cart-count").forEach((el) => { el.textContent = n; el.hidden = n === 0; });
  }

  // ---------- Khung trang ----------
  const NAV = [
    ["bo-suu-tap.html", "BST mẫu bánh", "collection"],
    ["tim-mau.html", "Tìm mẫu", "search"],
    ["don-hang.html", "Đơn hàng của tôi", "orders"],
    ["danh-gia.html", "Đánh giá", "reviews"]
  ];

  function renderLayout(page) {
    document.body.insertAdjacentHTML("afterbegin",
      '<div class="progress" id="progress" aria-hidden="true"></div><div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>');

    const header = $("#site-header");
    if (header) {
      header.outerHTML = `
      <header class="nav" id="nav">
        <a class="brand" href="index.html" aria-label="${esc(S.name)} – Trang chủ">
          <img src="images/logo.png" alt="">
          <span>Anela <em>pastry</em></span>
        </a>
        <nav class="links" id="links" aria-label="Các trang">
          <a href="index.html" class="${page === "home" ? "active" : ""}">Trang chủ</a>
          ${NAV.map(([href, label, key]) => `<a href="${href}" class="${key === page ? "active" : ""}">${label}</a>`).join("")}
        </nav>
        <div class="nav-phai">
          <a class="btn btn-primary btn-sm nut-mua" href="mua-hang.html">${ICON.bag}<span class="chu">Mua hàng</span><span class="cart-count" hidden>0</span></a>
          <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="links">${ICON.menu}</button>
        </div>
      </header>`;
    }

    const footer = $("#site-footer");
    if (footer) {
      footer.outerHTML = `
      <footer class="site-footer">
        <div class="wrap footer-inner">
          <div class="footer-brand">
            <img src="images/logo.png" alt="">
            <div><b>${esc(S.name)}</b>${esc(S.tagline)} · ${esc(S.city)}</div>
          </div>
          <div>${esc(S.hours)} · Hotline <a href="tel:${S.hotline}">${S.hotline}</a> · <a href="${S.instagram}" target="_blank" rel="noopener">Instagram</a> · <a href="${S.facebook}" target="_blank" rel="noopener">Facebook</a></div>
        </div>
      </footer>
      <a class="fab" href="${S.messenger}" target="_blank" rel="noopener">${ICON.chat}<span class="chu">Tư vấn</span></a>`;
    }

    const menuBtn = $(".menu-toggle");
    menuBtn?.addEventListener("click", () => {
      const open = $("#links").classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.innerHTML = open ? ICON.close : ICON.menu;
    });

    const bar = $("#progress");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Trang có ảnh nền đầu trang: menu trong suốt cho tới khi cuộn qua ảnh
    const hero = $(".hero-anh");
    if (hero) {
      const nav = $("#nav");
      const sync = () => nav.classList.toggle("tren-anh", scrollY < hero.offsetHeight - 90 && !$("#links").classList.contains("open"));
      addEventListener("scroll", sync, { passive: true });
      menuBtn?.addEventListener("click", sync);
      sync();
    }
    updateCartCount();
  }

  // ---------- Hộp xem mẫu ----------
  function ensureModal() {
    let dlg = $("#product-modal");
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.id = "product-modal";
    dlg.className = "modal";
    document.body.appendChild(dlg);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    return dlg;
  }

  function openProduct(id) {
    const p = product(id);
    if (!p) return;
    const dlg = ensureModal();
    dlg.innerHTML = `
      <button class="modal-close" aria-label="Đóng">${ICON.close}</button>
      <div class="modal-body">
        ${thumb(p, "", `<span class="so">${p.no}</span>${p.gallery && p.gallery.length ? `<div class="anh-phu">${[p.image, ...p.gallery].map((src, i) =>
          `<button type="button" class="${i ? "" : "on"}" data-anh="${esc(src)}" aria-label="Ảnh ${i + 1}"><img src="${esc(src)}" alt=""></button>`).join("")}</div>` : ""}`)}
        <form class="modal-info" novalidate>
          <p class="eyebrow">Mẫu ${p.no} <span>${esc(labelOf(p))}</span></p>
          <h2>${esc(p.name)}</h2>
          <p class="desc">${esc(p.description)}</p>
          <div class="price-now">${SHOW_PRICES ? money(p.sizes[0].price) : `Giá: ${ASK_PRICE}`}</div>
          <div class="field">
            <span class="field-label">Kích thước</span>
            <div class="choice-group">
              ${p.sizes.map((s, i) => `<label class="choice"><input type="radio" name="size" value="${i}" ${i === 0 ? "checked" : ""}><span>${esc(s.label)}</span></label>`).join("")}
            </div>
          </div>
          <div class="field">
            <label for="m-note">Chữ viết trên bánh / ghi chú</label>
            <input id="m-note" class="input" name="note" maxlength="80" placeholder="VD: Happy Birthday Mẹ">
          </div>
          <div class="field">
            <span class="field-label">Số lượng</span>
            <div class="qty">
              <button type="button" data-step="-1" aria-label="Giảm">−</button>
              <input name="qty" type="number" min="1" max="20" value="1" aria-label="Số lượng">
              <button type="button" data-step="1" aria-label="Tăng">+</button>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-ghost" type="submit" value="add">+ Thêm vào giỏ</button>
            <button class="btn btn-primary" type="submit" value="buy">Mua ngay</button>
          </div>
        </form>
      </div>`;

    $$("[data-anh]", dlg).forEach((b) => b.addEventListener("click", () => {
      $(".modal-body > .thumb > img", dlg).src = b.dataset.anh;
      $$("[data-anh]", dlg).forEach((x) => x.classList.toggle("on", x === b));
    }));
    const form = $("form", dlg);
    const qtyInput = form.qty;
    if (SHOW_PRICES) form.addEventListener("change", () => { $(".price-now", dlg).textContent = money(p.sizes[+form.size.value].price); });
    $$("[data-step]", form).forEach((b) => b.addEventListener("click", () => {
      qtyInput.value = Math.min(20, Math.max(1, (+qtyInput.value || 1) + +b.dataset.step));
    }));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const qty = Math.min(20, Math.max(1, parseInt(qtyInput.value, 10) || 1));
      cart.add(p.id, +form.size.value, qty, form.note.value.trim());
      dlg.close();
      if (e.submitter && e.submitter.value === "buy") location.href = "mua-hang.html";
      else toast(`Đã thêm <b>${esc(p.name)}</b> vào giỏ <a href="mua-hang.html">Xem giỏ</a>`);
    });
    $(".modal-close", dlg).addEventListener("click", () => dlg.close());
    dlg.showModal();
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-open]");
    if (t) { e.preventDefault(); openProduct(t.dataset.open); }
  });

  // ---------- Các trang ----------
  const pages = {};

  pages.home = function () {
    const bsts = D.collections || [];

    // 01 · Bộ sưu tập: ảnh + caption từng BST
    $("#stories").innerHTML = bsts.map((c, i) => `
      <article class="story">
        <div class="story-img">
          <a class="bst-cover" href="${bstLink(c)}" aria-label="Xem BST ${esc(c.name)}"><img src="${esc(c.image)}" alt="BST ${esc(c.name)}" loading="lazy"></a>
        </div>
        <div class="story-text">
          <span class="story-so">BST ${String(i + 1).padStart(2, "0")} · ${esc(c.subtitle || "")}</span>
          <h2>${esc(c.name)}</h2>
          ${bstCaption(c)}
          <a class="text-link" href="${bstLink(c)}">Xem ${inBst(c).length} mẫu bánh trong BST →</a>
        </div>
      </article>`).join("");

    const open = isOpenNow();
    $("#visit").innerHTML = `
      <div class="visit-head">
        <h2>Ghé <em>Anela</em></h2>
        <p class="muted">${esc(S.tagline)}. Tiệm bánh online tại ${esc(S.city)}, nhận đặt bánh mỗi ngày.</p>
        <a class="btn btn-primary" href="tim-mau.html">Đặt bánh ngay</a>
      </div>
      <dl class="visit-list">
        ${S.address ? `<div>
          <dt>Địa chỉ</dt>
          <dd>${esc(S.address)}<small>Nhận bánh tại tiệm hoặc ship tận nơi</small></dd>
          ${S.mapUrl ? `<a class="text-link" href="${esc(S.mapUrl)}" target="_blank" rel="noopener">Chỉ đường →</a>` : "<span></span>"}
        </div>` : ""}
        <div>
          <dt>Giờ mở cửa</dt>
          <dd>${esc(S.hours)}</dd>
          <span class="status ${open ? "open" : ""}">${open ? `Đang mở, đóng lúc ${D.closeHour}:00` : `Đang đóng, mở lúc ${D.openHour}:00`}</span>
        </div>
        <div>
          <dt>Hotline · Zalo</dt>
          <dd><a href="tel:${S.hotline}">${S.hotline}</a></dd>
          <button class="chep" type="button" data-chep="${S.hotline}">Chép số</button>
        </div>
        <div>
          <dt>Đặt bánh</dt>
          <dd>Online only<small>Trên web, Zalo hoặc Messenger · cọc trước ${DEPOSIT_PCT}% tiền bánh</small></dd>
          <a class="text-link" href="${S.messenger}" target="_blank" rel="noopener">Nhắn tin →</a>
        </div>
        <div>
          <dt>Giao bánh</dt>
          <dd>Miễn phí ship dưới ${SHIP.freeKm}km<small>Tính từ tiệm · chỉ giao trong ${esc(SHIP.area)} · trên ${SHIP.freeKm}km phí ${money(SHIP.farFee)}</small></dd>
          <span></span>
        </div>
        <div>
          <dt>Instagram</dt>
          <dd>@anelahanoi${S.followers ? `<small>${esc(S.followers)} người theo dõi</small>` : ""}</dd>
          <a class="text-link" href="${S.instagram}" target="_blank" rel="noopener">Theo dõi →</a>
        </div>
      </dl>`;
  };

  // Thẻ BST: ảnh vuông, tên, dòng phụ, nút xem
  function tocCard(c) {
    return `<a class="toc-item" href="${bstLink(c)}">
      <img src="${esc(c.image)}" alt="BST ${esc(c.name)}" loading="lazy">
      <b>${esc(c.name)}</b>
      <small>${esc(c.subtitle || "")}</small>
      <span class="toc-btn">Xem ${inBst(c).length} mẫu bánh</span>
    </a>`;
  }

  // Caption BST: đoạn giới thiệu, các ý gạch đầu dòng, câu kết
  function bstCaption(c) {
    return `<p class="body">${esc(c.caption || "")}</p>
      ${c.points && c.points.length ? `<ul class="bst-points">${c.points.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      ${c.outro ? `<p class="origin">${esc(c.outro)}</p>` : ""}`;
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-chep]");
    if (b) copyText(b.dataset.chep, "Đã chép số điện thoại");
  });

  pages.collection = function () {
    const bsts = D.collections || [];
    const bst = collection(param("bst"));
    const area = $("#bst-area");

    if (bst) {
      // Trang riêng của một BST: ảnh bìa + caption + toàn bộ mẫu bánh
      document.title = `BST ${bst.name} – ${S.name}`;
      $(".page-hero").hidden = true;
      const list = inBst(bst);
      area.innerHTML = `
        <div class="bst-hero">
          <div class="bst-hero-img"><img src="${esc(bst.image)}" alt="BST ${esc(bst.name)}"></div>
          <div class="bst-hero-text">
            <div class="crumbs"><a href="bo-suu-tap.html">BST mẫu bánh</a> / ${esc(bst.name)}</div>
            <p class="kicker">${esc(bst.subtitle || "")}</p>
            <h1>${esc(bst.name)}</h1>
            ${bstCaption(bst)}
            <a class="btn btn-primary" href="#bst-cakes">Xem ${list.length} mẫu bánh ↓</a>
          </div>
        </div>
        <div class="rule" id="bst-cakes"><b>${list.length}</b> Mẫu bánh trong BST ${esc(bst.name)}</div>
        <div class="grid" style="margin-top:2rem">${list.length ? list.map(productCard).join("") : emptyState("Chưa có mẫu", "Anela đang cập nhật các mẫu của BST này.")}</div>
        <div class="rule">Bộ sưu tập khác <a class="text-link" href="bo-suu-tap.html">Tất cả BST →</a></div>
        <div class="toc" style="margin-top:2rem">${bsts.filter((c) => c !== bst).map(tocCard).join("")}</div>`;
      return;
    }

    // Trang tổng: chỉ hiện các BST
    area.innerHTML = bsts.length ? `
      <div class="bst-grid">${bsts.map((c, i) => `
        <a class="bst-card" href="${bstLink(c)}">
          <img src="${esc(c.image)}" alt="BST ${esc(c.name)}" loading="lazy">
          <span class="toc-so">BST ${String(i + 1).padStart(2, "0")} · ${inBst(c).length} mẫu</span>
          <b>${esc(c.name)}</b>
          <small>${esc(c.subtitle || "")}</small>
        </a>`).join("")}
      </div>` : "";
  };

  pages.search = function () {
    const form = $("#search-form");
    const input = form.q;

    // Gợi ý nhanh: những #tag hay gặp nhất, thêm một ví dụ tìm theo số mẫu
    const count = {};
    D.products.forEach((p) => p.tags.forEach((t) => { count[t] = (count[t] || 0) + 1; }));
    const hints = Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 8);
    $("#tim-goi").innerHTML = [...hints, "mẫu 05"].map((t) => `<button type="button" data-goi="${esc(t)}">${esc(t)}</button>`).join("");
    input.value = param("q") || "";

    function run() {
      const raw = input.value.trim();
      const words = norm(raw).split(/\s+/).filter(Boolean);
      const list = D.products.map((p) => {
        const hay = norm([`mau ${p.no}`, p.no, p.name, p.description, labelOf(p), p.tags.join(" ")].join(" "));
        const score = words.reduce((a, w) => a + (hay.includes(w) ? 1 : 0) + (norm(p.name).includes(w) ? 2 : 0) + (w === p.no ? 5 : 0), 0);
        return { p, score, ok: words.every((w) => hay.includes(w)) };
      }).filter((r) => r.ok);
      if (words.length) list.sort((a, b) => b.score - a.score);

      $("#result-count").textContent = raw ? `${list.length} mẫu phù hợp với “${raw}”.` : `Tất cả ${D.products.length} mẫu của tiệm.`;
      $("#search-grid").innerHTML = list.length
        ? list.map((r, i) => productCard(r.p, i)).join("")
        : emptyState("Không tìm thấy mẫu phù hợp", "Thử từ khoá khác, hoặc nhắn Anela để được tư vấn mẫu riêng.", `<a class="btn btn-primary btn-sm" href="${S.messenger}" target="_blank" rel="noopener">Nhắn tư vấn</a>`);
    }

    input.addEventListener("input", run);
    form.addEventListener("submit", (e) => { e.preventDefault(); run(); });
    $("#tim-goi").addEventListener("click", (e) => {
      const b = e.target.closest("[data-goi]");
      if (!b) return;
      input.value = b.dataset.goi;
      run();
    });
    run();
  };

  // --- Đơn hàng ---
  const orders = {
    all() { return store.get("anela_orders", []); },
    save(list) { store.set("anela_orders", list); }
  };

  // Giao bánh & tiền cọc (cài đặt trong data.js)
  const SHIP = D.shipping || { area: "Hà Nội", freeKm: 15, farFee: 30000, origin: [20.9912, 105.7547] };
  const DEPOSIT_RATE = D.depositRate ?? 0.5;
  const DEPOSIT_PCT = Math.round(DEPOSIT_RATE * 100);
  const fmtKm = (km) => `${km.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}km`;
  const shipLabel = (o) => (o.method !== "ship" ? "Nhận tại tiệm"
    : `${o.km != null ? `cách tiệm ~${fmtKm(o.km)} · ` : ""}${o.shipFar ? `phí ship ${money(SHIP.farFee)}` : "miễn phí ship"}`);

  // Khoảng cách đường thẳng (km) từ tiệm tới một điểm
  function kmFromShop(lat, lng) {
    const rad = (d) => (d * Math.PI) / 180;
    const [lat0, lng0] = SHIP.origin;
    const a = Math.sin(rad(lat - lat0) / 2) ** 2 + Math.cos(rad(lat0)) * Math.cos(rad(lat)) * Math.sin(rad(lng - lng0) / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(a));
  }

  function orderText(o) {
    const lines = o.items.map((i) => `- ${i.name} (${i.size}) x${i.qty}${SHOW_PRICES ? `: ${money(i.price * i.qty)}` : ""}${i.note ? ` | Chữ: ${i.note}` : ""}`);
    const tien = SHOW_PRICES && o.deposit != null ? [
      `Tiền bánh: ${money(o.subtotal)}`,
      `Phí ship: ${o.method === "ship" ? (o.shipFee ? money(o.shipFee) : "Miễn phí") : "Không"}`,
      `Tổng cộng: ${money(o.total)}`,
      `Cọc trước ${DEPOSIT_PCT}%: ${money(o.deposit)} · Còn lại khi nhận: ${money(o.total - o.deposit)}`
    ] : [SHOW_PRICES ? `Tạm tính: ${money(o.total)}` : "Giá: nhờ Anela báo giá giúp mình"];
    return [
      `ĐƠN HÀNG ${o.code} – ${S.name}`,
      ...lines,
      ...tien,
      `Khách: ${o.name} – ${o.phone}`,
      `Nhận bánh: ${o.method === "ship" ? `Giao tới ${o.address} (${shipLabel(o)})` : "Nhận tại tiệm"}`,
      `Thời gian: ${fmtDate(o.date)} (${o.slot})`,
      `Thanh toán phần còn lại: ${o.payment === "bank" ? "Chuyển khoản" : "Tiền mặt khi nhận"}`,
      o.notes ? `Ghi chú: ${o.notes}` : ""
    ].filter(Boolean).join("\n");
  }

  function sendButtons(o) {
    return `
      <button class="btn btn-ghost btn-sm" data-copy="${o.code}">Sao chép đơn</button>
      <a class="btn btn-primary btn-sm" href="${S.zalo}" target="_blank" rel="noopener" data-copy-then="${o.code}">Gửi qua Zalo</a>
      <a class="btn btn-primary btn-sm" href="${S.messenger}" target="_blank" rel="noopener" data-copy-then="${o.code}">Gửi qua Messenger</a>`;
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-copy]");
    const ct = e.target.closest("[data-copy-then]");
    const code = c ? c.dataset.copy : ct ? ct.dataset.copyThen : null;
    if (!code) return;
    const o = orders.all().find((x) => x.code === code);
    if (o) copyText(orderText(o));
  });

  pages.checkout = function () {
    const form = $("#checkout-form");
    const listEl = $("#cart-list");
    const success = $("#order-success");
    const shell = $("#checkout-shell");

    const today = new Date();
    const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() + D.minLeadDays);
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    form.date.min = iso(min);
    form.date.value = iso(min);
    form.slot.innerHTML = D.timeSlots.map((t) => `<option>${esc(t)}</option>`).join("");
    $("#lead-hint").textContent = `Đặt trước tối thiểu ${D.minLeadDays} ngày. Bánh cưới vui lòng đặt sớm hơn.`;

    const b = S.bank;
    if (b.accountNumber) {
      $("#bank-info").innerHTML = `<div class="bank-box"><b>Chuyển khoản:</b> ${esc(b.bankName)} · STK <b>${esc(b.accountNumber)}</b> · ${esc(b.accountName)}<br>Nội dung: mã đơn hàng.</div>`;
    }

    // Phường/xã giao tới (js/phuong-hanoi.js), chia nhóm miễn phí / có phí theo khoảng cách từ tiệm
    const wards = (window.ANELA_WARDS || [])
      .filter(([name]) => !SHIP.onlyPhuong || name.startsWith("Phường"))
      .map(([name, lat, lng]) => ({ name, km: kmFromShop(lat, lng) }))
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
    const option = (w) => `<option value="${esc(w.name)}">${esc(w.name)} · ~${fmtKm(w.km)}</option>`;
    $("#distance-field").innerHTML = `
      <label for="f-ward">Phường / xã giao tới <span class="req">*</span></label>
      <select id="f-ward" class="input" name="ward">
        <option value="">— Chọn phường / xã —</option>
        <optgroup label="Miễn phí ship · dưới ${SHIP.freeKm}km">${wards.filter((w) => w.km <= SHIP.freeKm).map(option).join("")}</optgroup>
        <optgroup label="Phí ship ${money(SHIP.farFee)} · trên ${SHIP.freeKm}km">${wards.filter((w) => w.km > SHIP.freeKm).map(option).join("")}</optgroup>
      </select>
      <p class="hint" id="ward-hint"></p>`;
    $("#pickup-hint").textContent = S.address ? `Địa chỉ tiệm: ${S.address}` : "";
    $("#deposit-hint").textContent = `Đơn bánh cần cọc trước ${DEPOSIT_PCT}% tiền bánh qua chuyển khoản để Anela giữ đơn. Phần còn lại thanh toán khi nhận bánh.`;

    const isShip = () => form.delivery.value === "ship";
    const ward = () => wards.find((w) => w.name === form.ward.value);
    const shipFee = () => (isShip() && ward() && ward().km > SHIP.freeKm ? SHIP.farFee : 0);

    function syncMethod() {
      $("#address-field").hidden = !isShip();
      $("#distance-field").hidden = !isShip();
      $("#pickup-hint").hidden = isShip();
      form.address.required = isShip();
      form.ward.required = isShip();
    }
    function syncWard() {
      const w = ward();
      $("#ward-hint").textContent = w
        ? `${w.name} cách tiệm khoảng ${fmtKm(w.km)} (đường thẳng) · ${w.km > SHIP.freeKm ? `phí ship ${money(SHIP.farFee)}` : "miễn phí ship"}.`
        : `Tính từ tiệm${S.address ? ` (${S.address})` : ""}: dưới ${SHIP.freeKm}km miễn phí, trên ${SHIP.freeKm}km phí ${money(SHIP.farFee)}. Anela chỉ giao trong ${SHIP.area}.`;
    }
    function renderSummary() {
      const sub = cart.total(), ship = shipFee(), deposit = Math.round(sub * DEPOSIT_RATE);
      $("#sum-ship").textContent = !isShip() ? "Nhận tại tiệm" : !ward() ? "Chọn phường / xã" : ship ? money(ship) : "Miễn phí";
      $("#sum-deposit-label").textContent = `Cọc trước ${DEPOSIT_PCT}% tiền bánh`;
      if (SHOW_PRICES) {
        $("#sum-sub").textContent = money(sub);
        $("#sum-total").textContent = money(sub + ship);
        $("#sum-deposit").textContent = money(deposit);
        $("#sum-rest").textContent = money(sub + ship - deposit);
      } else {
        $("#sum-sub").textContent = `${cart.count()} bánh`;
        ["#sum-total", "#sum-deposit", "#sum-rest"].forEach((s) => { $(s).textContent = "Liên hệ"; });
        $("#sum-note").textContent = `${ASK_PRICE} qua Zalo/Messenger.`;
      }
    }
    form.addEventListener("change", (e) => {
      if (e.target.name === "delivery") syncMethod();
      if (e.target.name === "ward") syncWard();
      if (e.target.name === "delivery" || e.target.name === "ward") renderSummary();
    });
    syncMethod();
    syncWard();

    function renderCart() {
      const items = cart.items();
      if (!items.length) {
        listEl.innerHTML = emptyState("Giỏ hàng đang trống", "Chọn mẫu bánh bạn thích từ bộ sưu tập nhé.", '<a class="btn btn-primary btn-sm" href="bo-suu-tap.html">Xem BST mẫu bánh</a>');
      } else {
        listEl.innerHTML = items.map((i, idx) => {
          const p = product(i.id), s = p.sizes[i.size];
          return `<div class="cart-item">
            ${thumb(p)}
            <div>
              <h3>${esc(p.name)} <small class="muted">· Mẫu ${p.no}</small></h3>
              <p class="meta">${esc(s.label)}${SHOW_PRICES ? ` · ${money(s.price)}` : ""}</p>
              ${i.note ? `<p class="meta">Chữ: “${esc(i.note)}”</p>` : ""}
              <div style="display:flex;gap:14px;align-items:center;margin-top:8px">
                <div class="qty">
                  <button type="button" data-qty="${idx}" data-step="-1" aria-label="Giảm">−</button>
                  <input value="${i.qty}" readonly aria-label="Số lượng">
                  <button type="button" data-qty="${idx}" data-step="1" aria-label="Tăng">+</button>
                </div>
                <button type="button" class="link-btn" data-remove="${idx}">Xoá</button>
              </div>
            </div>
            <div class="line-price">${SHOW_PRICES ? money(s.price * i.qty) : ""}</div>
          </div>`;
        }).join("");
      }
      renderSummary();
      $("#submit-order").disabled = !items.length;
    }

    listEl.addEventListener("click", (e) => {
      const items = cart.items();
      const q = e.target.closest("[data-qty]");
      const r = e.target.closest("[data-remove]");
      if (q) {
        const it = items[+q.dataset.qty];
        it.qty = Math.min(20, it.qty + +q.dataset.step);
        if (it.qty < 1) items.splice(+q.dataset.qty, 1);
      } else if (r) {
        items.splice(+r.dataset.remove, 1);
      } else return;
      cart.save(items);
      renderCart();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = form.phone.value.replace(/\s|\./g, "");
      form.phone.setCustomValidity(/^(\+84|0)\d{9,10}$/.test(phone) ? "" : "Số điện thoại chưa đúng");
      if (!form.reportValidity()) return;
      const items = cart.items();
      if (!items.length) return;

      const o = {
        code: "AN" + Date.now().toString(36).slice(-6).toUpperCase(),
        createdAt: new Date().toISOString(),
        status: "Chờ xác nhận",
        name: form.fullname.value.trim(),
        phone,
        method: form.delivery.value,
        address: isShip() ? `${form.address.value.trim()}, ${ward().name}` : "",
        km: isShip() ? Math.round(ward().km * 10) / 10 : null,
        shipFar: shipFee() > 0,
        date: form.date.value,
        slot: form.slot.value,
        payment: form.payment.value,
        notes: form.notes.value.trim(),
        items: items.map((i) => { const p = product(i.id); const s = p.sizes[i.size]; return { id: p.id, name: p.name, size: s.label, price: s.price, qty: i.qty, note: i.note }; }),
        subtotal: SHOW_PRICES ? cart.total() : 0,
        shipFee: shipFee(),
        total: SHOW_PRICES ? cart.total() + shipFee() : 0,
        deposit: SHOW_PRICES ? Math.round(cart.total() * DEPOSIT_RATE) : 0
      };
      orders.save([o, ...orders.all()]);
      store.set("anela_phone", phone);
      cart.save([]);
      sendToSheet({ type: "order", ...o });

      shell.hidden = true;
      success.hidden = false;
      success.innerHTML = `<div class="success panel">
        <div class="tick">✓</div>
        <h2>Cảm ơn ${esc(o.name)}!</h2>
        <p>Đơn hàng của bạn đã được tạo với mã</p>
        <div class="order-code">${o.code}</div>
        ${SHOW_PRICES ? `<p class="coc-box">Tổng cộng <b>${money(o.total)}</b> · Cọc trước ${DEPOSIT_PCT}%: <b>${money(o.deposit)}</b></p>` : ""}
        <p><b>Bước cuối:</b> bấm gửi đơn cho Anela qua Zalo hoặc Messenger (nội dung đơn đã tự sao chép, bạn chỉ cần dán vào tin nhắn). Anela sẽ xác nhận đơn và gửi thông tin chuyển khoản cọc; đơn được giữ sau khi Anela nhận cọc.</p>
        <div class="send-actions">${sendButtons(o)}</div>
        <pre>${esc(orderText(o))}</pre>
        <p style="margin-top:1rem"><a href="don-hang.html">Xem đơn hàng của tôi</a> · Cần gấp? Gọi <a href="tel:${S.hotline}">${S.hotline}</a></p>
      </div>`;
      copyText(orderText(o));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const saved = store.get("anela_phone", "");
    if (saved) form.phone.value = saved;
    renderCart();
  };

  pages.orders = function () {
    const form = $("#lookup-form");
    const out = $("#orders-list");

    function card(o) {
      return `<article class="order-card">
        <div class="order-head">
          <h3>Đơn ${o.code}</h3>
          <span class="status ${o.status === "Hoàn thành" ? "open" : ""}">${esc(o.status)}</span>
        </div>
        <ul class="order-lines">${o.items.map((i) => `<li><span>${esc(i.name)} · ${esc(i.size)} × ${i.qty}${i.note ? ` <small>(“${esc(i.note)}”)</small>` : ""}</span><b>${SHOW_PRICES ? money(i.price * i.qty) : ""}</b></li>`).join("")}</ul>
        <div class="order-meta">
          <span>Đặt lúc: <b>${new Date(o.createdAt).toLocaleString("vi-VN")}</b></span>
          <span>Nhận bánh: <b>${fmtDate(o.date)} · ${esc(o.slot)}</b></span>
          <span>Hình thức: <b>${o.method === "ship" ? `Giao tận nơi · ${shipLabel(o)}` : "Nhận tại tiệm"}</b></span>
          <span>Phần còn lại: <b>${o.payment === "bank" ? "Chuyển khoản" : "Tiền mặt"}</b></span>
          ${o.address ? `<span>Địa chỉ: <b>${esc(o.address)}</b></span>` : ""}
        </div>
        <div class="order-foot">
          <div>${SHOW_PRICES ? `Tổng cộng: <b style="color:var(--accent)">${money(o.total)}</b>${o.deposit ? `<br><small class="muted">Cọc trước ${DEPOSIT_PCT}%: ${money(o.deposit)}</small>` : ""}` : `<span class="muted">Giá: ${ASK_PRICE}</span>`}</div>
          <div class="send-actions">
            <button class="btn btn-ghost btn-sm" data-reorder="${o.code}">Đặt lại</button>
            ${sendButtons(o)}
          </div>
        </div>
      </article>`;
    }

    function render(list, heading) {
      $("#orders-heading").textContent = heading;
      out.innerHTML = list.length ? list.map(card).join("")
        : emptyState("Chưa tìm thấy đơn hàng", "Đơn đặt trên web được lưu trên thiết bị bạn đã đặt. Nếu bạn đặt qua Facebook/Zalo, hãy nhắn Anela để kiểm tra.", '<a class="btn btn-primary btn-sm" href="bo-suu-tap.html">Đặt bánh ngay</a>');
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = form.q.value.trim().toUpperCase().replace(/\s|\./g, "");
      if (!q) { render(orders.all(), "Đơn hàng trên thiết bị này"); return; }
      render(orders.all().filter((o) => o.code === q || o.phone === q), `Kết quả cho “${form.q.value.trim()}”`);
    });

    out.addEventListener("click", (e) => {
      const b = e.target.closest("[data-reorder]");
      if (!b) return;
      const o = orders.all().find((x) => x.code === b.dataset.reorder);
      let added = 0;
      o.items.forEach((i) => {
        const p = product(i.id);
        const idx = p ? p.sizes.findIndex((s) => s.label === i.size) : -1;
        if (idx >= 0) { cart.add(p.id, idx, i.qty, i.note); added++; }
      });
      toast(added ? `Đã thêm lại vào giỏ <a href="mua-hang.html">Thanh toán</a>` : "Mẫu bánh trong đơn này không còn bán");
    });

    render(orders.all(), "Đơn hàng trên thiết bị này");
  };

  // --- Đánh giá ---
  function allReviews() {
    return [...store.get("anela_reviews", []), ...D.reviews].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }

  function reviewCard(r) {
    const p = r.product && product(r.product);
    return `<article class="review">
      <div class="review-head"><b>${esc(r.name)}</b><small>${fmtDate(r.date)}</small></div>
      ${stars(r.rating)}
      ${p ? `<div class="about-product">Đã mua: ${esc(p.name)}</div>` : ""}
      <p>${esc(r.text)}</p>
    </article>`;
  }

  pages.reviews = function () {
    const form = $("#review-form");
    form.product.innerHTML = `<option value="">— Không chọn —</option>` + D.products.map((p) => `<option value="${p.id}">Mẫu ${p.no} – ${esc(p.name)}</option>`).join("");

    function render() {
      const list = allReviews();
      const n = list.length;
      const avg = n ? list.reduce((a, r) => a + r.rating, 0) / n : 0;
      $("#rating-summary").innerHTML = n ? `
        <div class="rating-big grad">${avg.toFixed(1)}</div>
        ${stars(avg)}
        <p class="muted" style="margin-top:6px">${n} đánh giá</p>
        <div class="dist">${[5, 4, 3, 2, 1].map((s) => {
          const c = list.filter((r) => r.rating === s).length;
          return `<div class="dist-row"><span>${s} ★</span><span class="dist-bar"><i style="width:${(c / n) * 100}%"></i></span><span>${c}</span></div>`;
        }).join("")}</div>`
        : `<div class="rating-big grad">–</div><p class="muted">Chưa có đánh giá nào</p>`;
      $("#review-list").innerHTML = n ? list.map(reviewCard).join("")
        : emptyState("Hãy là người đầu tiên đánh giá", "Cảm nhận của bạn giúp Anela làm bánh ngon hơn mỗi ngày.");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const r = {
        name: form.fullname.value.trim(),
        rating: +form.rating.value,
        product: form.product.value,
        text: form.text.value.trim(),
        date: new Date().toISOString().slice(0, 10)
      };
      store.set("anela_reviews", [r, ...store.get("anela_reviews", [])]);
      sendToSheet({ type: "review", ...r });
      form.reset();
      render();
      toast("Cảm ơn bạn đã đánh giá Anela!");
    });
    render();
  };

  // ---------- Khởi động ----------
  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    renderLayout(page);
    if (pages[page]) pages[page]();
    const openId = param("mau");
    if (openId && product(openId)) openProduct(openId);
  });
})();
