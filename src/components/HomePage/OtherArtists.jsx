import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PublicArtistProfilePage.css";

export default function OtherArtists({ currentArtistId }) {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await fetch("https://backend-musical.onrender.com/api/artists");
        const data = await res.json();
        if (Array.isArray(data)) {
          setArtists(data.filter(a => (a._id || a.id) !== currentArtistId));
        }
      } catch (e) {
        setArtists([]);
      }
    };
    fetchArtists();
  }, [currentArtistId]);

  if (!artists.length) return null;

  return (
    <div className="other-artists-list">
      <h3 className="other-artists-title">Other Artists</h3>
      {artists.map(artist => (
        <div className="other-artist-card" key={artist._id || artist.id}>
          <img
            src={artist.coverImage || "/artist.jpg"}
            alt={artist.stageName}
            className="other-artist-pfp"
          />
          <div className="other-artist-name">{artist.stageName}</div>
          <button className="other-artist-view-btn" onClick={() => navigate(`/publicartistprofilepage/${artist._id || artist.id}`)}>
            View Profile
          </button>
        </div>
      ))}
    </div>
  );
}
