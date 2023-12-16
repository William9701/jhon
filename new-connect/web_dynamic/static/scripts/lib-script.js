document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".search-bar")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting normally
      var query = document.querySelector('input[name="q"]').value; // Get the search query

      // Send a GET request to your API
      fetch("http://127.0.0.1:5001/api/v1/locations/" + query)
        .then((response) => response.json()) // Parse the response as JSON
        .then((locations) => {
          // Check if the locations array is empty
          if (!Array.isArray(locations) || locations.length === 0) {
            var list_container = document.querySelector(".list-container");
            list_container.innerHTML = ""; // Clear the list-container

            // Display a message or take other appropriate action
            var noResults = document.createElement("div");
            var imgElement = document.createElement("img");
            imgElement.id = "opps-logo";
            imgElement.src = "../static/images/opps.png";
            imgElement.alt = "";
            noResults.appendChild(imgElement);
            var SorryNote = document.createElement("div");
            SorryNote.className = "sorry";

            var message = document.createElement("p");
            message.textContent =
              "Sorry No live content for " + query + " now.";
            SorryNote.appendChild(message);
            noResults.appendChild(SorryNote);
            list_container.appendChild(noResults);
          } else {
            // Send a GET request to get the users
            fetch("http://127.0.0.1:5001/api/v1/users")
              .then((response) => response.json()) // Parse the response as JSON
              .then((users) => {
                var list_container = document.querySelector(".list-container"); // Get the list-container element
                list_container.innerHTML = ""; // Clear the list-container

                locations.forEach((location) => {
                  var vid_list = document.createElement("div");
                  vid_list.className = "vid-list";

                  var a = document.createElement("a");
                  a.href = "play/" + location.content_id;

                  var video = document.createElement("video");
                  video.autoplay = true;

                  // Send a GET request to the content API using location.content_id
                  fetch(
                    "http://127.0.0.1:5001/api/v1/contents/" +
                      location.content_id
                  )
                    .then((response) => response.json())
                    .then((content) => {
                      // Set the video source once you have the content data
                      video.src = content.content;
                      video.className = "thumbnail";

                      var flex_div = document.createElement("div");
                      flex_div.className = "flex-div";

                      var img = document.createElement("img");
                      img.src = "../static/images/Jack.png";
                      flex_div.appendChild(img);

                      var vid_info = document.createElement("div");
                      vid_info.className = "vid-info";

                      users.forEach((user) => {
                        if (user.id == location.user_id) {
                          var user_link = document.createElement("a");
                          user_link.href = "play-video.html";
                          user_link.textContent =
                            user.first_name + " " + user.last_name;

                          vid_info.appendChild(user_link);
                        }
                      });

                      var p_desc = document.createElement("p");
                      p_desc.textContent = content.description;

                      var p_views = document.createElement("p");
                      p_views.textContent = content.number_of_views + " views";

                      vid_info.appendChild(p_desc);
                      vid_info.appendChild(p_views);

                      flex_div.appendChild(vid_info);

                      a.appendChild(video);
                      vid_list.appendChild(a);
                      vid_list.appendChild(flex_div);
                      list_container.appendChild(vid_list);
                    })
                    .catch((error) =>
                      console.error("Error fetching content:", error)
                    );
                });
              })
              .catch((error) => console.error("Error fetching users:", error));
          }
        })
        .catch((error) => console.error("Error fetching locations:", error));
    });

  var menuicon = document.querySelector(".menu-icon");
  var sidebar = document.querySelector(".sidebar");
  var container = document.querySelector(".container");

  menuicon.onclick = function () {
    sidebar.classList.toggle("small-sidebar");
    container.classList.toggle("large-container");
  };

  
});

/* --------this part is for the location icon querry side ----*/
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".location-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the link from navigating
      var name = this.getAttribute("data-name"); // Get the location name

      // Send a GET request to your API
      fetch("http://127.0.0.1:5001/api/v1/locations/" + name)
        .then((response) => response.json()) // Parse the response as JSON
        .then((locations) => {
          // Check if the locations array is empty
          if (!Array.isArray(locations) || locations.length === 0) {
            var list_container = document.querySelector(".list-container");
            list_container.innerHTML = ""; // Clear the list-container

            // Display a message or take other appropriate action
            var noResults = document.createElement("div");
            var imgElement = document.createElement("img");
            imgElement.id = "opps-logo";
            imgElement.src = "../static/images/opps.png";
            imgElement.alt = "";
            noResults.appendChild(imgElement);
            var SorryNote = document.createElement("div");
            SorryNote.className = "sorry";

            var message = document.createElement("p");
            message.textContent =
              "Sorry No live content for " + query + " now.";
            SorryNote.appendChild(message);
            noResults.appendChild(SorryNote);
            list_container.appendChild(noResults);
          } else {
            // Send a GET request to get the users
            fetch("http://127.0.0.1:5001/api/v1/users")
              .then((response) => response.json()) // Parse the response as JSON
              .then((users) => {
                var list_container = document.querySelector(".list-container"); // Get the list-container element
                list_container.innerHTML = ""; // Clear the list-container

                locations.forEach((location) => {
                  var vid_list = document.createElement("div");
                  vid_list.className = "vid-list";

                  var a = document.createElement("a");
                  a.href = "play/" + location.content_id;

                  var video = document.createElement("video");
                  video.autoplay = true;

                  // Send a GET request to the content API using location.content_id
                  fetch(
                    "http://127.0.0.1:5001/api/v1/contents/" +
                      location.content_id
                  )
                    .then((response) => response.json())
                    .then((content) => {
                      // Set the video source once you have the content data
                      video.src = content.content;
                      video.className = "thumbnail";

                      var flex_div = document.createElement("div");
                      flex_div.className = "flex-div";

                      var img = document.createElement("img");
                      img.src = "../static/images/Jack.png";
                      flex_div.appendChild(img);

                      var vid_info = document.createElement("div");
                      vid_info.className = "vid-info";

                      users.forEach((user) => {
                        if (user.id == location.user_id) {
                          var user_link = document.createElement("a");
                          user_link.href = "play-video.html";
                          user_link.textContent =
                            user.first_name + " " + user.last_name;

                          vid_info.appendChild(user_link);
                        }
                      });

                      var p_desc = document.createElement("p");
                      p_desc.textContent = content.description;

                      var p_views = document.createElement("p");
                      p_views.textContent = content.number_of_views + " views";

                      vid_info.appendChild(p_desc);
                      vid_info.appendChild(p_views);

                      flex_div.appendChild(vid_info);

                      a.appendChild(video);
                      vid_list.appendChild(a);
                      vid_list.appendChild(flex_div);
                      list_container.appendChild(vid_list);
                    })
                    .catch((error) =>
                      console.error("Error fetching content:", error)
                    );
                });
              })
              .catch((error) => console.error("Error fetching users:", error));
          }
        })
        .catch((error) => console.error("Error fetching locations:", error));
    });
  });
});
