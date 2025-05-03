import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  artistImage from '../public/artist.jpg'; // Import the image

const dummyCards = [
  {
    name: "John Doe",
    photo: artistImage,
    place: "New York",
    genre: "Rock",
  },
  {
    name: "Jane Smith",
    photo: "/artist.jpg",
    place: "Los Angeles",
    genre: "Pop",
  },
  {
    name: "Mike Johnson",
    photo: "/artist.jpg",
    place: "Chicago",
    genre: "Jazz",
  },
  {
    name: "Emily Davis",
    photo: "/artist.jpg",
    place: "San Francisco",
    genre: "Classical",
  },
];

const CardList = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Redirect to homepage
  const redirectToHome = () => {
    navigate('/home');  // Change '/home' to your actual homepage route
  };

  return (
    <div>
      <h2>Find Artist</h2>
      <div style={styles.cardContainer}>
        {dummyCards.map((card, index) => (
          <div key={index} style={styles.card}>
            <h3>{card.name}</h3>
            <p>{card.genre}</p>
            <p>{card.place}</p>
            <img src={artistImage} alt={card.name} style={styles.photo} />
          </div>
        ))}
      </div>

      {/* Button to redirect to homepage */}
      <button style={styles.button} onClick={redirectToHome}>Go to Homepage</button>
    </div>
  );
};

const styles = {
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  photo: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  button: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#6C2BD9', // Updated to match "View Cards" button
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
};
export default CardList;