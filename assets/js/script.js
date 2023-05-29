window.addEventListener("DOMContentLoaded", () => {
  
  let tasks = [];
  
  // input 
  const inputProduct = document.querySelector('.input-product');
  const inputPrice = document.querySelector('.input-price');
  const inputDescription = document.querySelector('.input-description');
  
  const tableContainer = document.querySelector('.table-container');
  const modalContainer = document.querySelector('.modal-container');
  
  // button submit 
  const buttonSubmit = document.querySelector('.btn-submit');
  buttonSubmit.addEventListener("click", addProduct);
  
  function addProduct(event) {
    event.preventDefault();
    if (event.target.textContent.toLowerCase().includes('add')) {
      const data = getInputValues();
      if (validate(data)) {
        if (isDataExist(data)) return alerts('error', 'Data is already in the list!');
        convertToCurrency(data);
        tasks.unshift(data);
        setLocalstorage('product', tasks);
        showUI(data);
        alerts('success', 'New Product Has Been Added!');
        loadData();
        clear();
      }
    }
  }
  
  function getInputValues() {
    return {
      product: inputProduct.value.trim(),
      price: inputPrice.value.trim(),
      description: inputDescription.value.trim()
    };
  }
  
  function convertToCurrency(data) {
    const result = Number(data.price);
    data.price = result.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    return data;
  }
  
  function validate({ product, price, description }) {
    if (!product && !price && !description) return alerts('error', 'All input is empty!');
    if (!product || !price || !description) return alerts('error', 'Input is empty!');
    if (product.length > 50) return alerts('error', 'field product must be no more than 50 character!');
    if (price.match(/[a-zA-Z]/gi)) return alerts('error', 'field price can only contain numbers!');
    return true;
  }
  
  function alerts(type, text) {
    swal.fire ({
      icon: type,
      title: 'Alert',
      text: text
    });
  }
  
  function isDataExist({ product, price, description: desc }) {
    let result = false;
    tasks.forEach(task => {
      if (task.product.toLowerCase() == product.toLowerCase() && task.price.toLowerCase() == price.toLowerCase() && task.description.toLowerCase() == desc.toLowerCase()) result = true;
      if (task.product.toLowerCase() == product.toLowerCase() && task.price.toLowerCase() == price.toLowerCase() && task.description.toLowerCase() != desc.toLowerCase()) result = false;
      if (task.product.toLowerCase() == product.toLowerCase() && task.price.toLowerCase() != price.toLowerCase() && task.description.toLowerCase() == desc.toLowerCase()) result = false;
      if (task.product.toLowerCase() != product.toLowerCase() && task.price.toLowerCase() == price.toLowerCase() && task.description.toLowerCase() == desc.toLowerCase()) result = false;
      if (task.product.toLowerCase() == product.toLowerCase() && task.price.toLowerCase() != price.toLowerCase() && task.description.toLowerCase() != desc.toLowerCase()) result = false;
      if (task.product.toLowerCase() != product.toLowerCase() && task.price.toLowerCase() != price.toLowerCase() && task.description.toLowerCase() != desc.toLowerCase()) result = false;
    });
    return result;
  }
  
  function setLocalstorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  }
  
  function showUI(data, index = 0) {
    const result = renderElement(data, index);
    tableContainer.insertAdjacentHTML('beforeend', result);
  }
  
  function renderElement({ product, price, description: desc }, index) {
    return `
      <tr>
        <td class="fw-light p-3">${index + 1}</td>
        <td class="fw-light p-3">${product}</td>
        <td class="fw-light p-3">${price}</td>
        <td class="fw-light p-3">
          <button 
            class="btn btn-success btn-sm rounded-0 btn-edit m-1" 
            data-index="${index}"
            data-bs-toggle="modal"
            data-bs-target="#modalForm">
            edit
          </button>
          <button 
            class="btn btn-warning btn-sm rounded-0 btn-detail m-1" 
            data-index="${index}"
            data-bs-toggle="modal"
            data-bs-target="#modalDetailProduct">detail</button>
          <button class="btn btn-danger btn-sm rounded-0 btn-delete m-1" data-index="${index}">delete</button>
        </td>
      </tr>
    `;
  }
  
  function loadData() {
    tableContainer.innerHTML = '';
    const data = localStorage.getItem('product');
    tasks = (data) ? JSON.parse(data) : [];
    return tasks.length > 0 ? tasks.forEach((task, index) => showUI(task, index)) : showTableAlert('primary', 'Data Product Doesn\'t Exist');
  }
  
  loadData();
  
  function clear() {
    const formWrapper = document.querySelectorAll('.form-wrapper');
    formWrapper.forEach(form => form.reset());
  }
  
  function showTableAlert(type, message) {
    const result = setTableAlert(type, message);
    tableContainer.innerHTML = result;
  }
  
  function setTableAlert(type, message) {
    return `
      <tr>
        <td colspan="4">
          <div class="alert alert-${setType(type)} rounded-0" role="alert">
            <span class="d-flex my-auto fw-normal">${message}</span>
          </div>
        </td>
      </tr>
    `;
  } 
  
  function setType(type) {
    switch (type) {
      case 'danger' : return 'danger';
      case 'red' : return 'danger';
      case 'success' : return 'success';
      case 'green' : return 'success';
      case 'warning' : return 'warning';
      case 'yellow' : return 'warning';
      case 'primary' : return 'primary';
      case 'blue' : return 'primary';
      default : return 'type does not match';
    }
  }
  
  // delete product / data 
  document.addEventListener("click", event => {
    if (event.target.classList.contains('btn-delete')) {
      const index = event.target.dataset.index;
      deleteData(index);
    }
  });
  
  function deleteData(index) {
    swal.fire ({
      icon: 'info',
      title: 'are you sure?',
      text: 'do you want to delete this product?',
      showCancelButton: true
    })
    .then(response => {
      if (response.isConfirmed) {
        tasks.splice(index, 1);
        setLocalstorage('product', tasks);
        alerts('success', 'Product Has Been Deleted!');
        loadData();
      }
    });
  }
  
  // edit product / data 
  document.addEventListener("click", event => {
    if (event.target.classList.contains('btn-edit')) {
      const index = event.target.dataset.index;
      buttonSubmit.textContent = 'Edit Product';
      setValueInput(index);
      editData(index);
    }
  });
  
  function setValueInput(index) {
    inputProduct.value = tasks[index].product;
    inputPrice.value = tasks[index].price;
    inputDescription.value = tasks[index].description;
  }
  
  function editData(index) {
    buttonSubmit.addEventListener("click", function(event) {
      event.preventDefault();
      if (this.textContent.toLowerCase().includes('edit')) {
        const data = getInputValues();
        if (validate(data)) {
          if (isDataExist(data)) return alerts('error', 'Data Is Already In The List!');
          convertToCurrency(data);
          tasks[index] = data;
          setLocalstorage('product', tasks);
          alerts('success', 'Product Has Been Updated!');
          loadData();
          buttonSubmit.textContent = 'Add Product';
          index = null;
        }
      }
    });
  }
  
  // detail product / data 
  document.addEventListener("click", event => {
    if (event.target.classList.contains('btn-detail')) {
      const index = event.target.dataset.index;
      modalContainer.innerHTML = detailProduct(tasks[index]);
    }
  });
  
  function detailProduct({ product, price, description }) {
    return `
      <h1 class="fw-normal">${product}</h1>
      <h3 class="fw-light mb-4">${price}</h3>
      <p class="fw-light">${description}</p>
    `;
  }
  
  // search product / data 
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener("keyup", function() {
    const value = this.value.trim().toLowerCase();
    searchData(value);
  });
  
  function searchData(value) {
    const result = Array.from(tableContainer.rows);
    result.forEach(data => {
      const str = data.textContent.toLowerCase();
      data.style.display = (str.indexOf(value) != -1) ? '' : 'none';
    })
  } 
  
  // delete all product / data
  const btnAllData = document.querySelector('.btn-del-all');
  btnAllData.addEventListener("click", event => {
    swal.fire ({
      icon: 'info',
      title: 'are you sure?',
      text: 'do you want to delete all data?',
      showCancelButton: true
    })
    .then(response => {
      if (response.isConfirmed) {
        tasks = [];
        setLocalstorage('product', tasks);
        alerts('success', 'All Product Has Been Deleted!');
        loadData();
      }
    });
  });
  
});