document.addEventListener('DOMContentLoaded', function () {

    const zipCode = localStorage.getItem('zipCode');
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
