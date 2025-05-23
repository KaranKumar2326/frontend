import { Search, Headphones, CalendarCheck } from "lucide-react";
import { Link } from "wouter";
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import "./Howitworks.css"; // Custom CSS file

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="icon" />,
      title: "1. Browse & Compare",
      description:
        "Search our extensive database of professional musicians. Filter by genre, instrument, price range, and location to find the perfect match.",
    },
    {
      icon: <Headphones className="icon" />,
      title: "2. Listen & Review",
      description:
        "Explore detailed profiles, listen to audio samples, watch videos, and read reviews from previous clients to make an informed decision.",
    },
    {
      icon: <CalendarCheck className="icon" />,
      title: "3. Book & Enjoy",
      description:
        "Send booking requests, confirm details, and secure your date. Then sit back and enjoy exceptional live music at your event.",
    },
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="how-it-works-header">
          <h2 className="how-it-works-title">How Musical Meet Works</h2>
          <p className="how-it-works-subtitle">
            Booking professional musicians for your event has never been easier.
          </p>
        </div>

        <div className="how-it-works-steps">
          {steps.map((step, index) => (
            <motion
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="how-it-works-step"
            >
              <div className="how-it-works-icon-wrapper">{step.icon}</div>
              <h3 className="how-it-works-step-title">{step.title}</h3>
              <p className="how-it-works-step-desc">{step.description}</p>
            </motion>
          ))}
        </div>

        
      </div>
    </section>
  );
}
