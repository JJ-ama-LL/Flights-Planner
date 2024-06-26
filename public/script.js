// Set up options for API requests
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '9e32b1e0c6msh70546f53ac062a2p1a8a3bjsnf8044ad38274',
    'X-RapidAPI-Host': 'sky-scanner3.p.rapidapi.com'
  }
};

let state = [];

// Function to fetch flight data
async function getFlights() {
    // Get input values
    let originCity=document.getElementById("origin").value;
    let destCity=document.getElementById("destination").value;
    let departDate=document.getElementById("departure-date").value;
    let returnDate=document.getElementById("return-date").value;
    let ticket=document.getElementById("ticket-type").value;
    let destID;
    let originID;

    // Fetch origin city data
    const url1 = `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=${originCity}`;
    try {
       const response = await fetch(url1, options);
       const result = await response.json();
       originID=result.data[0].presentation.id;
    } catch(e) {
         console.log(e);
    }

    // Fetch destination city data
    const url2 = `https://sky-scanner3.p.rapidapi.com/flights/auto-complete?query=${destCity}`;
    try {
      const response = await fetch(url2, options);
      const result = await response.json();
      destID=result.data[0].presentation.id;
    } catch (e) {
      console.log(e);
    } 

    // Fetch flight search results
    const url = `https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip?fromEntityId=${originID}&toEntityId=${destID}&departDate=${departDate}&returnDate=${returnDate}&cabinClass=${ticket}`;
  
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (e) {
        console.log(e);
    }
}


async function showFlights() {
    state = await getFlights();
    displayFlights(state);
}


function priceCompare(a,b) {
    return a.data.itineraries[a].price.formatted.localeCompare(b.a.data.itineraries[b].price.formatted);
}


function sortByPrice() {
    let result = state.sort(priceCompare);
    displayFlights(result);
}


// Function to display flight data
function displayFlights(result) {
    let i;
    let flightDiv = document.querySelector("#flight-rows");
    let html = '';

    for (let flight of result.data.itineraries) {
      i=1;
      
      for(let location of flight.legs) {
        if(i===1) {
          html += `<tr id="indv_flight">
          <td>${location.carriers.marketing["0"].name} <a href="https://www.google.com/search?&q=${location.segments["0"].marketingCarrier.alternateId}+${location.segments["0"].flightNumber}&ie=UTF-8&oe=UTF-8"
          target="_blank" class="button">${location.segments["0"].marketingCarrier.alternateId} ${location.segments["0"].flightNumber}</a>
          </td>
          <td>DEPARTURE: ${location.origin.city}, ${location.origin.country} ---> ${location.destination.city}, ${location.destination.country}</td>
          <td>${location.departure}</td>
          <td>${location.durationInMinutes}</td>
          <td rowspan="2">${flight.price.formatted}</td>
          </tr>`;

          i=2;
        }
        else if(i===2){
          html += `<tr id="indv_flight">
          <td>${location.carriers.marketing["0"].name} <a href="https://www.google.com/search?&q=${location.segments["0"].marketingCarrier.alternateId}+${location.segments["0"].flightNumber}&ie=UTF-8&oe=UTF-8"
            target="_blank" class="button">${location.segments["0"].marketingCarrier.alternateId} ${location.segments["0"].flightNumber}</a>
            </td>
            <td>RETURN: ${location.origin.city}, ${location.origin.country} ---> ${location.destination.city}, ${location.destination.country}</td>
            <td>${location.departure}</td>
            <td>${location.durationInMinutes}</td>
            </tr>`;
        }
      }
      html += '<tr style="height: 30px; background-color: lightgrey;"><td></td><td></td><td></td><td></td></tr>';
    }

    flightDiv.innerHTML = html;
}

//for index

// Function to fetch data from the API based on the input value
async function getData(inputValue) {
    const apiKey = 'vORkFva6Z4BA7hEY5D2iEQ==bNVudf5B6M24kZmZ';
    const response = await fetch(`https://api.api-ninjas.com/v1/city?name=${inputValue}`, {
        headers: {
            'x-api-key': apiKey
        }
    });
    const data = await response.json();
    return data;
}

// Function to handle input in the origin and departure fields
async function handleInput(inputElement) {
    const inputValue = inputElement.value.trim();
    if (inputValue.length > 2) {
        const suggestions = await getData(inputValue);
        updateAutocomplete(inputElement, suggestions);
    } else {
        const dropdown = document.getElementById(inputElement.getAttribute('id') + '-dropdown');
        dropdown.style.display = 'none';
    }
}

// Function to initialize autocomplete for both origin and departure fields
function initializeAutocomplete() {
    const originInput = document.querySelector('.origin');
    const departureInput = document.querySelector('.departure');

    originInput.addEventListener('input', function () {
        handleInput(originInput);
    });

    departureInput.addEventListener('input', function () {
        handleInput(departureInput);
    });

    document.addEventListener('click', function (event) {
        const target = event.target;
        const autocompleteInputs = document.querySelectorAll('.origin, .departure');
        const autocompleteDropdowns = document.querySelectorAll('.autocomplete-dropdown');

        if (![...autocompleteInputs, ...autocompleteDropdowns].includes(target)) {
            autocompleteDropdowns.forEach(function (dropdown) {
                dropdown.style.display = 'none';
            });
        }
    });
}

// Autocomplete function
async function autocomplete(inputElement) {
    inputElement.addEventListener('input', async function () {
        const inputValue = inputElement.value.trim();
        if (inputValue.length > 2) { 
            const suggestions = await getData(inputValue); 
            updateAutocomplete(inputElement, suggestions);
        } else {
            const dropdown = document.getElementById(inputElement.getAttribute('id') + '-dropdown');
            dropdown.style.display = 'none';
        }
    });
}

// Function to update autocomplete dropdown with suggestions
function updateAutocomplete(input, suggestions) {
    const dropdown = document.getElementById(input.getAttribute('id') + '-dropdown');
    dropdown.innerHTML = '';

    suggestions.forEach(suggestion => {
        const option = document.createElement('div');
        option.classList.add('autocomplete-option');
        option.textContent = suggestion.name;
        option.dataset.value = suggestion.name;

        option.addEventListener('click', function () {
          input.value = this.textContent;
          dropdown.style.display = 'none';
        });

        dropdown.appendChild(option);
      });

      dropdown.style.display = suggestions.length ? 'block' : 'none';
    }



// Initialize autocomplete functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAutocomplete);
;
