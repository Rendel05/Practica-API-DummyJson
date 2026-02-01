const urlApi = "https://dummyjson.com/products";
let limit = 30;
let skip = 0;
let totalProductos = 0;

const cargarProductos = () => {
    fetch(`${urlApi}?limit=${limit}&skip=${skip}`)
        .then(res => res.json())
        .then(data => {
            totalProductos = data.total;
            mostrarProductos(data.products);
        })
        .catch(() => {
            alert("Error al cargar los productos");
        });
};



document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();

    const form = document.getElementById("form-busqueda");
    const input = document.getElementById("input-busqueda");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        buscarProductos(input.value.trim());
    });
	
	input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        cargarProductos();
    }
});
	
});



const generarUrl = (producto) => {
	const category= producto.category;
	const name=producto.title
			.toLowerCase()
			.replaceAll(' ','-');
	return `https://cdn.dummyjson.com/product-images/${category}/${name}/1.webp`;
}

const stock = (producto) => {
	const disponible = producto.availabilityStatus;
	if (disponible !=="In Stock"){
		return "color: red;";
	}
	else{
		return "";
	}
}

function stars(n) {
  const trunc = Math.round(n);
  const rest = 5 - trunc;
  let stars = "";

  for (let i = 1; i <= trunc; i++) {
    stars += "⭐";
  }
  for (let i = 1; i <= rest; i++) {
    stars += "☆";
  }
  return stars + "  " + n;
}

const buscarProductos = (texto) => {
    fetch(`${urlApi}/search?q=${texto}`)
        .then(res => res.json())
        .then(data => {
            mostrarProductos(data.products);
        })
        .catch(() => {
            alert("Error al buscar productos");
        });
};


const mostrarProductos = (productos) => {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
  <h3>Inventario de Productos</h3>
  <div id="contenedor-productos"></div>
  <div class="paginacion">
    <button id="btn-anterior" style="margin-right:20px !important">⬅️</button>
    <button id="btn-siguiente">➡️</button>
  </div>
`;

paginacion();


    const contenedor = document.getElementById("contenedor-productos");

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${generarUrl(producto)}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p>${producto.description}</p>
            <p><strong>Precio:</strong> $${producto.price}</p>
            <p><strong>Calificación:</strong> ${stars(producto.rating)}</p>
        `
		;

        card.addEventListener("click", () => {
            cargarProducto(producto.id);
        });

        contenedor.appendChild(card);
    });
};

const cargarProducto = (id) => {
    fetch(`${urlApi}/${id}`)
        .then(res => res.json())
        .then(producto => {
            mostrarProducto(producto);
        })
        .catch(() => {
            alert("Error al cargar el producto");
        });
};


const mostrarProducto = (producto) => {
    const contenido = document.getElementById("contenido");
    contenido.innerHTML = `
		<button id="btn-anterior" style="margin-left:-150% !important;">⬅️<strong> Volver</strong></button>
		<div id="detalles-producto">
			<h3>${producto.title}</h2>
			<div class="producto-main">
				<div class="producto-imagen">
					<img src="${generarUrl(producto)}" alt="${producto.title}">
				</div>
			<div class="producto-info">
					<p><strong>Precio:</strong> $${producto.price}</p>
					<p><strong>Stock:</strong> ${producto.stock}</p>
					<p><strong>Categoría:</strong> ${producto.category}</p>
					<p><strong>Calificación:</strong> ${stars(producto.rating)}</p>
					<p><strong>Marca:</strong> ${producto.brand}</p>
					<p><strong>SKU:</strong> ${producto.sku}</p>
					<p><strong>Garantía:</strong> ${producto.warrantyInformation}</p>
					<p><strong>Información de envío:</strong> ${producto.shippingInformation}</p>
					<p><strong>Disponibilidad: </strong><span style="${stock(producto)}">${producto.availabilityStatus}</span></p>
					</br>
					<p>${producto.description}</p>
			</div>
		  </div>
		  <div class="producto-resenas" id="producto-resenas"></div>
    `;
	mostrarResenas(producto.reviews);
    document.getElementById("btn-anterior")
        .addEventListener("click", () => {
            cargarProductos();
        });
};



const mostrarResenas = (reviews) => {
    const contenedor = document.getElementById("producto-resenas");
    if (!reviews || reviews.length === 0) {
        contenedor.innerHTML = "<p>No hay reseñas disponibles.</p>";
        return;
    }
    let html = "<h3>Reseñas recientes</h3>";
    reviews.forEach(review => {
        html += `
            <div class="resena">
                <p><strong>${review.reviewerName}</strong></p>
                <p>${stars(review.rating)}</p>
                <p>${review.comment}</p>
                <small>${new Date(review.date).toLocaleDateString()}</small>
            </div>
        `;
    });
    contenedor.innerHTML = html;
};




const paginacion = () => {
    const btnSig = document.getElementById("btn-siguiente");
    const btnAnt = document.getElementById("btn-anterior");

    if (btnSig) {
        btnSig.addEventListener("click", () => {
            if (skip + limit < totalProductos) {
                skip += limit;
                cargarProductos();
            }
        });
    }

    if (btnAnt) {
        btnAnt.addEventListener("click", () => {
            if (skip - limit >= 0) {
                skip -= limit;
                cargarProductos();
            }
        });
    }
};

