//Vars
const userInput =  document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const displayTodo = document.getElementById("display-todo");
const currentItem = {};
const navTodo = document.getElementById("todo");
const navFeedback = document.getElementById("feedback");
const navNotes = document.getElementById("notes");
const navDrills = document.getElementById("drills");
const currentInput = document.querySelectorAll(".selected-input");
const inputContainer = document.getElementById("input-container")
const dialog = document.querySelector("dialog");
const scrollContainer = document.getElementById("scroll-container");
let canEdit = 1;


//Local Storage for the different containers
const todoItem = JSON.parse(localStorage.getItem("data")) || [];
const formItem = JSON.parse(localStorage.getItem("form")) || [];

// Locates item index
const itemLocation = (item) => todoItem.findIndex((el)=> el.id === item.parentElement.id);
const itemLocationForm = (item) => formItem.findIndex((el)=> el.id === item.parentElement.id);
//Saves Storage
const saveStorage = () => { localStorage.setItem("data", JSON.stringify(todoItem))
renderTodo();}

const saveForm = () => {localStorage.setItem("form", JSON.stringify(formItem))
    displayFormItems();
};
//drills

const drills = ["Cut the deck at a random point, turn over the top card and riffle stack the value of the top card on top of the card",
    "Do a single lift, then a double lift, then a tripple lift, then a double, then a single and repeat",
    "Palm the top card as you cut the deck, place the cut half on the table, and replace the palmed card on top of the half in your hand you carry that half forward to complete the cut"
]

const drillSelector = () => {
    const random = Math.floor(Math.random()*drills.length);
    return drills[random];}

