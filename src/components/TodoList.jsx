import React from 'react';

const TodoList = ({ todos, onCheck, onEdit, onDelete, onDragStart, onDragOver, onDrop }) => {
    return todos.map((todo, index) => (
        <div key={todo.id} className={`${todo.completed? "completed" : "uncompleted"}`}>
            {todo.completed ? (
                <div onClick={() => onCheck(todo.id)} className='checked'>
                    ✔
                </div>
            ) : (
                <div onClick={() => onCheck(todo.id)} className='unchecked'/>
            )}

            <div className="todo-content">{todo.content}</div>
            <button
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(index, e)}
                onDrop={onDrop}>
                =
            </button>
            <div>
                <button onClick={() => onEdit(todo.id)}>
                    ✎
                </button>
                <button onClick={() => onDelete(todo.id)}>
                    ✖
                </button>
            </div>
        </div>
    ));
};

export default TodoList;