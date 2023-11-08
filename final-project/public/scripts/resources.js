document.addEventListener('DOMContentLoaded', async function () {

    // Taxonomies
    const foodPantryTax = 'BD-1800.2000';


    // Location data from user
    const zipCode = localStorage.getItem('zipCode');

    if(!localStorage.getItem('radius')) {
        localStorage.setItem('radius', 10);
    }

    setRadius();
    const userCoordinates = await getCoordinates(zipCode);


    // Assign variables to links and buttons
    const foodPantryLink = document.getElementById('foodPantry');
    const addButton = document.getElementById('add');
    const removeButton = document.getElementById('remove');
    const printButton = document.getElementById('print');

    

    // Add listeners to links and buttons
    foodPantryLink.addEventListener('click', () => getResources(foodPantryTax, userCoordinates));
    addButton.addEventListener('click', () => addToRadius());
    removeButton.addEventListener('click', () => subtractFromRadius());
    printButton.addEventListener('click', () => {window.print()});

});


getResources = async function(taxonomy, userCoordinates) {

  const radius = localStorage.getItem('radius');

    try {
        const response = await fetch(`http://localhost:3030/resources`);
        console.log("Resonse: ", response);
        if(!response.ok) {
            throw new Error(`HTTP error, Status: ${response.status}`);
        }
        const resources = await response.json();

        const filteredResources = resources.filter(resource => resource.taxonomy_code === taxonomy);

        // Display results
        document.getElementById('resourceContainer').innerHTML = '';

        if(filteredResources) {
          document.getElementById('resourceContainer').innerHTML = getLastUpdate(filteredResources);
        }

        filteredResources.forEach(resource => {
            display(resource, userCoordinates);
        });

    } catch (error) {
        console.error('Error fetching resources: ', error);
    }
}

// Gets coordinates of the provided zip code
async function getCoordinates(zipCode) {
    const apiUrl = `https://thezipcodes.com/api/v1/search?zipCode=${zipCode}&countryCode=US&state=Indiana&apiKey=dc99a5a04b7d10ac5b710acd89fd5e5d`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return {
            latitude: data.location[0].latitude,
            longitude: data.location[0].longitude
        }
    } catch (error) {
        console.error('Error fetching zip code location: ', error);
    }
}

distance = function (lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude from degrees to radians
    const radLat1 = (Math.PI * lat1) / 180;
    const radLon1 = (Math.PI * lon1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const radLon2 = (Math.PI * lon2) / 180;

    const deltaLat = radLat2 - radLat1;
    const deltaLon = radLon2 - radLon1;

    // Haversine formula
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(radLat1) * Math.cos(radLat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = earthRadius * c;
    return distance;
}

display = function (resource, userCoordinates) {

  const radius = localStorage.getItem('radius');

    // Convert coordinate strings to numbers
    const lat1 = parseFloat(userCoordinates.latitude);
    const lon1 = parseFloat(userCoordinates.longitude);
    const lat2 = parseFloat(resource.latitude);
    const lon2 = parseFloat(resource.longitude);

    // Check if resource is within search radius
    let d = distance(lat1, lon1, lat2, lon2);
    if(isNaN(d) || d > radius) {return}

    document.getElementById("resourceContainer").innerHTML += `
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-10 title">
            <strong>${resource.agency_name}</strong>
          </div>
          <div class="col">
            <i class="material-symbols-outlined">info</i>
          </div>
        </div>
      </div>
      <div class="card-body text-left">
        <div class="row">
          <div class="col">
          <i class="material-symbols-outlined">location_on</i>
             ${resource.address_1} ${resource.address_2}, ${resource.city}, ${resource.state_province} ${resource.zipcode}
          </div>
        </div>
        <div class="row">
          <div class="col-3">
            <i class="material-symbols-outlined">call</i>
            ${resource.site_number}
          </div>
          <div class="col">
            <i class="material-symbols-outlined">mail</i>
            ${resource.service_email}
          </div>
        </div>
        <div class="row">
          <div class="col">
            <i class="material-symbols-outlined">calendar_month</i>
            ${resource.site_schedule}
          </div>
        </div>
        <div class="row">
          <div class="col">
            <strong>Eligibility: </strong>
            ${resource.site_eligibility}
          </div>
        </div>
        <div class="row">
          <div class="col">
            <strong>Details: </strong>
            ${resource.site_details}
          </div>
        </div>
      </div>
    </div>`;

}


function setRadius() {
  const r = document.getElementById('radius');
  r.innerHTML = localStorage.getItem('radius');
}

function addToRadius() {
  const rString = localStorage.getItem('radius');
  const rNum = parseInt(rString);
  localStorage.setItem('radius', rNum + 1);
  setRadius();
}

function subtractFromRadius() {
  const rString = localStorage.getItem('radius');
  const rNum = parseInt(rString);

  // Make sure user isn't setting radius to 0
  if (rNum > 1) {
    localStorage.setItem('radius', rNum - 1);
    setRadius();
  }

}


function getLastUpdate(resources) {
  for (const r of resources) {
    if(r.lastVerified) {
      return `This information was last updated on ${r.lastVerified}`;
    }
  }

  return `It is unknown when this data was last verified`;
}