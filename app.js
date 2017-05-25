//********************************************************
// State
//********************************************************
const state = {
  todos: [],
  visibilityFilter: 'all',
  visibilityFilters: ['all', 'active', 'completed'],
};

//********************************************************
// Controller
//********************************************************
function addTodo(todo) {
  state.todos = [...state.todos, todo];
}

function clearInputValue(input) {
  input.value = '';
}

function getVisibleTodos(todos, visibilityFilter) {
  switch (visibilityFilter) {
    case 'all':
      return todos;
    case 'active':
      return todos.filter(todo => !todo.isCompleted);
    case 'completed':
      return todos.filter(todo => todo.isCompleted);
    default:
      return todos;
  }
}

function handleSubmit(e) {
  e.preventDefault();
  if (inputDOM.value === '') {
    return;
  }

  const newTodo = {
    text: inputDOM.value,
    id: Date.now(),
    isCompleted: false,
  };
  addTodo(newTodo);
  clearInputValue(inputDOM);

  renderTodos(state.todos, state.visibilityFilter);
}

function toggleTodo(id) {
  state.todos = state.todos.map(todo => {
    if (todo.id === Number(id)) {
      return Object.assign({}, todo, { isCompleted: !todo.isCompleted });
    }
    return todo;
  });
}

function handleTodoClick(e) {
  if (!e.target.matches('li')) {
    return;
  }
  toggleTodo(e.target.id);
  renderTodos(state.todos, state.visibilityFilter);
}

function handleFilterClick(e) {
  if (!e.target.matches('a')) {
    return;
  }
  state.visibilityFilter = e.target.dataset.visibilityFilter;
  renderTodos(state.todos, state.visibilityFilter);
  renderVisibilityFilters(state.visibilityFilters, state.visibilityFilter);
}

//********************************************************
// Render
//********************************************************
const inputDOM = document.getElementById('js-input');
const todosDOM = document.getElementById('js-todos');
const visibilityFilterLinksDOM = document.getElementById(
  'js-visibility-filters'
);

document.forms[0].addEventListener('submit', handleSubmit);
todosDOM.addEventListener('click', handleTodoClick);
visibilityFilterLinksDOM.addEventListener('click', handleFilterClick);

function renderTodos(todos, visibilityFilter) {
  const visibleTodos = getVisibleTodos(todos, visibilityFilter);

  todosDOM.innerHTML = visibleTodos
    .map(todo => {
      return `
        <li
          class=${todo.isCompleted ? 'completed-todo' : 'not-completed-todo'}
          id=${todo.id}
        >
          ${todo.text}
        </li>
    `;
    })
    .join('');
}

function renderVisibilityFilters(allVisibilityFilters, visibilityFilter) {
  visibilityFilterLinksDOM.innerHTML = allVisibilityFilters
    .map(filter => {
      return `
        <a
          href="#"
          class="${filter === visibilityFilter ? 'selected-filter' : ''}"
          data-visibility-filter="${filter}"
        >
          ${filter.charAt(0).toUpperCase() + filter.slice(1)}
        </a>
      `;
    })
    .join('');
}

renderVisibilityFilters(state.visibilityFilters, state.visibilityFilter);
