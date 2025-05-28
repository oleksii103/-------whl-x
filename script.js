const content = document.getElementById('content');
const links = document.querySelectorAll('nav a');

const tabs = {
    home: `
        <h1>Ласкаво просимо!</h1>
        <p>Оновлюйте контент, додавайте товари та управляйте сайтом без змін у коді.</p>
        <button id="updateBtn" type="button">Оновити інформацію</button>
    `,
    about: `
        <h1>Про нас</h1>
        <p>Ми — команда розробників, що створює сучасні веб-рішення для бізнесу та особистих потреб. Наша мета — зробити керування сайтом простим і зручним.</p>
    `,
    contact: `
        <h1>Контакти</h1>
        <p>Зв'яжіться з нами:</p>
        <ul>
            <li>Електронна пошта: info@example.com</li>
            <li>Телефон: +380 12 345 67 89</li>
            <li>Адреса: м. Київ, вул. Прикладна, 1</li>
        </ul>
    `,
    catalog: `
        <h1>Каталог</h1>
        <p>Каталог ще у розробці. Слідкуйте за оновленнями!</p>
    `
};

links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = e.target.getAttribute('data-tab');
        if (tab && tabs[tab]) {
            content.innerHTML = tabs[tab];
        }
    });
});
