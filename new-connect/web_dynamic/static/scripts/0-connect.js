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

/* --------this part is for the search-bar querry side ----*/
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".search-box.flex-div")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from submitting normally
      var query = document.querySelector('input[name="q"]').value; // Get the search query

      // Send a GET request to your API
      fetch("http://127.0.0.1:5001/api/v1/locations/" + query)
        .then((response) => response.json()) // Parse the response as JSON
        .then((data) => {
          // Send a GET request to get the users
          fetch("http://127.0.0.1:5001/api/v1/users")
            .then((response) => response.json()) // Parse the response as JSON
            .then((users) => {
              var list_container = document.querySelector(".list-container"); // Get the list-container element
              list_container.innerHTML = ""; // Clear the list-container

              data.contents.forEach((content) => {
                var vid_list = document.createElement("div");
                vid_list.className = "vid-list";

                var a = document.createElement("a");
                a.href = "play/" + content.id;

                var video = document.createElement("video");
                video.autoplay = true;
                video.src = content.content;
                video.className = "thumbnail";

                a.appendChild(video);
                vid_list.appendChild(a);

                var flex_div = document.createElement("div");
                flex_div.className = "flex-div";

                var img = document.createElement("img");
                img.src = "../static/images/Jack.png";

                flex_div.appendChild(img);

                var vid_info = document.createElement("div");
                vid_info.className = "vid-info";

                users.forEach((user) => {
                  if (user.id == content.user_id) {
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
                vid_list.appendChild(flex_div);

                list_container.appendChild(vid_list);
              });
            });
        });
    });
});

