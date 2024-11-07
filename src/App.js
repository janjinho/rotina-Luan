//João Vitor Anchieta, Gabriel de França e Eduarda Oliveira

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [tasks, setTasks] = useState({ manhã: [], tarde: [], noite: [] });
  const [task, setTask] = useState('');
  const [time, setTime] = useState('manhã');
  const [category, setCategory] = useState('nenhuma');
  const [filterCategory, setFilterCategory] = useState('todas');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isNameSet, setIsNameSet] = useState(false);
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    if (name) setUserName(name);

    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'enabled') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode ? 'enabled' : 'disabled');
  }, [darkMode]);

  const handleAddTask = () => {
    if (task.trim() === '') return;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [time]: [...prevTasks[time], { text: task, category }],
    }));
    setTask('');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleRemoveTask = (time, taskIndex) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [time]: prevTasks[time].filter((_, index) => index !== taskIndex),
    }));
    setSelectedTask(null);
  };

  const handleEditTask = (time, taskIndex, newText) => {
    if (newText && newText.trim()) {
      const updatedTasks = tasks[time].map((taskItem, index) =>
        index === taskIndex ? { ...taskItem, text: newText } : taskItem
      );
      setTasks((prevTasks) => ({ ...prevTasks, [time]: updatedTasks }));
      setSelectedTask(null);
    }
  };

  const handleTaskClick = (time, taskIndex) => {
    if (selectedTask && selectedTask.timeOfDay === time && selectedTask.taskIndex === taskIndex) {
      setSelectedTask(null);
    } else {
      setSelectedTask({ timeOfDay: time, taskIndex });
    }
  };

  const filteredTasks = (time) => {
    if (filterCategory === 'todas') return tasks[time];
    return tasks[time].filter((taskItem) => taskItem.category === filterCategory);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleNameSubmit = () => {
    if (userName.trim() !== '') {
      setIsNameSet(true);
    }
  };

  const handleSubmit = () => {
    // Simulação de envio de dados
    setMessage('Dados enviados com sucesso!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      {!isNameSet ? ( 
        <div className="welcome-container">
          <div className="welcome-screen">
            <h2>Insira seu nome para começar</h2>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Digite seu nome"
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            <button onClick={handleNameSubmit}>Confirmar</button>
          </div>
        </div>
      ) : (
        <div className="app-container2">
          <header>
            <h1>Olá, {userName}! Adicione suas Tarefas</h1>
            <div className="input-area">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Digite a tarefa"
                onKeyPress={handleKeyPress}
              />
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="nenhuma">Nenhuma Categoria</option>
                <option value="estudos">Estudos</option>
                <option value="trabalho">Trabalho</option>
                <option value="saude-mental">Saúde Mental</option>
                <option value="saude-fisica">Saúde Física</option>
                <option value="lazer">Lazer</option>
                <option value="casa">Casa</option>
                <option value="urgente">Urgente</option>
              </select>
              <select
                id="time-select"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="manhã">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="noite">Noite</option>
              </select>
              <button onClick={handleAddTask}>Adicionar Tarefa</button>
              <button onClick={handleToggleDarkMode}>
                Modo {darkMode ? 'Claro' : 'Escuro'}
              </button>
              <div className="filter-area">
              <label>Filtrar por Categoria:</label>
              <select
                id="filter-category-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="estudos">Estudos</option>
                <option value="trabalho">Trabalho</option>
                <option value="saude-mental">Saúde Mental</option>
                <option value="saude-fisica">Saúde Física</option>
                <option value="lazer">Lazer</option>
                <option value="casa">Casa</option>
                <option value="urgente">Urgente</option>
                <option value="nenhuma">Nenhuma</option>
              </select>
            </div>
            </div>
            
          </header>
          <div className="container">
            <div className="task-container">
              {['manhã', 'tarde', 'noite'].map((period) => (
                <div key={period} className="task-section">
                  <h2>{period.charAt(0).toUpperCase() + period.slice(1)}</h2>
                  <ul>
                    {filteredTasks(period).map((taskItem, index) => (
                      <li
                        key={index}
                        className={`${taskItem.category} ${
                          selectedTask && selectedTask.timeOfDay === period && selectedTask.taskIndex === index ? 'selected' : ''
                        }`}
                        onClick={() => handleTaskClick(period, index)}
                      >
                        {taskItem.text}
                        <div className="task-buttons">
                          <button
                            id="botaoeditar"
                            onClick={() => handleEditTask(period, index, prompt('Edite a tarefa:', taskItem.text))}
                          >
                            Editar
                          </button>
                          <button
                            id="botaoremover"
                            onClick={() => handleRemoveTask(period, index)}
                          >
                            Remover
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit}>Enviar Dados</button>
            {message && <div className="message">{message}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
