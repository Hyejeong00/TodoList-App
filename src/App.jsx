import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import "./App.css"
import TodoList from './components/TodoList.jsx'
import Modal from './Modal'
import { debounce } from './util/debounce.js'

function todoReducer(state, action){
  // 왜 필터링은 여기서 안하는거지
  switch(action.type){
    case "LOAD":
      return [...action.payload]
    case "ADD":
      return [...state,action.payload]
    case "DELETE":
      return state.filter((todo) => todo.id !== action.payload)
    case "CHECK":
      return state.map((todo) => todo.id === action.payload ? {...todo, completed: !todo.completed} : todo)
    case "EDIT":
      return state.map((todo) => todo.id === action.payload.id ? {...todo, content: action.payload.content} : todo)
    default:
      return state
  }
}

function App() {
  const [content, setContent] = useState("")
  const [todos, dispatch] = useReducer(todoReducer, [])
  const [currentTodo, setCurrentTodo] = useState({
    id: 0,
    content: "" // 아이디만 알면 되는 거 아닌가 
  })
  const [filteredTodos, setFilteredTodos] = useState([])
  const [filterType, setFilterType] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [draggingIndex, setDraggingIndex] = useState(null)
  const inputRef = useRef(null)

  //여기서 왜 callback을 사용하는지 모르겠음.... 그리고 왜 굳이 useEffect의 매개변수로 주는거지
  const filterTodos = useCallback(() => {
      if (filterType === 'checked') {
          setFilteredTodos(todos.filter((todo) => todo.completed));
      } else if (filterType === 'unchecked') {
          setFilteredTodos(todos.filter((todo) => !todo.completed));
      } else {
          setFilteredTodos(todos);
      }
  }, [filterType, todos]);

  const searchTodos = (content) => {
        setFilterType('search');
        setFilteredTodos(todos.filter((todo) => todo.content.includes(content)));
    };

  const checkedTodos = () => {
    setFilterType("checked")
    setFilteredTodos(todos.filter((todo) => todo.completed))
  }

  const unCheckedTodos = () => {
    setFilterType("unchecked")
    setFilteredTodos(todos.filter((todo) => !todo.completed))
  }

  const allTodos = () => {
    setFilterType("all")
    setFilteredTodos(todos)
  }

  const addTodo = (todo) => {
    dispatch({ type: "ADD", payload: todo})
  }

  const deleteTodo = (id) => {
    dispatch({ type: "DELETE", payload: id})
  }

  const checkTodo = (id) => {
    dispatch({ type: "CHECK", payload: id})
  }

  const editTodo = (content) => {
    dispatch({ type: "EDIT", payload: {id: currentTodo.id, content: content} })
  }

  const handleDragStart = (index) => {
    setDraggingIndex(index)
  }

  const handleDragOver = (index, e) => {
      e.preventDefault();
      if (index !== draggingIndex) {
          const newTodos = [...todos];
          const draggingItem = newTodos[draggingIndex];
          newTodos.splice(draggingIndex, 1);
          newTodos.splice(index, 0, draggingItem);
          dispatch({ type: 'LOAD', payload: newTodos });
          filterTodos();
          setDraggingIndex(index);
      }
  };

  const handleDrop = () => {
    setDraggingIndex(null)
  }

   //모달창 관련 함수
    function handleEditModalOn(id) {
        const todoContentData = todos.find((todo) => todo.id === id).content;
        setCurrentTodo({ id, content: todoContentData });
        setModalOpen(true);
    }
    function handleEditModalClose() {
        setModalOpen(false);
    }

  // 이벤트 함수는 handler, submit 이벤트 함수
  const handleSubmit = (e) => {
    e.preventDefault()
    if(content.trim() === ""){
      return inputRef.current?.focus()
    }
    addTodo({ id: Date.now(), content, completed: false })
  
    setContent("")
  }

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("todos"))
    if(savedData){
      dispatch({ type: "LOAD", payload: savedData})
    }
  },[])

  // todo 변경될 때마다 LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
    setFilteredTodos(todos)
  },[todos])

  useEffect(() => {
    filterTodos()
  },[todos, filterTodos]) //todos는 왜 필요하지.....?

  return (
    <div className='layout-container'>
      <h1>TODO LIST</h1>
      <div className='main-container'>
        <div>
          <input
            type='text' 
            onKeyUp={debounce((event) => searchTodos(event.target.value), 300)}
            placeholder='🔎 Search...'/>
          <div className='filter-button'>
            <button onClick={checkedTodos}>Checked</button>
            <button onClick={unCheckedTodos}>UnChecked</button>
            <button onClick={allTodos}>All</button>
          </div>
        </div>
        <TodoList
            todos={filteredTodos}
            onCheck={checkTodo}
            onDelete={deleteTodo}
            onEdit={handleEditModalOn}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        />
      </div>
    <form onSubmit={handleSubmit} className='flex'>
      <input type='text' value={content} onChange={(event) => setContent(event.target.value)}/>
      <button>추가</button>
    </form>
    {modalOpen && (
        <Modal onClose={handleEditModalClose} onEdit={editTodo} currentTodo={currentTodo} />
    )}
    </div>
  )
}

export default App