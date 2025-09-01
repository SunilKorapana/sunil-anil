document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("product-popup");
  const popupBody = document.getElementById("popup-body");
  const popupClose = document.getElementById("popup-close");

  // Open popup
  document.querySelectorAll(".open-popup").forEach(button => {
    button.addEventListener("click", async () => {
      const handle = button.dataset.handle;

      // Fetch product data via Shopify JSON endpoint
      const res = await fetch(`/products/${handle}.js`);
      const product = await res.json();

      // Build popup content
      popupBody.innerHTML = `
        <h2>${product.title}</h2>
        <p>${(product.price / 100).toFixed(2)} ${Shopify.currency.active}</p>
        <p>${product.description}</p>
        <select id="variant-select">
          ${product.variants.map(v => `<option value="${v.id}">${v.title}</option>`).join("")}
        </select>
        <button id="add-to-cart">Add to Cart</button>
      `;

      popup.classList.remove("hidden");

      // Add to cart
      document.getElementById("add-to-cart").addEventListener("click", async () => {
        const variantId = document.getElementById("variant-select").value;

        // Add main product
        await fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: variantId, quantity: 1 })
        });

        // Special rule: if Black + Medium → also add Soft Winter Jacket
        const variant = product.variants.find(v => v.id == variantId);
        if (variant.title.includes("Black") && variant.title.includes("Medium")) {
          // Replace with your actual jacket variant ID
          const jacketId = 1234567890; 
          await fetch("/cart/add.js", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: jacketId, quantity: 1 })
          });
        }

        alert("Added to cart!");
      });
    });
  });

  // Close popup
  popupClose.addEventListener("click", () => {
    popup.classList.add("hidden");
  });
});
