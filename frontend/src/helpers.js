const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.userId; // Extract 'userId' from the decoded token
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
};



export { getUserIdFromToken };
