function runOCR() {
  const file = document.getElementById('fileInput').files[0];
  console.log('Selected file:', file.name, file.type, file.size);

  Tesseract.recognize(file)
    .then(result => {
      console.log("Result:", JSON.stringify(result));
      // const formattedText = result.data.text.replace(/\n/g, "<br>");
      document.getElementById('ocrOutput').textContent = result.data.text;
      setLanguage();
    })
    .catch(error => {
      console.log("Error:", error);
    });
}


function setLanguage() {
  var language = document.getElementById("language").value;
  var codeElement = document.getElementById("ocrOutput");
  codeElement.className = "language-" + language;
  hljs.highlightAll();
}


function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

function resizeImage(dataUrl, maxWidth, maxHeight, callback) {
  var img = new Image();
  img.onload = function() {
    var dimensions = calculateAspectRatioFit(img.width, img.height, maxWidth, maxHeight);
    var canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
    var resizedDataUrl = canvas.toDataURL();
    callback(resizedDataUrl);
  };
  img.src = dataUrl;
}

function previewFile() {
  const preview = document.querySelector("img");
  const file = document.querySelector("input[type=file]").files[0];
  const reader = new FileReader();
  console.log(preview.src)
  reader.addEventListener(
    "load",
    () => {
      // convert image file to base64 string
      var dataUrl = reader.result;
      var resizedDataUrl = resizeImage(dataUrl, 500, 1000, function(resizedDataUrl) {
        // Set the resized image source
        preview.src = resizedDataUrl;
      });
    },
    false
  );
  console.log(preview.src)
  if (file) {
    reader.readAsDataURL(file);
  }
}
