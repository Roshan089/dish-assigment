import React, { useState, useEffect, useCallback } from 'react';
import axios from './axiosConfig';
import { io } from 'socket.io-client';
import './App.css'; 

const socket = io('http://localhost:5000');

const App = () => {
  const [dishes, setDishes] = useState([]);

  const fetchDishes = useCallback(async () => {
    try {
      const response = await axios.get('/dishes');
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  }, []);

  useEffect(() => {
    fetchDishes();

    const handleUpdate = () => {
      fetchDishes();
      console.log('Update received from socket');
    };

    socket.on('update', handleUpdate);

    return () => {
      socket.off('update', handleUpdate);
    };
  }, [fetchDishes]);

  const togglePublish = async (dishId) => {
    try {
      await axios.post('/dishes/toggle', { dishId });
      socket.emit('dish_toggled');
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Dish Dashboard</h1>
      <ul className="ul">
        {dishes.map((dish) => (
          <li key={dish.dishId} className="li">
            <img src={dish.imageUrl} alt={dish.dishName} width="100" />
            <div>
              <p>{dish.dishName}</p>
              <p>{dish.isPublished ? 'Published' : 'Unpublished'}</p>
              <button onClick={() => togglePublish(dish.dishId)} className="button">
                {dish.isPublished ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
