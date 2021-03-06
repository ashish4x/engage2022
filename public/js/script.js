let camera_button = document.querySelector("#start-camera");
camera_button.addEventListener("click", async function () {
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
  } catch (error) {
    alert(error.message);
    return;
  }

  videoInput.srcObject = stream;

  videoInput.style.display = "block";
  camera_button.style.display = "block";
  //   click_button.style.display = "block";
});

console.log("imgcompare-files loaded");

const video = document.getElementById("videoInput");

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"), //heavier/accurate version of tiny face detector
]).then(start);

console.log("face-api loaded");
function start() {
  document.body.append("Models Loaded");

  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );

  //video.src = '../videos/speech.mp4'
  console.log("video added");
  recognizeFaces();
}

async function recognizeFaces() {
  const labeledDescriptors = await loadLabeledImages();
  console.log(labeledDescriptors);
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7);

  video.addEventListener("play", async () => {
    console.log("Playing");
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      });
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvas);
      });
    }, 100);
  });
}

function loadLabeledImages() {
  //const labels = ['Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel']
  const labels = ["Ashish"]; // for WebCam
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];

      const img = await faceapi.fetchImage(
        `../labeled_images/${label}/${i}.jpg`
      );
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();
      console.log(label + i + JSON.stringify(detections));
      descriptions.push(detections.descriptor);

      document.body.append(label + " Faces Loaded | ");
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}
