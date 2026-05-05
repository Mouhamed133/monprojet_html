let cart = [];

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');    
    const allProductCards = document.querySelectorAll('#produits .product-card');

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();

        allProductCards.forEach(card => {
            const name = card.querySelector('h4').textContent.toLowerCase();
            card.style.display = name.includes(query) ? 'block' : 'none';
        });
    });

    // Boutons "Ajouter au panier"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = productCard.querySelector('.price').textContent;

            // Ajouter au panier
            cart.push({ name: productName, price: productPrice });

            updateCartCount();
            showNotification(`${productName} ajouté au panier !`);
        });
    });

    // Navigation active
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// Affiche ou cache les sections
function changerSection(section) {
    const accueil = document.getElementById('Accueil');
    const produits = document.getElementById('produits');
    const panier = document.getElementById('panier');
    const temoignages = document.getElementById('temoignages');

    if (section === "Accueil") {
        accueil.style.display = 'block';
        produits.style.display = 'none';
        panier.style.display = 'none';
        temoignages.style.display = 'block';
    } else if (section === "produits") {
        accueil.style.display = 'none';
        produits.style.display = 'block';
        panier.style.display = 'none';
        temoignages.style.display = 'none';
    } else {
        accueil.style.display = 'none';
        produits.style.display = 'none';
        panier.style.display = 'block';
        temoignages.style.display = 'none';
        afficherPanier();
    }
}

// Fonction pour afficher le panier
function afficherPanier() {
    const tbody = document.querySelector('.table tbody');
    tbody.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        const priceValue = parseInt(item.price.replace(/\D/g, ''));
        total += priceValue;

        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
            </tr>
        `;
    });

    tbody.innerHTML += `
        <tr>
            <td><strong>Total</strong></td>
            <td><strong>${total.toLocaleString()} FCFA</strong></td>
        </tr>
    `;

    // Ajoute le bouton de validation sous le tableau
    let validateBtn = document.getElementById('validate-order-btn');
    if (!validateBtn) {
        validateBtn = document.createElement('button');
        validateBtn.id = 'validate-order-btn';
        validateBtn.textContent = 'Valider la commande et télécharger la facture';
        validateBtn.style.marginTop = '15px '; 
        validateBtn.style.padding = '10px 20px';
        validateBtn.style.backgroundColor = '#28a745'; // Couleur verte
        validateBtn.style.color = '#fff'; // Couleur du texte
        validateBtn.style.border = 'none';
        validateBtn.style.borderRadius = '5px';
        validateBtn.style.cursor = 'pointer';
        validateBtn.style.fontSize = '16px';
        validateBtn.style.height = '50px';
        validateBtn.onclick = telechargerFacture;
        // Ajoute le bouton après le tableau
        const table = tbody.parentElement;
        table.parentElement.appendChild(validateBtn);
    }
}

// Fonction pour générer et afficher la facture HTML dans un nouvel onglet
function telechargerFacture() {
    if (cart.length === 0) {
        showNotification("Votre commande a été validée !");
        return;
    }

    let total = 0;
    let factureHTML = `
        <html>
        <head>
            <title>Facture MomoShop</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 2rem; color: #122df6; }
                h1 { color: #e65c00; }
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f0f0ff; }
                tfoot td { font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Facture de commande</h1>
            <p>Date : ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr><th>Produit</th><th>Prix</th></tr>
                </thead>
                <tbody>`;

    cart.forEach(item => {
        factureHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.price}</td>
                    </tr>`;
        total += parseInt(item.price.replace(/\D/g, ''));
    });

    factureHTML += `
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total</td>
                        <td>${total.toLocaleString()} FCFA</td>
                    </tr>
                </tfoot>
            </table>
            <p>Merci pour votre achat chez MomoShop !</p>
        </body>
        </html>
    `;

   const blob = new Blob([factureHTML], { type: 'text/html' });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'facture_MomoTech.html';
a.click();

URL.revokeObjectURL(url);

    
}

// Mise à jour du compteur
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
}

// Notification
function showNotification(message) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('show');

    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

// Vider le panier
function viderPanier() {
    cart = [];
    updateCartCount();
    afficherPanier();
    showNotification("Panier vidé !");
}
