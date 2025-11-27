// Variables globales para carritos
let ticketCart = [];
let packageCart = [];
let ticketTotal = 0;
let packageTotal = 0;

// Función para mostrar secciones
function showSection(sectionName) {
    // Ocultar menú principal
    document.getElementById('main-menu').style.display = 'none';
    
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-area');
    sections.forEach(section => section.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Configurar fecha mínima para boletos
    if (sectionName === 'tickets') {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('visitDate').min = today;
    }
}

// Función para volver al menú principal
function showMainMenu() {
    document.getElementById('main-menu').style.display = 'grid';
    const sections = document.querySelectorAll('.content-area');
    sections.forEach(section => section.classList.remove('active'));
}

// Función para actualizar precio de boletos
function updateTicketPrice() {
    const parkSelect = document.getElementById('parkSelect');
    const ticketType = document.getElementById('ticketType');
    const quantity = parseInt(document.getElementById('ticketQuantity').value);
    
    if (parkSelect.value) {
        const basePrice = parseInt(parkSelect.selectedOptions[0].getAttribute('data-price'));
        const multiplier = parseFloat(ticketType.selectedOptions[0].getAttribute('data-multiplier'));
        const totalPrice = Math.round(basePrice * multiplier * quantity);
        
        document.getElementById('ticketPrice').style.display = 'block';
        document.getElementById('ticketPrice').innerHTML = `<strong>Precio total: $${totalPrice} MXN</strong>`;
    }
}

// Función para agregar boleto al carrito
function addTicketToCart() {
    const parkSelect = document.getElementById('parkSelect');
    const ticketType = document.getElementById('ticketType');
    const quantity = parseInt(document.getElementById('ticketQuantity').value);
    const visitDate = document.getElementById('visitDate').value;
    
    if (!parkSelect.value || !visitDate) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const basePrice = parseInt(parkSelect.selectedOptions[0].getAttribute('data-price'));
    const multiplier = parseFloat(ticketType.selectedOptions[0].getAttribute('data-multiplier'));
    const totalPrice = Math.round(basePrice * multiplier * quantity);
    
    const ticket = {
        park: parkSelect.selectedOptions[0].text,
        type: ticketType.selectedOptions[0].text,
        quantity: quantity,
        date: visitDate,
        price: totalPrice
    };
    
    ticketCart.push(ticket);
    ticketTotal += totalPrice;
    updateTicketCartDisplay();
    
    // Limpiar formulario
    parkSelect.value = '';
    document.getElementById('ticketQuantity').value = '1';
    document.getElementById('visitDate').value = '';
    document.getElementById('ticketPrice').style.display = 'none';
}

// Función para actualizar visualización del carrito de boletos
function updateTicketCartDisplay() {
    const cartDiv = document.getElementById('ticketCart');
    const itemsDiv = document.getElementById('ticketCartItems');
    const totalDiv = document.getElementById('ticketCartTotal');
    
    if (ticketCart.length === 0) {
        cartDiv.style.display = 'none';
        return;
    }
    
    cartDiv.style.display = 'block';
    itemsDiv.innerHTML = '';
    
    ticketCart.forEach((ticket, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div>
                <strong>${ticket.park}</strong><br>
                ${ticket.type} x${ticket.quantity}<br>
                Fecha: ${ticket.date}
            </div>
            <div>
                $${ticket.price} MXN
                <button onclick="removeTicketFromCart(${index})" style="margin-left:10px; background:#e53e3e; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Eliminar</button>
            </div>
        `;
        itemsDiv.appendChild(itemDiv);
    });
    
    totalDiv.textContent = `Total: $${ticketTotal} MXN`;
}

// Función para eliminar boleto del carrito
function removeTicketFromCart(index) {
    ticketTotal -= ticketCart[index].price;
    ticketCart.splice(index, 1);
    updateTicketCartDisplay();
}

// Función para limpiar carrito de boletos
function clearTicketCart() {
    ticketCart = [];
    ticketTotal = 0;
    updateTicketCartDisplay();
}

// Función para procesar compra de boletos
function purchaseTickets() {
    if (ticketCart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const confirmed = confirm(`¿Confirmar compra por $${ticketTotal} MXN?`);
    if (confirmed) {
        alert('¡Compra procesada exitosamente! Recibirás un correo con tus boletos.');
        clearTicketCart();
    }
}

// Función para agregar paquete al carrito
function addPackageToCart(packageType, price) {
    const package = {
        type: packageType,
        name: getPackageName(packageType),
        price: price
    };
    
    packageCart.push(package);
    packageTotal += price;
    updatePackageCartDisplay();
}

// Función para obtener nombre del paquete
function getPackageName(type) {
    const names = {
        'familiar': 'Paquete Familiar',
        'aventurero': 'Paquete Aventurero',
        'romantico': 'Paquete Romántico',
        'cumpleanos': 'Paquete Cumpleañero'
    };
    return names[type] || type;
}

// Función para actualizar visualización del carrito de paquetes
function updatePackageCartDisplay() {
    const cartDiv = document.getElementById('packageCart');
    const itemsDiv = document.getElementById('packageCartItems');
    const totalDiv = document.getElementById('packageCartTotal');
    
    if (packageCart.length === 0) {
        cartDiv.style.display = 'none';
        return;
    }
    
    cartDiv.style.display = 'block';
    itemsDiv.innerHTML = '';
    
    packageCart.forEach((package, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div><strong>${package.name}</strong></div>
            <div>
                $${package.price} MXN
                <button onclick="removePackageFromCart(${index})" style="margin-left:10px; background:#e53e3e; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">Eliminar</button>
            </div>
        `;
        itemsDiv.appendChild(itemDiv);
    });
    
    totalDiv.textContent = `Total: $${packageTotal} MXN`;
}

// Función para eliminar paquete del carrito
function removePackageFromCart(index) {
    packageTotal -= packageCart[index].price;
    packageCart.splice(index, 1);
    updatePackageCartDisplay();
}

// Función para limpiar carrito de paquetes
function clearPackageCart() {
    packageCart = [];
    packageTotal = 0;
    updatePackageCartDisplay();
}

// Función para procesar compra de paquetes
function purchasePackages() {
    if (packageCart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const confirmed = confirm(`¿Confirmar compra por $${packageTotal} MXN?`);
    if (confirmed) {
        alert('¡Compra procesada exitosamente! Recibirás un correo con los detalles de tu paquete.');
        clearPackageCart();
    }
}