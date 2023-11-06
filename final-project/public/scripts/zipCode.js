document.addEventListener('DOMContentLoaded', function(){

    document.getElementById('zipSearch').addEventListener('click', getZipInput);

});

getZipInput = function () {
    const textBox = document.getElementById('input');
    const zipCode = textBox.value;
    localStorage.setItem('zipCode', zipCode);
}

