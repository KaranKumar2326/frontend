import React, { useEffect, useState } from 'react';
import ArtistCard from './ArtistCard';

// This component fetches all artists and displays them as cards
const AllArtistsList = ({ searchQuery }) => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url = 'http://localhost:3001/api/artists';
    // Optionally filter by search query (if backend supports it)
    if (searchQuery && searchQuery.trim() !== '') {
      url += `?q=${encodeURIComponent(searchQuery)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setArtists(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load artists.');
        setLoading(false);
      });
  }, [searchQuery]);

  if (isLoading) return <div>Loading artists...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!artists.length) return <div>No artists found.</div>;

  return (
    <>
      {artists.map(artist => (
        <ArtistCard key={artist._id} artist={artist} hidePrice />
      ))}
    </>
  );
};

export default AllArtistsList;
