import styles from "./style.scss";
import header from "./styles/_header.scss";
import footer from "./styles/_global.scss";

// Sorry, no time to split by file


const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('nav');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('active'); 
    });
}


class TodoBase {
    constructor(description) {
      this.description = description;
      this.status = 'planned';
      this.isEditing = false;
    }

    toggleEdit() {
      this.isEditing = !this.isEditing;
    }

    changeStatus(newStatus) {
      this.status = newStatus;
    }

    toObject() {
      return {
        description: this.description,
        status: this.status,
        isEditing: this.isEditing,
      };
    }
  }

  class TodoItem extends TodoBase {
    constructor(description) {
      super(description);
    }
  }

  class TodoList {
    constructor() {
      this.items = JSON.parse(localStorage.getItem('todoList')) || [];
      this.items = this.items.map(itemData => {
        const item = new TodoItem(itemData.description);
        item.changeStatus(itemData.status);
        item.toggleEdit(itemData.isEditing);
        return item;
      });
    }

    addItem(description) {
      const newItem = new TodoItem(description);
      this.items.push(newItem);
    }

    changeItemStatus(index, newStatus) {
      if (index >= 0 && index < this.items.length) {
        this.items[index].changeStatus(newStatus);
        this.save();
      }
    }

    deleteItem(index) {
      if (index >= 0 && index < this.items.length) {
        this.items.splice(index, 1);
        this.save();
      }
    }

    save() {
      localStorage.setItem('todoList', JSON.stringify(this.items.map(item => item.toObject())));
    }
  }

  const todoList = new TodoList();
  const addButton = document.getElementById('addButton');

  addButton.addEventListener('click', () => {
    const inputElement = document.getElementById('todoInput');
    const description = inputElement.value.trim();

    if (description !== '') {
      todoList.addItem(description);
      inputElement.value = '';
      renderTodoList();
    }
  });

  function renderTodoList() {
    const listElement = document.getElementById('todoList');
    listElement.innerHTML = '';

    todoList.items.forEach((item, index) => {
      const listItem = document.createElement('li');
      const classStatus = item.isEditing ? 'disabled' : 'edit'
      const descriptionInput = document.createElement('input');

      descriptionInput.type = 'text';
      descriptionInput.value = item.description;
      descriptionInput.disabled = item.isEditing;
      descriptionInput.addEventListener('input', (event) => {
        item.description = event.target.value;
      });

      const statusSelect = document.createElement('select');
      const statuses = ['planned', 'completed', 'in process'];

      statusSelect.disabled = item.isEditing;
      statuses.forEach((status) => {
        const option = document.createElement('option');
        option.text = status;
        option.value = status;
        if (item.status === status) {
          option.selected = true;
        }
        statusSelect.appendChild(option);
      });
      statusSelect.addEventListener('change', (event) => {
        item.changeStatus(event.target.value);
      });

      const editButton = document.createElement('button');

      editButton.innerText = 'Edit';
      editButton.addEventListener('click', () => {
        item.toggleEdit();
        renderTodoList();
      });

      const deleteButton = document.createElement('button');

      deleteButton.innerText = 'Delete';
      deleteButton.addEventListener('click', () => {
        todoList.deleteItem(index);
        renderTodoList();
      });

      const saveButton = document.createElement('button');

      saveButton.innerText = 'Save';
      saveButton.addEventListener('click', () => {
        item.toggleEdit();
        todoList.save();
        renderTodoList();
      });

      listItem.appendChild(descriptionInput);
      listItem.appendChild(statusSelect);
      listItem.appendChild(editButton);
      listItem.appendChild(saveButton);
      listItem.appendChild(deleteButton);

      listElement.appendChild(listItem);

      listItem.classList.add(classStatus, 'todo-app__list__item')
      console.log(deleteButton);
      editButton.classList.add('todo-app__edit')
      deleteButton.classList.add('todo-app__delete')
      saveButton.classList.add('todo-app__save')
      descriptionInput.classList.add('todo-app__description')
      statusSelect.classList.add('todo-app__status')



    });
  }

  renderTodoList();