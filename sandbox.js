

const list = document.querySelector('ul');
const form = document.querySelector('form');

const addRecipe = (recipe, id) => {
  let time = recipe.created_at.toDate();
  let html = `
  <li data-id="${id}">
    <div>${recipe.title}</div>
    <div>${time}</div>
    <button class="btn btn-danger btn-sm my-2" >Delete</button>
  </li>
  `;

  list.innerHTML += html;
}

const deleteRecipe = (id) => {
  const recipes = document.querySelectorAll('li');
  recipes.forEach(recipe => {
    if(recipe.getAttribute('data-id') === id){
      recipe.remove();
    }
  });
}

// get documents
db.collection('recipes').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if(change.type === 'added') {
      addRecipe(doc.data(), doc.id);
    } else if (change.type === 'removed') {
      deleteRecipe(doc.id);
    }
  })
});
 

// add documents
form.addEventListener('submit', e => {
  e.preventDefault();

  const now = new Date();
  const cook = {
    title: form.recipe.value,
    created_at: firebase.firestore.Timestamp.fromDate(now)
  };

  db.collection('recipes').add(cook).then(() => {
    console.log('Recipe added');
  }).catch(err => {
    console.log(err);
  });

});

//deleting data
list.addEventListener('click', e => {
  //console.log(e);
  if(e.target.tagName === "BUTTON") {
    const id = e.target.parentElement.getAttribute('data-id');
    db.collection('recipes').doc(id).delete().then(() => {
      console.log("Recipe deleted");
    });
  }
});