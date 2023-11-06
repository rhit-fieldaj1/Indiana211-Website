document.addEventListener('DOMContentLoaded', async function () {

    const zipCode = localStorage.getItem('zipCode');
    const coordinates = await getCoordinates(zipCode);

    const foodPantryLink = document.getElementById('foodPantry');

    


    foodPantryLink.addEventListener('click', getFoodPantries);

});


getFoodPantries = async function() {
    const taxonomy = 'BD-1800.2000';

    try {
        const response = await fetch(`http://localhost:3030/resources?taxonomy_code=${taxonomy}`);
        if(!response.ok) {
            throw new Error(`HTTP error, Status: ${response.status}`);
        }
        const resources = await response.json();
        console.log(resources[0]);
    } catch (error) {
        console.error('Error fetching resources: ', error);
    }
}


getCoordinates = async function (zipCode) {
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
