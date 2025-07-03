import { Link } from "wouter";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import "./CallToAction.css";

export default function CallToAction() {
  return (
    <section className="call-to-action-section">
      <div className="call-to-action-bg">
        <div className="hero-gradient"></div>
      </div>

      <div className="call-to-action-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-container"
        >
          <h2 className="cta-heading" style={{ color: "#fff" }}>
            Ready to Make Your Event Unforgettable?
          </h2>
          <p className="cta-subheading">
            From intimate gatherings to grand celebrations, find the perfect musical talent to create magical moments.
          </p>
          <div className="cta-buttons">
            <Link href="/artists">
              <button
                className="cta-button primary-btn semicircle-btn"
                style={{
                  fontWeight: 'bold',
                  padding: '20px 60px',
                  fontSize: '1rem',
                  borderRadius: '40px', // full semicircle on both sides
                  backgroundColor: '#6c2bd9',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                Browse Musicians
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