//Handles adding an item
const addItem = ()=>{
    if(userInput.value){
let taskObj = {
    id: `${userInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    task: userInput.value,
    checked: 0
}
todoItem.unshift(taskObj);
localStorage.setItem("data", JSON.stringify(todoItem))
    }}

//Handles removing an item
const removeParent = (item)=>{
        const index = itemLocation(item);
    todoItem.splice(index,1)
    saveStorage();
    }

    const removeParentForm = (item)=>{
        const index = itemLocationForm(item);
    formItem.splice(index,1)
    displayFormItems();
    saveForm()
    }

//Handles editing and confirming
const editItem1 = (item)=>{
    if (canEdit) {
        canEdit--;
        const index = itemLocation(item);
        const parentEl = item.parentElement;
        const {id, task} = todoItem[index];
        
        parentEl.innerHTML = `
        <div id="${id}" class="todo-item">
            <input type="text" id="${id}-input" value="${task}" class="selected-input">
            <button onclick="editItem2('${id}')" id="${id}-edit" class="edit-btn fa-solid fa-check fa-lg btn"></button>
        </div>`;
        
        const newInput = document.getElementById(`${id}-input`);
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
        newInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                editItem2(id);
            }
        });
    } else {
        return;
    }
};
     const editItem2 = (item)=>{
        const index = todoItem.findIndex((el)=> el.id === item);
         const {id, task, checked} =  todoItem[index];
         const newInput = document.getElementById(`${id}-input`)
         const taskObj = {
            id: id,
            task: newInput.value,
            checked:checked
        }
        todoItem.splice(index,1,taskObj)
         saveStorage();
        canEdit ++;}

         const cross = (item) => {
            const index = itemLocation(item);
            let {checked, id,task} = todoItem[index];
            console.log(checked)
            console.log(id)

            if(checked === 0){
            item.classList.remove("fa-circle")
            item.classList.add("fa-circle-check")
            item.parentElement.querySelector("h2").classList.add("crossed")
            checked ++;
            const taskObj ={
                id: id,
                task: task,
                checked: checked
            }
            todoItem.splice(index,1,taskObj);
            saveStorage();
        }

            else if(checked === 1) {item.classList.remove("fa-circle-check")
                item.classList.add("fa-circle")
                item.parentElement.querySelector("h2").classList.remove("crossed")
                checked --;


                const taskObj ={
                    id: id,
                    task: task,
                    checked: checked
                }
                todoItem.splice(index,1,taskObj)
                saveStorage();

        
            }
         }

       

 //Handles rendering all items 
const renderTodo =()=>{
displayTodo.innerHTML = "";
todoItem.forEach(({id, task, checked}) => {
    displayTodo.innerHTML += 
    `<div id="${id}" class="todo-item">
        <button id="${id}-button" onclick="cross(this) "class="fa-regular fa-lg btn"></button>
        <h2 id="${id}-task"><strong>${task} </strong></h2>
        <button onclick ="editItem1(this)" class="btn fa-solid fa-ellipsis-vertical fa-lg edit-btn"></button>
        <button onclick="removeParent(this)" class="delete-btn btn fa-regular fa-lg fa-trash-can"></button>
    </div>`
    if(checked){document.getElementById(`${id}-button`).classList.add("fa-circle-check");
document.getElementById(`${id}-task`).classList.add("crossed")}
    else{document.getElementById(`${id}-button`).classList.add('fa-circle')}
    }
)}






// Event Listener
submitBtn.addEventListener("click",()=>{
    addItem();
    userInput.value = "" ;
    renderTodo();

})

userInput.addEventListener("keydown",(e)=>{
    if(e.key === "Enter" && userInput.value !== ""){
    addItem();
    userInput.value = "" ;
    renderTodo();}})



// //render if todoItem exists
 if(todoItem){
     renderTodo();
     }

     navTodo.addEventListener("click", ()=>{
        inputContainer.classList.remove("hidden");
        scrollContainer.innerHTML = '';
        renderTodo()
        
     })

     navFeedback.addEventListener("click", ()=>{
        inputContainer.classList.add("hidden");
        renderForm();
        
     })

     navDrills.addEventListener("click",()=>{
        inputContainer.classList.add("hidden");
        scrollContainer.innerHTML = '';
        renderDrill();
        
     })

     

 //render for the form

 //Add form atributes where it will save and make sure that the form will display entries below, maybe with a pop-up?
let dateForm, eventForm, whatWentForm, improveForm, memmorableForm, weirdForm, notesForm, submitForm;
 
const renderForm = ()=>{
    displayTodo.innerHTML = ""
    displayTodo.innerHTML= `<div id="form">
                        <form>
                            <label for="date">Date</label>
                            <input type="date" id="date">
                            <label for="event">Event</label>
                            <input id="event" type="text">
                            <label for="what-went">What went well?</label>
                            <input id="what-went" type="text">
                            <label for="improve">What do you want to improve?</label>
                            <input id="improve" type="text">
                            <label for="memmorable">Most memorable moment?</label>
                            <input id="memmorable" type="text">
                            <label for="weird">Were there any moments that felt weird to you?</label>
                            <input id="weird" type="text">
                            <label for="random-notes">Random notes</label>
                            <input id="random-notes" type="text">
                            <button type="button" id="submit-form">Submit</button>
                        </form>
                       </div>`

    dateForm = document.getElementById("date");
    eventForm = document.getElementById("event");
    whatWentForm = document.getElementById("what-went");
    improveForm = document.getElementById("improve");
    memmorableForm = document.getElementById("memmorable");
    weirdForm = document.getElementById("weird");
    notesForm = document.getElementById("random-notes");
    submitForm = document.getElementById("submit-form");
    displayFormItems();


         submitForm.addEventListener("click", (e)=>{
            e.preventDefault();
            getForm();
            saveForm;
            console.log(formItem);
            displayFormItems();
            document.querySelectorAll("form input").forEach(input => input.value = '')
                    
                    })
}   

const getForm = () =>{
    const formObj = {
        id: `${eventForm.value.split(" ").join("-")}-${Date.now()}`,
        date: dateForm.value,
        eventF: eventForm.value,
        whatWent: whatWentForm.value,
        improve: improveForm.value,
        memmorable: memmorableForm.value,
        weird: weirdForm.value,
        notes: notesForm.value,
    }
    formItem.unshift(formObj);
    saveForm();
}

const displayFormItems = () =>{
    scrollContainer.innerHTML='';
    formItem.forEach(({id, date, eventF} )=> {
        scrollContainer.innerHTML += `
        <div id=${id} class="form-filled">
                                <h2 class="info-form">${date}</h2>
                                <h2 class="info-form">${eventF}</h2>
                                <button onclick="renderModal(this)" class="show-form">Show More</button>
                                <button onclick="removeParentForm(this)">Delete</button>
                            </div>
        `
    });
};


const renderModal = (item) => {
    const index = itemLocationForm(item);
    console.log(index)
    const currentFormObj = formItem[index];
    const {id, date, eventF, whatWent, improve, memmorable, weird, notes} = currentFormObj;
    dialog.innerHTML = `
    <div id="${id}">
     <h3 class="form-header"> Date</h3>
              <p class="form-text">${date}</p>
              <h3 class="form-header">Event</h3>
              <p class="form-text">${eventF}</p>
              <h3 class="form-header">What went well? </h3>
              <p class="form-text">${whatWent}</p>
              <h3 class="form-header">What do you want to improve? </h3>
              <p class="form-text">${improve}</p>
              <h3 class="form-header">Most Memmorable moment</h3>
              <p class="form-text">${memmorable}</p>
              <h3 class="form-header"> Weird Moments?</h3>
              <p class="form-text">${weird} </p>
              <h3 class="form-header">Notes</h3>
              <p class="form-text">${notes}</p>
              <button onclick="dialog.close()" id="close-modal">Close</button>
    </div>
    `
    dialog.showModal();
    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect()
        if (
          e.clientX < dialogDimensions.left ||
          e.clientX > dialogDimensions.right ||
          e.clientY < dialogDimensions.top ||
          e.clientY > dialogDimensions.bottom
        ) {
          dialog.close()
        }
      })
}





//DRILL
const renderDrill = ()=>{
    displayTodo.innerText = "";
    displayTodo.innerHTML = `
    <div id="drills-js">
    <h2>The Drill is:</h2>
    <p id="drill-text">Press button to generate</p>
    <button id="drillButton">Generate</button></div>`
    const drillButton = document.getElementById("drillButton");
    const drillText = document.getElementById("drill-text");
    drillButton.addEventListener("click", ()=>{
        const newDrill = drillSelector();
        console.log(newDrill)
        drillText.innerHTML= newDrill;


    })
}

