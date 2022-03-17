const titulo = document.getElementById("titulo");
const tbody = document.getElementById("tbody");
const article = document.getElementById("articles_place");
const logOut = document.getElementById("logout");

titulo.style.transform = 'scale(0)'
titulo.style.transition = 'all 0.3s'

setTimeout(() => {
	const nombre = localStorage.getItem("x-nombre-llantas");
	titulo.innerHTML = nombre;
titulo.style.transform = 'scale(1)'

}, 1000);

class Lista {
	async getPublicaciones() {
		const resString = await fetch(
			"http://localhost/prueba_tecnica/assets/php/publicaciones"
		);
		const resJson = await resString.json();
		const { ok, publicaciones } = resJson;
		let text = "";
		if (ok) {
			if (publicaciones.length > 0) {
				publicaciones.map((publicacion) => {
					const elem = new Elemento();
					text += elem.renderElemento(publicacion);
				});
			}
		}
		return text;
	}

	async buildPublicaciones() {
		tbody.innerHTML = await this.getPublicaciones();
	}
}

class Elemento extends Lista {
	constructor() {
		super();
	}

	renderElemento(elemento) {
		const text = `
    <tr>
      <td> ${elemento.id} </td>
      <td> ${elemento.titulo} </td>
      <td> <button onclick="mostrarElemento(${elemento.id})"> Detalles </button> </td>
    </tr>
    `;
		return text;
	}
}

class Publicacion {
	constructor({ id, titulo, fecha, img, contenido, email }) {
		this.id = id;
		this.titulo = titulo;
		this.fecha = fecha;
		this.img = img;
		this.contenido = contenido;
		this.email = email;
	}

	renderPublicacion() {
		let text = `
    <article class="article article__admin">
					<div class="article__header__container">
						<div class="article__header">
							<h3>Titulo : ${this.titulo}</h3>
							<h3>E-mail: ${this.email}</h3>
							<h3>Fecha: ${this.fecha}</h3>
						</div>
					</div>

					<div class="article__body">
          <h3>Imagen: ${this.img}</h3>
						<div class="article__body__img__container__admin">
							<img class="article__body__img" src=\"../../assets/img/${this.img}\" />
						</div>
						<div class="article__body__p__container">
							<h3>Contenido:</h3>
							<p class="article__body__p">
								${this.contenido}
							</p>
						</div>
					</div>
				</article>
    
    `;
		return text;
	}
}

async function mostrarElemento(id) {
	const data = new FormData();
	data.set("id", id);
	const token = localStorage.getItem("x-token-llantas");
	const res = await fetch(
		"http://localhost/prueba_tecnica/assets/php/getpublicacion",
		{
			method: "POST",
			headers: {
				"x-token-llantas": token,
			},
			body: data,
		}
	);
	const resJson = await res.json();
	if (resJson.ok) {
		if (resJson.auth) {
			const pub = new Publicacion(resJson.publicacion);
			article.innerHTML = pub.renderPublicacion();
		} else {
			window.location.href = "../adminlogin";
		}
	}
}

function logOutAction() {
	localStorage.removeItem("x-token-llantas");
	localStorage.removeItem("x-nombre-llantas");
	localStorage.removeItem("x-email-llantas");
	window.location.href = '../adminlogin'
}

logOut.addEventListener('click' , () => logOutAction());
const Lis = new Lista();
Lis.buildPublicaciones();
