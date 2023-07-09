const form = document.getElementById("imageForm")
const resultContainer = document.getElementById('result')
const loader = document.getElementById('loading')

form.addEventListener('submit', async function(event) {
  event.preventDefault()
  loader.className = 'loading-container'
  const formData = new FormData(form)
  const res = await fetch('http://localhost:5000/process', {method: 'POST', body: formData})

  if(res.ok){
    const blob = await res.blob()
  
    imageURL = await URL.createObjectURL(blob)
    console.log(imageURL);
    const imageElement = document.createElement('img');
    imageElement.src = imageURL;
    resultContainer.prepend(imageElement);
    loader.className = 'hidden'
    
    
  } 
})