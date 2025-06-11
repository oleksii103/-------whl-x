const ADMIN_LOGIN = "admin";
const ADMIN_PASS = "1234";
const isAdmin = localStorage.getItem("isAdmin") === "true";

document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
  }

  updateCartCount();

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart')) {
      const productCard = e.target.closest('.product-card');
      const productId = Date.now().toString(); // або унікальний ID
      const productName = productCard.querySelector('h3').textContent;
      const productPrice = productCard.querySelector('.price').textContent;
      const productImage = productCard.querySelector('img').src;

      addToCart({
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1
      });

      updateCartCount();

      e.target.textContent = 'Додано!';
      setTimeout(() => {
        e.target.textContent = 'В кошик';
      }, 1000);
    }

    if (e.target.classList.contains('quantity-btn')) {
      const cartItem = e.target.closest('.cart-item');
      const productId = cartItem.getAttribute('data-id');
      const quantityElement = cartItem.querySelector('.quantity');
      let quantity = parseInt(quantityElement.textContent);

      if (e.target.classList.contains('minus') && quantity > 1) {
        quantity--;
      } else if (e.target.classList.contains('plus')) {
        quantity++;
      }

      quantityElement.textContent = quantity;
      updateCartItem(productId, quantity);
      updateCartSummary();
    }

    if (e.target.classList.contains('remove-item')) {
      const cartItem = e.target.closest('.cart-item');
      const productId = cartItem.getAttribute('data-id');
      removeFromCart(productId);
      cartItem.remove();
      updateCartSummary();
      updateCartCount();
    }
  });

  if (document.querySelector('.cart-main')) {
    renderCartItems();
    updateCartSummary();
  }

  if (document.getElementById('login-form')) {
    const loginForm = document.getElementById('login-form');
    const loginMsg = document.getElementById('login-message');

    if (isAdmin) {
      loginForm.style.display = 'none';
      document.getElementById('admin-login').style.display = 'none';
      showAdminControls();
    }

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      if (username === ADMIN_LOGIN && password === ADMIN_PASS) {
        localStorage.setItem('isAdmin', 'true');
        loginMsg.textContent = 'Вхід успішний!';
        loginForm.style.display = 'none';
        showAdminControls();
      } else {
        loginMsg.textContent = 'Невірний логін або пароль.';
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
      const loginSection = document.getElementById('admin-login');
      if (loginSection) {
        loginSection.style.display = 'block';
        loginSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  if (document.getElementById('productForm')) {
    const productForm = document.getElementById('productForm');
    const productsContainer = document.getElementById('productsContainer');
    const updateBtn = document.getElementById('updateBtn');
    const formSection = document.getElementById('formSection');

    updateBtn.addEventListener('click', () => {
      formSection.style.display = formSection.style.display === 'none' ? 'block' : 'none';
    });

    productForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('productName').value;
      const price = document.getElementById('productPrice').value;
      const description = document.getElementById('productDescription').value;
      const specs = document.getElementById('productSpecs').value;
      const reviews = document.getElementById('productReviews').value;
      const imageInput = document.getElementById('productImage');
      const image = imageInput.files[0];

      const reader = new FileReader();
      reader.onload = function (event) {
        const productData = {
          name,
          price,
          description,
          specs,
          reviews,
          image: event.target.result
        };

        addProductCard(productData);
        saveProduct(productData);
        productForm.reset();
        formSection.style.display = 'none';
      };

      if (image) {
        reader.readAsDataURL(image);
      }
    });

    function addProductCard(product) {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p><strong>Ціна:</strong> <span class="price">${product.price}</span> грн</p>
        <p><strong>Опис:</strong> ${product.description}</p>
        <p><strong>Характеристики:</strong> ${product.specs}</p>
        <p><strong>Відгуки:</strong> ${product.reviews}</p>
        <button class="add-to-cart" data-id="${Date.now()}">В кошик</button>
      `;
      productsContainer.appendChild(productCard);
    }

    function saveProduct(product) {
      let products = JSON.parse(localStorage.getItem('products')) || [];
      products.push(product);
      localStorage.setItem('products', JSON.stringify(products));
    }

    function loadProducts() {
      const products = JSON.parse(localStorage.getItem('products')) || [];
      products.forEach(addProductCard);
    }

    loadProducts();
  }
});

// --- Кошик ---
function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(product);
  }

  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartItem(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = count;
  });
}

function renderCartItems() {
  const cartItemsContainer = document.querySelector('.cart-items');
  const cart = getCart();

  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Ваш кошик порожній</p>';
    return;
  }

  cartItemsContainer.innerHTML = '';
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>Ціна: ${item.price}</p>
      </div>
      <div class="item-price">
        <span class="price">${parseInt(item.price.replace(/\D/g, '')) * item.quantity} грн</span>
        <div class="quantity-control">
          <button class="quantity-btn minus">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn plus">+</button>
        </div>
        <button class="remove-item">Видалити</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
}

function updateCartSummary() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => {
    return sum + (parseInt(item.price.replace(/\D/g, '')) * item.quantity);
  }, 0);

  const delivery = subtotal > 0 ? 1000 : 0;
  const total = subtotal + delivery;

  if (document.querySelector('.cart-summary')) {
    document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `${subtotal} грн`;
    document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `${delivery} грн`;
    document.querySelector('.summary-row.total span:last-child').textContent = `${total} грн`;
  }
}

// --- Адмін ---
function showAdminControls() {
  const updateBtn = document.getElementById('updateBtn');
  if (updateBtn) updateBtn.style.display = 'inline-block';

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'logout-btn';
  logoutBtn.textContent = 'Вийти';
  logoutBtn.onclick = () => {
    localStorage.setItem('isAdmin', 'false');
    location.reload();
  };

  const headerButtons = document.querySelector('.header-buttons');
  if (headerButtons) {
    const existingLogout = headerButtons.querySelector('.logout-btn');
    if (existingLogout) existingLogout.remove();
    headerButtons.appendChild(logoutBtn);
  }
if (document.querySelector('.checkout-form')) {
  const checkoutForm = document.querySelector('.checkout-form');
  const summaryItems = document.querySelector('.summary-items');
  const totalPrice = document.querySelector('.total-price');
  
  function updateOrderSummary() {
    const cart = getCart();
    let subtotal = 0;
    let deliveryCost = 0;
    
    summaryItems.innerHTML = '';
    
    cart.forEach(item => {
      const itemTotal = parseInt(item.price.replace(/\D/g, '')) * item.quantity;
      subtotal += itemTotal;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'summary-item';
      itemElement.innerHTML = `
        <span>${item.name} x${item.quantity}</span>
        <span>${itemTotal} грн</span>
      `;
      summaryItems.appendChild(itemElement);
    });
    
    const deliveryMethod = document.getElementById('delivery-method').value;
    if (deliveryMethod === 'courier') {
      deliveryCost = 500;
    }
    
    totalPrice.textContent = `${subtotal + deliveryCost} грн`;
  }
  
  document.getElementById('delivery-method').addEventListener('change', updateOrderSummary);
  
  updateOrderSummary();
  
  checkoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      customer: {
        name: document.getElementById('fullname').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
      },
      delivery: {
        method: document.getElementById('delivery-method').value,
        address: document.getElementById('address').value
      },
      payment: document.querySelector('input[name="payment"]:checked').value,
      comments: document.getElementById('comments').value,
      items: getCart(),
      total: totalPrice.textContent
    };
    
    console.log('Замовлення оформлено:', formData);
    
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    
    window.location.href = 'thank-you.html';
  });
}

if (document.getElementById('logout-btn')) {
  document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.setItem('isAdmin', 'false');
    window.location.href = 'index.html';
  });
}
const settingsForm = document.getElementById('settingsForm');
const settingsMessage = document.getElementById('settingsMessage');

document.addEventListener('DOMContentLoaded', function() {
  const savedSettings = JSON.parse(localStorage.getItem('adminSettings')) || {
    login: 'admin',
    password: 'admin'
  };
  
  document.getElementById('adminLogin').value = savedSettings.login;
});

settingsForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const login = document.getElementById('adminLogin').value;
  const newPassword = document.getElementById('adminPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  
  if (newPassword && newPassword !== confirmPassword) {
    showSettingsMessage('Паролі не співпадають', 'error');
    return;
  }
  
  const currentSettings = JSON.parse(localStorage.getItem('adminSettings')) || {
    login: 'admin',
    password: 'admin'
  };
  
  const updatedSettings = {
    login: login,
    password: newPassword || currentSettings.password // Якщо новий пароль не введено, залишаємо старий
  };
  
  localStorage.setItem('adminSettings', JSON.stringify(updatedSettings));
  
  document.getElementById('adminPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  
  showSettingsMessage('Налаштування успішно збережено!', 'success');
});

function showSettingsMessage(text, type) {
  settingsMessage.textContent = text;
  settingsMessage.className = 'message ' + type;
  settingsMessage.style.display = 'block';
  
  setTimeout(() => {
    settingsMessage.style.display = 'none';
  }, 3000);
}
}
