const socket = io();

socket.on("connect", () => {
  console.log("Conectado al servidor de WebSocket");
  socket.emit("getProducts");
});

socket.on("updateProducts", (products) => {
  console.log("Productos actualizados:", products);

  const productsList = document.getElementById("products-list");
  productsList.innerHTML = "";

  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
            <h2>${product.title}</h2>
            <p>Precio: $${product.price}</p>
            <p>${product.description}</p>
            <p>Precio: $${product.code}</p>
            <p>${product.stock}</p>
        `;
    productsList.appendChild(listItem);
  });
});

const form = document.getElementById("new-product-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const stock = document.getElementById("stock").value;

  const newProduct = {
    title: title,
    price: price,
    description: description,
    code: code,
    thumbnail: thumbnail,
    stock: stock,
    status: true,
  };

  console.log(newProduct);

  await socket.emit("addProduct", newProduct);

  document.getElementById("title").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  document.getElementById("code").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("stock").value = "";
});
