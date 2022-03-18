const form = document.getElementById("form");
const openForm = document.getElementById('openForm')
const articlesPlace = document.getElementById("articles_place");

class Entorno {
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
					const publi = new Publicacion(publicacion);
					text += publi.renderPublicacion();
				});
			}
		}
		return text;
	}

	async buildPublicaciones() {
		articlesPlace.innerHTML = await this.getPublicaciones();
	}
}

class Formulario extends Entorno {
	constructor(form) {
		super(form);
		this.form = form;
		this.random = parseInt(Math.random() * (99999 - 11111) + 11111)
	}

	toogleShow(){
		this.form.classList.toggle('showed')
	} 

	async sendData() {
		const data = new FormData(this.form);
		const emailRegex =
			/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
		const allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i

		
		if (data.get("titulo") == "") {
			alert('Ingrese un titulo')
			return;
		}

		if (!emailRegex.test(data.get("email"))) {
			alert('Ingrese un e-mail correcto')

			return;
		}

		if(data.get('img').size > 3000000){
			alert('Elemento muy pesado, inserte otro')
			return
		}

		if(!allowedExtensions.exec(data.get('img').name)){
			alert('Ingrese una imagen\n Su extencion debe ser .jpg , .jpeg , .png , .gif ')
			return
		}

		if(data.get('contenido') == ""){
			alert('Ingrese contenido para la publicación')
			return
		}


		if(parseInt(data.get('capt')) != this.random){
			alert('Numero Captcha incorrecto')
			this.chanNumber()
			return
		}

		const resString = await fetch(
			"http://localhost/prueba_tecnica/assets/php/publicaciones",
			{
				method: "POST",
				body: data,
			}
		);



		const resJson = await resString.json();
		if (resJson.ok) {
			this.buildPublicaciones();
			this.form.reset();
			this.chanNumber()
			alert('Publicado con exito')
			this.toogleShow()
		}
	}

	chanNumber(){
		this.random = parseInt(Math.random() * (99999 - 11111) + 11111)
		this.form.childNodes[1].childNodes[7].childNodes[3].childNodes[1].innerHTML = this.random
	}

	build() {
		this.chanNumber()
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
Formu.build(); //Agregamos el listener al formulario para realizar el registro de datos
openForm.addEventListener('click' , () => {
	Formu.toogleShow()
}) 
