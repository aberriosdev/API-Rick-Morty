const API = 'https://rickandmortyapi.com/api/character';

// Obtiene la data desde la url
const getData = (apiURL) => {
    return fetch(apiURL)
        .then(response => response.json())
        .then(json => {
            printData(json);
            printSelectOptions(json.results); // Agrega los personajes al <select>
            printPaginacion(json.info);
        })
        .catch(error => {
            console.error(error)
            document.getElementById('infoCharacters').innerHTML = `
                <p class="text-danger">Error al cargar los datos. Inténtalo más tarde.</p>
            `;
        });
};

// Renderiza en pantalla la data
const printData = (data) => {
    let html = '';
    data.results.forEach(character => {
        html += `
            <div class="col-md-4 mt-4">
                <div class="card shadow border-primary" style="width: 13rem;">
                    <img src="${character.image}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                        <p class="card-text">Género: ${character.gender}</p>
                        <p class="card-text">Especie: ${character.species}</p>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('infoCharacters').innerHTML = html // obtiene Id del div donde se renderizan todos los personajes.
};

// Select de personajes
const printSelectOptions = (characters) => {
    const select = document.getElementById('characterSelect'); // Obtiene el id del select de personajes
    select.innerHTML = `<option value="">Selecciona un personaje</option>`; // Valor por defecto del select
    characters.forEach(character => {
        const option = document.createElement('option'); // Crea el elemento option
        option.value = character.url; // URL de cada personaje del option
        option.textContent = character.name; // Nombre del personaje
        select.appendChild(option); // Agrega el hijo option al select
    });

    // Agrega un eventListener al select
    select.addEventListener('change', (event) => {
        const selectedUrl = event.target.value;
        if (selectedUrl) {
            fetch(selectedUrl)
                .then(response => response.json())
                .then(character => {
                    printSingleCharacter(character); // Renderiza el personaje seleccionado llamando a otra función
                })
                .catch(error => console.error(error));
        } else {
            getData(API); // Si no se selecciona nada, carga todos los personajes de nuevo
        }
    });
};

// Muestra el personaje seleccionado
const printSingleCharacter = (character) => {
    const html = `
        <div class="col-md-4 mt-4">
            <div class="card shadow border-primary" style="width: 13rem;">
                <img src="${character.image}" class="card-img-top" alt="${character.name}">
                <div class="card-body">
                    <h5 class="card-title">${character.name}</h5>
                    <p class="card-text">Status: ${character.status}</p>
                    <p class="card-text">Especie: ${character.species}</p>
                    <p class="card-text">Género: ${character.gender}</p>
                    <p class="card-text">Origen: ${character.origin.name}</p>
                    <p class="card-text">Ubicación: ${character.location.name}</p>
                </div>
            </div>
        </div>
    `;
    document.getElementById('infoCharacters').innerHTML = html; // Obtiene Id del div donde se renderiza el personaje
};

const printPaginacion = (info) => {

    let preDisable = info.prev == null ? 'disabled' : '';
    let nextDisable = info.next == null ? 'disabled' : '';

    let html = `<li class="page-item ${preDisable}"><a class="page-link" onclick="getData('${info.prev}')">Previous</a></li>`
    html += `<li class="page-item ${nextDisable}"><a class="page-link" onclick="getData('${info.next}')">Next</a></li>`
    document.getElementById('paginacion').innerHTML = html;
}

getData(API);