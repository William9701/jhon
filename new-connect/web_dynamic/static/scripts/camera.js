var recordedBlobs = [];
var filename;
window.onload = function () {
  var video = document.getElementById("video");
  var previewVideo = document.getElementById("previewVideo");
  var mediaRecorder;
  var saveButton = document.getElementById("saveButton");

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (event) {
          if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
          }
        };

        mediaRecorder.onstop = function () {
          var blob = new Blob(recordedBlobs, { type: "video/mp4" });

          previewVideo.src = window.URL.createObjectURL(blob);

          previewVideo.style.display = "block"; // Show the preview video element
          video.style.display = "none"; // Hide the original video element
          saveButton.style.display = "block";

          saveButton.addEventListener("click", function () {
            var url = window.URL.createObjectURL(blob);

            // Create a unique filename using the current date and time
            filename = generateFilename();

            // Send the data to a server
            var formData = new FormData();
            formData.append("file", blob, filename);
            fetch("/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.blob();
              })
              .then((data) => {
                console.log("File sent to the server successfully");
                var userId = document.body.getAttribute("data-user-id");
                console.log(userId);
                console.log(filename);

                // Prompt the user for the content description
                var contentDescription = prompt(
                  "Please enter the content description:"
                );

                // Pass the content description to the createContentTable function
                createContentTable(userId, contentDescription);

                // Go back to the previous page
                setTimeout(function () {
                  window.location.reload();
                }, 4000);
              })
              .catch((error) => {
                console.error(
                  "There has been a problem with your fetch operation:",
                  error
                );
              });
          });
        };
      });
  }

  /* document.getElementById("snap").addEventListener("click", function () {
    var canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    var context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, 640, 480);
    canvas.toBlob(function (blob) {
      // Generate filename for snapshot
      filename = generateFilename("png");

      // Send the data to a server
      var formData = new FormData();
      formData.append("file", blob, filename);
      fetch("/upload_snapshot", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((data) => {
          console.log("Snapshot sent to the server successfully");
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    },  "image/png"); 
  }); */

  document.getElementById("start").addEventListener("click", function () {
    recordedBlobs = [];
    // Generate filename at the start of recording

    mediaRecorder.start();
    saveButton.style.display = "none"; // Hide save button during recording
    previewVideo.style.display = "none"; // Hide preview during recording
    video.style.display = "block"; // Show the original video element
  });

  document.getElementById("stop").addEventListener("click", function () {
    flashEffect(); // Call the flash effect function
    var container = document.getElementsByClassName("container")[0];
    container.style.position = "inherit";
    setTimeout(function () {
      mediaRecorder.stop();
    }, 2000); // Wait for 2 seconds before stopping the recording
  });

  function flashEffect() {
    var flashElement = document.createElement("div");
    flashElement.className = "flash";
    document.body.appendChild(flashElement);

    setTimeout(function () {
      document.body.removeChild(flashElement);
    }, 300); // Adjust the duration of the flash as needed (300 milliseconds in this example)
  }

  function generateFilename(extension) {
    var date = new Date();
    var timestamp =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0") +
      "_" +
      date.getHours().toString().padStart(2, "0") +
      date.getMinutes().toString().padStart(2, "0") +
      date.getSeconds().toString().padStart(2, "0");
    return "content_" + timestamp + "." + (extension || "mp4");
  }
};

function createContentTable(userid, contentDescription) {
  var data = {
    user_id: userid,
    content: "../static/vidFiles/videos/" + filename,
    description: contentDescription,
  };

  console.log(data.description);

  fetch("http://127.0.0.1:5001/api/v1/contents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Content sent to the server successfully", data);
      var content_id = data.id;
      fetch("https://ipapi.co/json/")
        .then((response) => response.json())
        .then((data) => {
          var name = data.region;
          var lat = data.latitude;
          var long = data.longitude;

          var location = {
            user_id: userid,
            content_id: content_id,
            name: name,
            latitude: lat,
            longitude: long,
          };

          fetch("http://127.0.0.1:5001/api/v1/locations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(location),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Content sent to the server successfully", data);
              var location_id = data.id;
              var fix = {
                location_id: location_id,
              };
              fetch("http://127.0.0.1:5001/api/v1/contents/" + content_id, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(fix),
              });
            });
        });
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}
