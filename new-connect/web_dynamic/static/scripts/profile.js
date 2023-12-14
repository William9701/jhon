$(document).ready(function () {
  function checkApiStatus() {
    $.get("http://127.0.0.1:5001/api/v1/status/", function (data) {
      if (data.status === "OK") {
        $("#api_status").addClass("available");
      } else {
        $("#api_status").removeClass("available");
      }
    });
  }
  checkApiStatus();
  setInterval(checkApiStatus, 5000);
});

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".search-bar")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting normally
      var query = document.querySelector('input[name="q"]').value; // Get the search query

      fetch("http://127.0.0.1:5001/api/v1/locations/" + query) // Send a GET request to your API
        .then((response) => response.json()) // Parse the response as JSON
        .then((data) => {
          var liveBody = document.querySelector(".live-body"); // Get the live body element
          var Row = document.querySelector(".row");
          Row.style.flex = "1";

          Row.style.maxHeight = "800px";

          Row.innerHTML = ""; // Clear the row body

          var liveLogo = document.createElement("div");
          liveLogo.className = "live-logo";

          var liveLogo_img = document.createElement("img");
          liveLogo_img.src = "../static/images/live-icon.png";
          liveLogo_img.alt = "";

          liveLogo.appendChild(liveLogo_img);
          Row.appendChild(liveLogo);

          if (data.length === 1) {
            Row.style.maxHeight = "430px";
          }

          if (!Array.isArray(data) || data.length === 0) {
            // Check if the data is not an array or if it's an empty array

            var liveLogo = document.createElement("div");
            liveLogo.className = "live-logo";

            var liveLogo_img = document.createElement("img");
            liveLogo_img.src = "../static/images/live-icon.png";
            liveLogo_img.alt = "";

            liveLogo.appendChild(liveLogo_img);
            Row.appendChild(liveLogo);

            Row.addEventListener("mouseover", function () {
              this.style.overflowY = "visible"; // Change to 'visible' on hover
            });

            var imgElement = document.createElement("img");
            imgElement.id = "opps-logo";
            imgElement.src = "../static/images/opps.png";
            imgElement.alt = "";
            Row.appendChild(imgElement);
            var SorryNote = document.createElement("div");
            SorryNote.className = "sorry";

            var message = document.createElement("p");
            message.textContent =
              "Sorry No live contentents for " + query + " now.";
            SorryNote.appendChild(message);
            Row.appendChild(SorryNote);
            Row.style.maxHeight = "400px";
          } else {
            data.forEach((location) => {
              // Loop through each location in the response
              fetch("http://127.0.0.1:5001/api/v1/users/" + location.user_id) // Send a GET request to your API to get the user
                .then((response) => response.json()) // Parse the response as JSON
                .then((user) => {
                  var eventBody = document.createElement("div");
                  eventBody.className = "event-body";

                  var Content = document.createElement("div");
                  Content.className = "content";
                  var video = document.createElement("video");
                  video.className = "video";
                  fetch(
                    "http://127.0.0.1:5001/api/v1/contents/" +
                      location.content_id
                  )
                    .then((response) => response.json()) // Parse the response as JSON
                    .then((content) => {
                      video.src = content.content;
                    });
                  Content.appendChild(video);

                  eventBody.appendChild(Content);

                  // Add the user and content description elements...
                  var userElement = document.createElement("div");
                  userElement.className = "user";

                  // Create an img element
                  var imgElement = document.createElement("img");
                  imgElement.id = "user-logo";
                  imgElement.src = "../static/images/icons8-user-16.png";
                  imgElement.alt = "";

                  // Append the img element to the user element
                  userElement.appendChild(imgElement);

                  var userDescription = document.createElement("div");
                  userDescription.className = "user-description";
                  userDescription.textContent =
                    user.first_name + " " + user.last_name;
                  userElement.appendChild(userDescription);
                  eventBody.appendChild(userElement);

                  var contentDescription = document.createElement("div");
                  contentDescription.className = "content-discription";

                  fetch(
                    "http://127.0.0.1:5001/api/v1/contents/" +
                      location.content_id
                  ) // Send a GET request to your API to get the content
                    .then((response) => response.json()) // Parse the response as JSON
                    .then((content) => {
                      contentDescription.textContent = content.content;
                    });
                  eventBody.appendChild(contentDescription);

                  Row.appendChild(eventBody); // Add the new event body to the live body
                  liveBody.appendChild(Row);
                })
                .catch((error) => console.error("Error:", error));
            });
          }
        })
        .catch((error) => console.error("Error:", error));
    });
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".location-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the link from navigating
      var name = this.getAttribute("data-name"); // Get the location name

      fetch("http://127.0.0.1:5001/api/v1/locations/" + name)
        .then((response) => response.json()) // Parse the response as JSON
        .then((data) => {
          var liveBody = document.querySelector(".live-body"); // Get the live body element
          var Row = document.querySelector(".row");
          Row.style.flex = "1";

          Row.style.maxHeight = "800px";

          Row.innerHTML = ""; // Clear the row body

          var liveLogo = document.createElement("div");
          liveLogo.className = "live-logo";

          var liveLogo_img = document.createElement("img");
          liveLogo_img.src = "../static/images/live-icon.png";
          liveLogo_img.alt = "";

          liveLogo.appendChild(liveLogo_img);
          Row.appendChild(liveLogo);

          if (data.length === 1) {
            Row.style.maxHeight = "430px";
          }

          if (!Array.isArray(data) || data.length === 0) {
            // Check if the data is not an array or if it's an empty array

            var liveLogo = document.createElement("div");
            liveLogo.className = "live-logo";

            var liveLogo_img = document.createElement("img");
            liveLogo_img.src = "../static/images/live-icon.png";
            liveLogo_img.alt = "";

            liveLogo.appendChild(liveLogo_img);
            Row.appendChild(liveLogo);

            Row.addEventListener("mouseover", function () {
              this.style.overflowY = "visible"; // Change to 'visible' on hover
            });

            var imgElement = document.createElement("img");
            imgElement.id = "opps-logo";
            imgElement.src = "../static/images/opps.png";
            imgElement.alt = "";
            Row.appendChild(imgElement);
            var SorryNote = document.createElement("div");
            SorryNote.className = "sorry";

            var message = document.createElement("p");
            message.textContent =
              "Sorry No live contentents for " + query + " now.";
            SorryNote.appendChild(message);
            Row.appendChild(SorryNote);
            Row.style.maxHeight = "400px";
          } else {
            data.forEach((location) => {
              // Loop through each location in the response
              fetch("http://127.0.0.1:5001/api/v1/users/" + location.user_id) // Send a GET request to your API to get the user
                .then((response) => response.json()) // Parse the response as JSON
                .then((user) => {
                  var eventBody = document.createElement("div");
                  eventBody.className = "event-body";

                  var Content = document.createElement("div");
                  Content.className = "content";
                  var video = document.createElement("video");
                  video.className = "video";
                  fetch(
                    "http://127.0.0.1:5001/api/v1/contents/" +
                      location.content_id
                  )
                    .then((response) => response.json()) // Parse the response as JSON
                    .then((content) => {
                      video.src = content.content;
                    });
                  Content.appendChild(video);

                  eventBody.appendChild(Content);

                  // Add the user and content description elements...
                  var userElement = document.createElement("div");
                  userElement.className = "user";

                  // Create an img element
                  var imgElement = document.createElement("img");
                  imgElement.id = "user-logo";
                  imgElement.src = "../static/images/icons8-user-16.png";
                  imgElement.alt = "";

                  // Append the img element to the user element
                  userElement.appendChild(imgElement);

                  var userDescription = document.createElement("div");
                  userDescription.className = "user-description";
                  userDescription.textContent =
                    user.first_name + " " + user.last_name;
                  userElement.appendChild(userDescription);
                  eventBody.appendChild(userElement);

                  var contentDescription = document.createElement("div");
                  contentDescription.className = "content-discription";

                  fetch(
                    "http://127.0.0.1:5001/api/v1/contents/" +
                      location.content_id
                  ) // Send a GET request to your API to get the content
                    .then((response) => response.json()) // Parse the response as JSON
                    .then((content) => {
                      contentDescription.textContent = content.content;
                    });
                  eventBody.appendChild(contentDescription);

                  Row.appendChild(eventBody); // Add the new event body to the live body
                  liveBody.appendChild(Row);
                })
                .catch((error) => console.error("Error:", error));
            });
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  });
});
