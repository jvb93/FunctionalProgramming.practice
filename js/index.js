var todos = [];

// self-calling function to set up initial event listeners and pull todos from localstorage
(function() {

    //if any todos already exist in localstorage, populate our todolist array
    if(localStorage.getItem('todos') && localStorage.getItem('todos') !== '{}' ){
        todos =  JSON.parse(localStorage.getItem('todos'));
    }

    //wire up an event listener to add a new todo when entered
    //note we have to pass a lot of varaibles in. that's thinking in terms of FP - ALL dependencies are explicitly provided
    setupAddTodoListener(document.getElementById("newTodoInput"), todos, addTodo, document.getElementById("todoList"));

    //initial DOM populate with todos
    populateTodoList(document.getElementById("todoList"), todos);

 
 })();

 // add todo listener
function setupAddTodoListener(element, todoArray, fn, todoList){
    element.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {
            fn(element.value, todoArray, todoList);
            element.value = null;
        }
    });
}

// add a todo item
function addTodo(text, todoArray, todoList){

    todoArray.push({
        isComplete: false,
        text: text
    });

    saveTodosToStorage(todoArray);
    clearTodoList(todoList);
    populateTodoList(todoList, todoArray);

}

// loop through todo array and add each to DOM
function populateTodoList(todoList, todoArray){

    for(var item = 0; item < todoArray.length; item++){
        appendTodo(todoList, todoArray, item);
    }
}

//clear the todo DOM
function clearTodoList(todoList){
    while (todoList.firstChild){
        todoList.removeChild(todoList.firstChild);
    } 
}

// flush todo array to storage
function saveTodosToStorage(todoArray)
{
    localStorage.setItem('todos', JSON.stringify(todoArray));
}

// render a todo to the DOM
function appendTodo(todoList, todoArray, index) {
    var li = document.createElement("li");
    
    appendCheckbox(todoList, todoArray, li, index);

    li.appendChild(document.createTextNode(todoArray[index].text));
    if(todoArray[index].isComplete)
    {
        li.classList.toggle('strike');
    }

    appendDeleteButton(todoList, todoArray, li, index);
    
    todoList.appendChild(li);
}

// add a delete button to the todo list
function appendDeleteButton(todoList, todoArray, li, index){
    var deleteButton = document.createElement("a");
    deleteButton.classList.add("fas");
    deleteButton.classList.add("fa-trash-alt");
    deleteButton.classList.add("is-pulled-right");
    deleteButton.setAttribute('data-index', index);
    deleteButton.addEventListener("click", function (e) {
        
        removeTodo(todoList, todoArray, e.target.getAttribute("data-index"));
    });
    
    li.appendChild(deleteButton);

}

// add a completion checkbox to the todo list
function appendCheckbox(todoList, todoArray, li, index){
    var checkboxWrapper = document.createElement("label");
    checkboxWrapper.classList.add("margin-right");
    
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute('data-index', index);
    checkbox.addEventListener("click", function (e) {        
        toggleTodoComplete(todoList, todoArray, e.target.getAttribute("data-index"));
    });


    
    if(todoArray[index].isComplete)
    {
        checkbox.setAttribute("checked", null);   
    }
    checkboxWrapper.appendChild(checkbox);
    li.appendChild(checkboxWrapper);


}

// event handler for when a todo is checked. sets whether or not the todo is complete
function toggleTodoComplete(todoList, todoArray, index){
    todoArray[index].isComplete =  !todoArray[index].isComplete;
    saveTodosToStorage(todoArray);
    clearTodoList(todoList);
    populateTodoList(todoList, todoArray);
}

// delete a todo from the list
function removeTodo(todoList, todoArray, index){

    todoArray.splice(index, 1);
    saveTodosToStorage(todoArray);
    clearTodoList(todoList);
    populateTodoList(todoList, todoArray);

}