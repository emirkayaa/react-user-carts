// API çağrıları

export const fetchUsers = async () => {
    const response = await fetch('https://dummyjson.com/users');
    return await response.json();
  };
  
  export const fetchOrdersByUser = async (userId) => {
    const response = await fetch(`https://dummyjson.com/carts/user/${userId}`);
    return await response.json();
  };
  
  export const addOrder = async (userId, products) => {
    const response = await fetch('https://dummyjson.com/carts/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        products,
      }),
    });
    return await response.json();
  };
  
  export const updateOrder = async (cartId, products) => {
    const response = await fetch(`https://dummyjson.com/carts/${cartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merge: true,
        products,
      }),
    });
    return await response.json();
  };
  
  export const deleteOrder = async (cartId) => {
    const response = await fetch(`https://dummyjson.com/carts/${cartId}`, {
      method: 'DELETE',
    });
    return await response.json();
  };
  