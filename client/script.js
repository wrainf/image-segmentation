const form = document.getElementById("imageForm");
    const resultContainer = document.getElementById('result');
    const loader = document.getElementById('loading');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      loader.className = 'loading-container';
      const formData = new FormData(form);
      const res = await fetch('http://localhost:5000/process', { method: 'POST', body: formData });

      if (res.ok) {
        const blob = await res.blob();
        imageURL = await URL.createObjectURL(blob);

        const imageElement = document.createElement('img');
        imageElement.src = imageURL;
        imageElement.id = 'fullscreen-image'; // Add an id to the image element
        resultContainer.appendChild(imageElement);

        // Create a download button
        const downloadButton = document.createElement('a');
        downloadButton.href = imageURL;
        downloadButton.download = 'segmented_image.jpg'; // Specify the filename
        downloadButton.textContent = 'Download Image';
        downloadButton.className = 'download-button';
        resultContainer.appendChild(downloadButton);

        loader.className = 'hidden';
      } else {
        alert("Processing timeout: Please try a smaller resolution picture or lower number of clusters");
        loader.className = 'hidden';
      }
    });