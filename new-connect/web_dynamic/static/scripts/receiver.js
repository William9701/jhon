const webSocket = new WebSocket("ws://localhost:3000")

webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}
let mediaRecorder;
let recordedChunks = [];
function handleSignallingData(data) {
    switch (data.type) {
        case "offer":
            peerConn.setRemoteDescription(data.offer)
            createAndSendAnswer()
            break
        case "candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}

function createAndSendAnswer () {
    peerConn.createAnswer((answer) => {
        peerConn.setLocalDescription(answer)
        sendData({
            type: "send_answer",
            answer: answer
        })
    }, error => {
        console.log(error)
    })
}

function sendData(data) {
    data.username = username
    webSocket.send(JSON.stringify(data))
}


let localStream
let peerConn
let username

function joinCall() {

    username = document.getElementById("username-input").value

    document.getElementById("video-call-div")
    .style.display = "inline"

    navigator.getUserMedia({
        video: {
          width: { min: 640, ideal: 1920, max: 1920 },
          height: { min: 480, ideal: 1080, max: 1080 },
        },
        audio: true
    }, (stream) => {
        localStream = stream
        document.getElementById("local-video").srcObject = localStream

        let configuration = {
            iceServers: [
                {
                    "urls": ["stun:stun.l.google.com:19302", 
                    "stun:stun1.l.google.com:19302", 
                    "stun:stun2.l.google.com:19302"]
                }
            ]
        }

        peerConn = new RTCPeerConnection(configuration)
        peerConn.addStream(localStream)

        peerConn.onaddstream = (e) => {
            document.getElementById("remote-video")
            .srcObject = e.stream
        }

        peerConn.onicecandidate = ((e) => {
            if (e.candidate == null)
                return
            
            sendData({
                type: "send_candidate",
                candidate: e.candidate
            })
        })

        sendData({
            type: "join_call"
        })

    }, (error) => {
        console.log(error)
    })

    navigator.mediaDevices.getUserMedia({
      video: {
        width: { min: 640, ideal: 1920, max: 1920 },
        height: { min: 480, ideal: 1080, max: 1080 },
      },
      audio: true,
    })
    .then((stream) => {
      // Create a MediaRecorder instance
      mediaRecorder = new MediaRecorder(stream);

      // Start recording
      mediaRecorder.start();

      // Event fired when a recorded media chunk is available
      mediaRecorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
      };
    });
}

function stopRecording() {
    // Stop the recording
    mediaRecorder.stop();
  
    // Event fired when recording is stopped
    mediaRecorder.onstop = function () {
      // Create a blob from the recorded chunks
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
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
          // Prompt the user for the content description
          var contentDescription = prompt(
            "Please enter the description of your chat for saving:"
          );
          createLibraryTable(userId, contentDescription);
        });
  
      // TODO: Send the blob to your server here
    };
  }
  
  function createLibraryTable(userid, contentDescription) {
    var data = {
      user_id: userid,
      content: "../static/vidFiles/videos/" + filename,
      description: contentDescription,
    };
  
    fetch("http://127.0.0.1:5001/api/v1/libraries", {
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
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

let isAudio = true
function muteAudio() {
    isAudio = !isAudio
    localStream.getAudioTracks()[0].enabled = isAudio
}

let isVideo = true
function muteVideo() {
    isVideo = !isVideo
    localStream.getVideoTracks()[0].enabled = isVideo
}