const urlApi = "https://dummyjson.com/products";
let idProducto=null;

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    idProducto = params.get("id");
    if (idProducto) {
        cargarProducto(idProducto);
    } else {
        alert("No se recibió el ID del producto");
    }
});


const cargarProducto = (id) => {
    fetch(`${urlApi}/${id}`)
        .then(res => res.json())
        .then(producto => {
            mostrarProducto(producto);
            obtenerCategorias(producto.category);
        })
        .catch(() => {
            alert("Error al cargar el producto");
        });
}

	const obtenerCategorias = (categoriaProducto) => {
    fetch(`${urlApi}/categories`)
        .then(res => res.json())
        .then(data => {
            cargarCategorias(data, categoriaProducto);
        })
        .catch(() => {
            alert("Error al cargar categorias");
        });
};


	const cargarCategorias = (categorias, categoriaProducto) => {
    const lista = document.getElementById("categoria");

    categorias.forEach(cat => {
        const opcion = document.createElement("option");
        opcion.value = cat.slug;
        opcion.textContent = cat.name;

        if (cat.slug === categoriaProducto) {
            opcion.selected = true; 
        }
        lista.appendChild(opcion);
    });
};

const editarProducto= () =>{
		const titulo=document.getElementById("titulo").value
		const precio=document.getElementById("precio").value
		const categoria =document.getElementById("categoria").value
		const descripcion=document.getElementById("descripcion").value
		const inventario=document.getElementById("stock").value
		const mensaje=document.getElementById("mensaje-exito")

		if(!titulo||!precio||!descripcion){
			alert("Favor de llenar los campos obligatorios...")
			return
		}

		const producto={
			title:titulo,
			price:parseFloat(precio),
			category:categoria,
			description:descripcion,
			stock:inventario,
			thumbnail:'ruta.jpg'///
		}
			fetch(`${urlApi}/${idProducto}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(producto)
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			mostrarMensajeExito("Producto actualizado correctamente");
		});

}

	
const mostrarProducto = (producto) => {
		const contenido = document.getElementById("contenido");
		contenido.innerHTML = `
			<h2>Edición de un producto</h2>
			<div class="form-group">
				<label>Nombre del producto : </label>
				<input type="text" id="titulo" placeholder="Nombre del producto..." value="${producto.title}">
			</div>

			<div class="form-group">
				<label>Precio ($): </label>
				<input type="number" id="precio" placeholder="$0.00" value="${producto.price}">
			</div>
			
			<div class="form-group">
				<label>Stock: </label>
				<input type="number" id="stock" placeholder="0" value="${producto.stock}">
			</div>

			<div class="form-group">
				<label>Categoria : </label>
				<select id="categoria">
				</select>
			</div>

			<div class="form-group">
				<label>Descripcion : </label>
				<textarea id="descripcion" rows="4" placeholder="Detalles del producto...">${producto.description}</textarea>
			</div>
			<div class = "form-group">
				<button class="btn-back" onclick="window.location.href='index.html'">Volver</button>
				<button onclick="editarProducto()">Guardar producto...</button>
			</div>
			<div id="mensaje-exito"></div>
		`;
	};
	
	const mostrarMensajeExito = (texto) => {
    const mensaje = document.getElementById("mensaje-exito");

    mensaje.textContent = texto;
    mensaje.style.backgroundColor = "#d4edda";
    mensaje.style.color = "#155724";
    mensaje.style.padding = "10px";
    mensaje.style.marginTop = "10px";
    mensaje.style.border = "1px solid #c3e6cb";
    mensaje.style.borderRadius = "4px";

    setTimeout(() => {
        mensaje.textContent = "";
        mensaje.removeAttribute("style");
    }, 3000);
};

	