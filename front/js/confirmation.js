const idCommand = new URL(window.location.href).searchParams.get("id");

document.getElementById('orderId').innerHTML = idCommand;
