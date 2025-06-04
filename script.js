const updateBtn = document.getElementById('updateBtn');
const formSection = document.getElementById('formSection');
const productForm = document.getElementById('productForm');
const productsContainer = document.getElementById('productsContainer');

// Показати/приховати форму додавання товару
updateBtn.addEventListener('click', () => {
  formSection.style.display = formSection.style.display === 'none' ? 'block' : 'none';
});

// Обробка форми додавання товару
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('productName').value;
  const price = document.getElementById('productPrice').value;
  const description = document.getElementById('productDescription').value;
  const specs = document.getElementById('productSpecs').value;
  const reviews = document.getElementById('productReviews').value;
  const imageInput = document.getElementById('productImage');
  const image = imageInput.files[0];

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageUrl = event.target.result;

    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <img src="${imageUrl}" alt="${name}" style="max-width:150px" />
      <h3>${name}</h3>
      <p><strong>Ціна:</strong> ${price} грн</p>
      <p><strong>Опис:</strong> ${description}</p>
      <p><strong>Характеристики:</strong> ${specs}</p>
      <p><strong>Відгуки:</strong> ${reviews}</p>
    `;

    productsContainer.appendChild(productCard);
    productForm.reset();
    formSection.style.display = 'none';
  };

  if (image) {
    reader.readAsDataURL(image);
  }
});

// Логін адміна
const ADMIN_LOGIN = "admin";
const ADMIN_PASS = "1234";
const isAdmin = localStorage.getItem("isAdmin") === "true";

window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginMsg = document.getElementById("login-message");

  if (isAdmin) {
    if (loginForm) loginForm.style.display = "none";
    document.getElementById("admin-login").style.display = "none";
    showAdminControls();
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (username === ADMIN_LOGIN && password === ADMIN_PASS) {
        localStorage.setItem("isAdmin", "true");
        loginMsg.textContent = "Вхід успішний!";
        loginForm.style.display = "none";
        document.getElementById("admin-login").style.display = "none";
        showAdminControls();
      } else {
        loginMsg.textContent = "Невірний логін або пароль.";
      }
    });
  }
});

// Функція для показу кнопки "Оновити інформацію"
function showAdminControls() {
  document.getElementById("updateBtn").style.display = "inline-block";
}

// Гаряча клавіша: Ctrl + Alt + L
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
    const loginSection = document.getElementById("admin-login");
    if (loginSection) {
      loginSection.style.display = "block";
      loginSection.scrollIntoView({ behavior: "smooth" });
    }
  }
});
