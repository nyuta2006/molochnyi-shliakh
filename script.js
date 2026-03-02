"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const orderBtn = $(".btn-order");

  const orderModal = document.createElement("div");
  orderModal.className = "order-modal";
  orderModal.innerHTML = `
    <div class="order-backdrop" data-close="1"></div>

    <div class="order-dialog" role="dialog" aria-modal="true" aria-label="Оформлення замовлення">
      <button class="order-close" type="button" aria-label="Закрити" data-close="1">×</button>

      <div class="order-head">
        <div class="order-title">Оформлення замовлення</div>
        <div class="order-sub">Мінімум зайвого — максимум сиру 🧀</div>
      </div>

      <form class="order-form" autocomplete="on">
        <div class="order-grid">
          <label class="order-field">
            <span>Ім’я</span>
            <input name="name" type="text" placeholder="Анна" required>
          </label>

          <label class="order-field">
            <span>Телефон</span>
            <input name="phone" type="tel" placeholder="+380..." required>
          </label>

          <label class="order-field">
            <span>Місто</span>
            <input name="city" type="text" placeholder="Київ" required>
          </label>

          <label class="order-field">
            <span>Доставка</span>
            <select name="delivery" required>
              <option value="" selected disabled>Оберіть спосіб</option>
              <option value="np">Нова пошта</option>
              <option value="ukr">Укрпошта</option>
              <option value="courier">Кур’єр (де доступно)</option>
            </select>
          </label>

          <label class="order-field order-field--full">
            <span>Що замовляєте</span>
            <textarea name="items" rows="4" placeholder="Напр.: Гауда 300г — 2 шт, Бринза 250г — 1 шт" required></textarea>
          </label>

          <label class="order-field order-field--full">
            <span>Коментар</span>
            <textarea name="comment" rows="2" placeholder="Напр.: без дзвінка / доставити після 18:00"></textarea>
          </label>
        </div>

        <div class="order-actions">
          <button class="order-submit" type="submit">Підтвердити (демо)</button>
          <button class="order-cancel" type="button" data-close="1">Скасувати</button>
        </div>

        <div class="order-status" aria-live="polite"></div>
      </form>
    </div>
  `;
  document.body.appendChild(orderModal);

  const openOrder = () => {
    orderModal.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    const firstInput = $(".order-form input[name='name']", orderModal);
    if (firstInput) firstInput.focus();
  };

  const closeOrder = () => {
    orderModal.classList.remove("open");
    document.documentElement.style.overflow = "";
    if (orderBtn) orderBtn.focus();
  };

  if (orderBtn) {
    orderBtn.addEventListener("click", (e) => {
      e.preventDefault(); 
      openOrder();
    });
  }

  orderModal.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.dataset && t.dataset.close) closeOrder();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && orderModal.classList.contains("open")) closeOrder();
  });

  const form = $(".order-form", orderModal);
  const status = $(".order-status", orderModal);

  const setStatus = (text, ok = false) => {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("ok", ok);
    status.classList.toggle("bad", !ok);
  };

  const looksLikeUAphone = (s) => {
    const digits = (s || "").replace(/\D/g, "");
    return digits.length === 12 || digits.length === 10;
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const name = (fd.get("name") || "").toString().trim();
      const phone = (fd.get("phone") || "").toString().trim();
      const city = (fd.get("city") || "").toString().trim();
      const delivery = (fd.get("delivery") || "").toString().trim();
      const items = (fd.get("items") || "").toString().trim();

      if (!name || !phone || !city || !delivery || !items) {
        setStatus("Заповни обов’язкові поля — і буде сирне щастя 🙂", false);
        return;
      }
      if (!looksLikeUAphone(phone)) {
        setStatus("Телефон виглядає підозріло. Формат типу +380… або 0…", false);
        return;
      }

      setStatus("Прийнято! Це демо-форма: тут можна підключити Telegram/Email/API.", true);
      form.reset();

      setTimeout(closeOrder, 1200);
    });
  }
});