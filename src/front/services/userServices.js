//funciones que tienen que ver con el sistema de autenticacion

export async function login(email, password) {
    console.log("Soy un console log del servicio");
    console.log(email, password);
    
    try {
        const response = await fetch(
            'https://improved-goggles-7vw7qxw699wwhrr9j-3001.app.github.dev/login',
            {
                method: 'POST',
                body: JSON.stringify({ email: email, password: password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const data = await response.json();

        //  Mostrar token directamente en consola
        console.log("Token recibido:", data.access_token);
        
        if (response.status === 200) {
            localStorage.setItem('token', data.access_token);
            return true;
        }
        
        if (response.status === 404) {
            return false;
        }
        
    } catch (error) {
        console.log(error);
        return false;
    }
}


export async function signup(firstName, lastName, email, password) {
    console.log("Soy un console log del servicio SIGNUP");
    console.log(firstName, lastName, email, password);

    try {
        const response = await fetch('https://improved-goggles-7vw7qxw699wwhrr9j-3001.app.github.dev/signup', {
            method: 'POST',
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log(data);

        if (response.status === 201) { // creado con éxito
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
            }
            return true;
        }

        if (response.status === 400 || response.status === 409) { 
            return false;
        }

    } catch (error) {
        console.log(error);
        return false;
    }
}


export async function getPrivate() {
    try {
        const token = localStorage.getItem("token"); // buscamos el token guardado

        const response = await fetch("https://improved-goggles-7vw7qxw699wwhrr9j-3001.app.github.dev/private", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // enviamos token en el header
            }
        });

        if (!response.ok) {
            return null; // token inválido o no autorizado
        }

        const data = await response.json();
        return data; // retornamos la respuesta del backend
    } catch (error) {
        console.error("Error en getPrivate:", error);
        return null;
    }
}