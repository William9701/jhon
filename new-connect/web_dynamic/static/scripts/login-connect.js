function validateForm() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  if (username == "" || password == "") {
    showToast("Username and password must be filled out");
    return false;
  }
}

function showToast(message) {
  var toast = document.querySelector(".toast");
  toast.querySelector(".toast-body").textContent = message;
  $(toast).toast("show");
}
