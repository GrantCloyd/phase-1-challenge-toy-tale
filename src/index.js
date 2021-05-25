let addToy = false

document.addEventListener("DOMContentLoaded", () => {
   const addBtn = document.querySelector("#new-toy-btn")
   const toyFormContainer = document.querySelector(".container")
   addBtn.addEventListener("click", () => {
      // hide & seek with the form
      addToy = !addToy
      if (addToy) {
         toyFormContainer.style.display = "block"
      } else {
         toyFormContainer.style.display = "none"
      }
   })
})

function getData(stringUrl, obj = {}) {
   return fetch(`http://localhost:3000/toys${stringUrl}`, obj)
      .then(resp => resp.json())
      .then(data => data)
      .catch(err => console.error("err in getData:", err))
}

function createToy(toy) {
   let { name, image, likes, id } = toy
   const toyCollection = document.querySelector("#toy-collection")
   let card = document.createElement("div")
   card.classList.add("card")
   card.innerHTML = `
   <h2>${name}</h2>
   <img src="${image}" class="toy-avatar" alt="${name}">
   <p>${likes}</p>
   <button class="like-btn" id='${id}'>Like ♥</button>
   `
   card.querySelector("button").addEventListener("click", updateLikes)
   toyCollection.append(card)
}

function updateLikes(e) {
   let likeLoc = this.previousElementSibling
   likes = Number(likeLoc.textContent) + 1
   let id = e.target.id

   let configObj = {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
         likes: likes,
      }),
   }
   getData(`/${id}`, configObj)
      .then(res => (likeLoc.innerHTML = likes))
      .catch(err => console.error("patch fail:", err))
}

const form = document.querySelector("form")
form.addEventListener("submit", createNewToy)

function createNewToy(e) {
   e.preventDefault()
   let name = e.target.name.value
   let image = e.target.image.value
   if (
      image.startsWith("http") === false ||
      (image.endsWith(".png") === false && image.endsWith(".jpeg") === false)
   ) {
      return alert("Please enter a link that starts with http and/or links to a .png or .jpeg file")
   } else {
      let configObj = {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            name: name,
            image: image,
            likes: 0,
         }),
      }
      getData("", configObj)
         .then(createToy)
         .catch(err => console.error("eror on append:", err))
      form.name.value = ""
      form.image.value = ""
   }
}

function init() {
   getData("").then(data => data.forEach(createToy))
}

init()
