import React from 'react';

const Task = ({ task, deleteTask, toggleComplete }) => {
  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task._id)}
        />
        <span>{task.text}</span>
      </div>
      <button 
        onClick={() => deleteTask(task._id)}
        className="delete-btn"
      >
        Delete
      </button>
    </div>
  );
};

export default Task;