const token = localStorage.getItem("x-token-llantas");
async function viewToken(token) {
	try {
		if (token != null) {
			const res = await fetch(
				"http://localhost/prueba_tecnica/assets/php/validtoken",
				{
					headers: {
						"x-token-llantas": token,
					},
				}
			);
			const resJon = await res.json();
			if (resJon.ok) {
				if (resJon.auth) {
					localStorage.setItem("x-nombre-llantas", resJon.nombre);
					localStorage.setItem("x-email-llantas", resJon.email);
					if (window.location.pathname == "/prueba_tecnica/pages/adminlogin/") {
						window.location.href = "../admin";
					}
				} else if(window.location.pathname == "/prueba_tecnica/pages/admin/"){
          console.log('hola')
					window.location.href = "../adminlogin";
				}
			}
		}
    else{
      if(window.location.pathname == "/prueba_tecnica/pages/admin/"){
        window.location.href = "../adminlogin";
      }
    }
	} catch (err) {
		localStorage.removeItem("x-token-llantas");
		localStorage.removeItem("x-nombre-llantas");
		localStorage.removeItem("x-email-llantas");
    
	}
}

viewToken(token);
