const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const quantityInput = document.getElementById('quantity');

incrementBtn.addEventListener('click', function() {
  quantityInput.value = Number(quantityInput.value) + 1
});

decrementBtn.addEventListener('click', function() {
  quantityInput.value = Number(quantityInput.value) - 1
});