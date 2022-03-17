const login = document.getElementById("login");
const singup = document.getElementById("singup");


class Formulario {
	constructor(form, mod) {
		this.form = form;
		this.random = parseInt(Math.random() * (99999 - 11111) + 11111);
		this.mod = mod;
	}

	chackNombre(data){
		if (data.get("nombre") == "") {
			alert('Ingrese un nombre')
			return false;
		}
		return true;
	}

	checkInfoLogin(data) {
		const emailRegex =
			/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
	
		if (!emailRegex.test(data.get("email"))) {
			alert("Ingrese un e-mail correcto");
			return false;
		}
	
		if (data.get("password") == "") {
			alert("Ingrese contraseña");
			return false;
		}
	
		if (parseInt(data.get("capt")) != this.random) {
			alert("Numero Captcha incorrecto");
			return false;
		}
		return true;
	}

	async sendData() {
		const data = new FormData(this.form);
		if (this.mod == "login") {
			if (!this.checkInfoLogin(data)) {
				this.chanNumber()
				return;
			}
			const resString = await fetch(
				"http://localhost/prueba_tecnica/assets/php/loginadmin",
				{
					method: "POST",
					body: data,
				}
			);
			const resJson = await resString.json();
			localStorage.setItem('x-token-llantas' , resJson.token)
			console.log(resJson)
			if (resJson.ok) {
				if (resJson.auth) {
					window.location.href = "../admin";
				} else {
					alert(resJson.msg)
					this.chanNumber();
				}
			}
		} else if (this.mod == "singup") {
			if (!this.checkInfoLogin(data) || !this.chackNombre(data)) {
				return;
			}
			const resString = await fetch(
				"http://localhost/prueba_tecnica/assets/php/singupadmin",
				{
					method: "POST",
					body: data,
				}
			);
			try{
				const resJson = await resString.json();
				if (resJson?.ok) {
					if (resJson.auth) {
						localStorage.setItem('x-token-llantas' , resJson.token)
						window.location.href = "../admin";
					} else {
						alert(resJson.msg)
						this.chanNumber();
					}
				}
			}
			catch(err){
				console.log(err)
				alert('Error del servidor')
			}
		}
	}

	chanNumber() {
		console.log(this.mod)
		this.random = parseInt(Math.random() * (99999 - 11111) + 11111);
		if(this.mod == 'login'){
			document.getElementById("nospam").innerHTML = this.random;
		}
		else if(this.mod == 'singup'){
			document.getElementById("nospam2").innerHTML = this.random;
		}
	}

	build() {
		this.chanNumber();
		this.form.addEventListener("submit", (e) => {
			e.preventDefault();
			this.sendData();
		});
	}
}

const FormuLog = new Formulario(login, "login");
const FormuSin = new Formulario(singup , "singup")
FormuLog.build();
FormuSin.build();
