import React, { useState, useEffect, useCallback } from 'react';
import axios from './axiosConfig'; // Import the configured Axios instance
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const App = () => {
  const [dishes, setDishes] = useState([]);

  const fetchDishes = useCallback(async () => {
    try {
      const response = await axios.get('/dishes'); // Use the base URL from axiosConfig
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
      await axios.post('/dishes/toggle', { dishId }); // Use the base URL from axiosConfig
      socket.emit('dish_toggled');
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  return (
    <div>
      <h1>Dish Dashboard</h1>
      <ul>
        {dishes.map((dish) => (
          <li key={dish.dishId}>
            <img src={dish.imageUrl} alt={dish.dishName} width="100" />
            <p>{dish.dishName}</p>
            <p>{dish.isPublished ? 'Published' : 'Unpublished'}</p>
            <button onClick={() => togglePublish(dish.dishId)}>
              {dish.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
