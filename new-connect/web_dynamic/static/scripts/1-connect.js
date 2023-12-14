document.addEventListener("DOMContentLoaded", function () {
  var isValidEmail = true;
  var isValidPassword = true;
  document
    .querySelector(".signup")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      if (!isValidEmail) {
        // Add this condition
        showToast("Please enter a valid email address");
        return;
      }
      if (!isValidPassword) {
        // Add this condition
        showToast("Password must be at least 8 characters long");
        return;
      }
      var username = document.querySelector('input[name="username"]');
      var email = document.querySelector('input[name="email"]');
      var password = document.querySelector('input[name="password"]');
      // Event listener for username field
      username.addEventListener("input", function () {
        fetch("http://127.0.0.1:5001/api/v1/users")
          .then((response) => response.json())
          .then((users) => {
            for (let user of users) {
              if (user.username === username.value) {
                showToast("Username already exists");
                return;
              }
            }
          });
      });

      // Event listener for email field
      email.addEventListener("input", function () {
        var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.value)) {
          showToast("Not a valid email address");
          isValidEmail = false; // Set the flag to false if the email is not valid
        } else {
          isValidEmail = true; // Set the flag to true if the email is valid
        }
        fetch("http://127.0.0.1:5001/api/v1/users")
          .then((response) => response.json())
          .then((users) => {
            for (let user of users) {
              if (user.email === email.value) {
                showToast("Email already exists");
                return;
              }
            }
          });
      });
      password.addEventListener("input", function () {
        if (password.value.length < 8) {
          showToast("Password must be at least 8 characters long");
          isValidPassword = false; // Set the flag to false if the password is not long enough
        } else {
          isValidPassword = true; // Set the flag to true if the password is long enough
        }
      });
      var first_name = document.querySelector('input[name="first_name"]');
      var last_name = document.querySelector('input[name="last_name"]');

      var location = document.querySelector('input[name="location"]');
      var description = document.querySelector('input[name="description"]');

      var re_password = document.querySelector('input[name="re_password"]');

      // Check if any field is empty and display a specific error message
      if (!username.value) {
        showToast("Username cannot be left empty");
        return;
      }
      if (!first_name.value) {
        showToast("First name cannot be left empty");
        return;
      }
      if (!last_name.value) {
        showToast("Last name cannot be left empty");
        return;
      }
      if (!email.value) {
        showToast("Email cannot be left empty");
        return;
      }
      if (!location.value) {
        showToast("Location cannot be left empty");
        return;
      }
      if (!description.value) {
        showToast("Description cannot be left empty");
        return;
      }
      if (!password.value) {
        showToast("Password cannot be left empty");
        return;
      }
      if (!re_password.value) {
        showToast("Re-entered password cannot be left empty");
        return;
      }

      // Check if passwords match
      if (password.value !== re_password.value) {
        showToast("The passwords do not match");
        return;
      }

      fetch("http://127.0.0.1:5001/api/v1/users")
        .then((response) => response.json())
        .then((users) => {
          for (let user of users) {
            if (user.username === username.value) {
              showToast("Username already exists");
              return;
            }
            if (user.email === email.value) {
              showToast("Email already exists");
              return;
            }
          }
        });
      var data = {
        username: username.value,
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        location: location.value,
        description: description.value,
        password: password.value,
      };

      fetch("http://127.0.0.1:5001/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          window.history.back();
          showToast("Sign up successful");
        })
        .catch((error) => {
          console.error("Error:", error);
          if (error instanceof SyntaxError) {
            // Handle JSON parse error
            console.error("Invalid JSON in response");
          } else {
            // Handle other errors
            if (error.response && error.response.status === 400) {
              return error.response.json();
            } else {
              throw new Error("HTTP error " + response.status);
            }
          }
        })
        .then((json) => {
          // Check for duplicate key violation error
          if (json && json.error) {
            if (json.error.includes("Username")) {
              alert("Username already exists");
            } else if (json.error.includes("Email")) {
              alert("Email already exists");
            }
          }
        });
    });

  var autocompleteService = new google.maps.places.AutocompleteService();
  var country = "NG"; // Replace with the user's country code

  document.querySelector("#location").addEventListener("input", function () {
    autocompleteService.getPlacePredictions(
      {
        input: this.value,
        types: ["(regions)"],
        componentRestrictions: { country: country },
      },
      function (predictions, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var select = document.querySelector("#location");
          select.innerHTML = ""; // Clear the select field
          predictions.forEach(function (prediction) {
            var option = document.createElement("option");
            option.value = prediction.description;
            select.appendChild(option);
          });
        }
      }
    );
  });
});

function showToast(message) {
  var toast = document.querySelector(".toast");
  toast.querySelector(".toast-body").textContent = message;
  $(toast).toast("show");
}

