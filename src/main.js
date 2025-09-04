import * as tmImage from "@teachablemachine/image";

const URL = "https://teachablemachine.withgoogle.com/models/p0JKqIHxw/";

let model, webcam, maxPredictions;
let modelLoaded = false; // نشون میده که مدل لود شده یا نه

async function init() {
  try {
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam").appendChild(webcam.canvas);
    window.requestAnimationFrame(loop);

    // سپس مدل را لود می‌کنیم
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    modelLoaded = true;
  } catch (err) {
    document.getElementById("label").innerText = "مشکلی در لود مدل وجود دارد.";
    console.error(err);
  }
}

async function loop() {
  webcam.update();

  if (modelLoaded) {
    await predict();
  } else {
    const label = document.getElementById("label");
    label.innerText = "درحال لود کردن مدل";
    label.className = "";
  }

  window.requestAnimationFrame(loop);
}

async function predict() {
  try {
    const prediction = await model.predict(webcam.canvas);

    let best = prediction[0];
    for (let p of prediction) {
      if (p.probability > best.probability) best = p;
    }

    const label = document.getElementById("label");

    if (best.className === "HAND" && best.probability > 0.9) {
      label.innerText = "✋🏻";
      label.classList.add("detect");
    } else if (best.className === "MOSHT" && best.probability > 0.9) {
      label.innerText = "✊🏻";
      label.classList.add("detect");
    } else {
      label.innerText = "❓🤔";
      label.classList.add("detect");
    }
  } catch (err) {
    console.error("Error in predict:", err);
  }
}

init();
