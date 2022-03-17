const form = document.getElementById("form");
const articlesPlace = document.getElementById("articles_place");

class Entorno {
	async getPublicaciones() {
		const resString = await fetch(
			"http://localhost/prueba_tecnica/assets/php/publicaciones"
		);
		const resJson = await resString.json();
		const { ok, publicaciones } = resJson;
		if (ok) {
			if (publicaciones.length > 0) {
				let text = "";
				publicaciones.map((publicacion) => {
					const publi = new Publicacion(publicacion);
					text +=  publi.renderPublicacion();
				});
        console.log(text)
				return text;
			}
		}
	}

	async buildPublicaciones() {
		articlesPlace.innerHTML = await this.getPublicaciones();
	}
}

class Formulario extends (Entorno) {
	constructor(form) {
		super(form)
		this.form = form;
	}

  async sendData() {
    const data = new FormData(this.form)
    const resString = await fetch('http://localhost/prueba_tecnica/assets/php/publicaciones' , {
      method: 'POST',
      body: data

    })
    const resJson = await resString.json()
		if(resJson.ok){
			this.buildPublicaciones()
			this.form.reset()
		}
  }

	build() {
		this.form.addEventListener("submit", (e) => {
			e.preventDefault();
			this.sendData();
		});
	}
}

class Publicacion {
	constructor({ id, titulo, fecha, img, contenido }) {
		this.id = id;
		this.titulo = titulo;
		this.fecha = fecha;
		this.img = img;
		this.contenido = contenido;
	}

	renderPublicacion() {
		let text = `
    <article class="article">
					<div class="article__header__container">
						<div class="article__header">
							<h3>${this.titulo}</h3>
							<p>${this.fecha}</p>
						</div>
					</div>

					<div class="article__body">
						<div class="article__body__img__container">
							<img class="article__body__img" src=\"assets/img/${this.img}\" />
						</div>
						<div class="article__body__p__container">
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

const Entor = new Entorno();
Entor.buildPublicaciones(); // Hacemos que las publicaciones Carguen
const Formu = new Formulario(form);
Formu.build();  //Agregamos el listener al formulario para realizar el registro de datos
