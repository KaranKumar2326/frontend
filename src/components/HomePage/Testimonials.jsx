import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  Avatar,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme
} from "@mui/material";
import "./Testimonials.css";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['/api/testimonials/featured'],
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isTablet = useMediaQuery(theme.breakpoints.down("md")); // <900px

  const containerRef = useRef(null);
  const totalSlides = testimonials?.length || 0;

  const goToSlide = (slideIndex) => {
    if (!containerRef.current) return;
    const slideWidth = isMobile ? 100 : isTablet ? 50 : 33.333;
    setCurrentSlide(slideIndex);
    containerRef.current.style.transform = `translateX(-${slideIndex * slideWidth}%)`;
  };

  const prevSlide = () => {
    const newSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(newSlide);
  };

  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % totalSlides;
    goToSlide(newSlide);
  };

  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, totalSlides]);

  useEffect(() => {
    if (currentSlide >= totalSlides) {
      goToSlide(0);
    } else {
      goToSlide(currentSlide);
    }
  }, [isMobile, isTablet, totalSlides]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`star-icon ${i < rating ? "active" : ""}`} />
    ));
  };

  return (
    <section id="testimonials" className="testimonial-section">
      <div className="container">
        <div className="header">
          <h2>What Our Clients Say</h2>
          <p>
            Hear from event planners and individuals who found their perfect musical match.
          </p>
        </div>

        <div className="carousel-container">
          {isLoading ? (
            <div className="loading">
              <CircularProgress />
            </div>
          ) : testimonials?.length > 0 ? (
            <>
              <div className="carousel-wrapper">
                <div ref={containerRef} className="carousel-track">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="carousel-slide">
                      <Card className="testimonial-card">
                        <CardContent>
                          <div className="stars">{renderStars(Number(testimonial.rating))}</div>
                          <p className="testimonial-content">"{testimonial.content}"</p>
                          <div className="testimonial-footer">
                            <Avatar
                              src={testimonial.clientImage || "https://via.placeholder.com/48"}
                              alt={testimonial.clientName}
                              className="testimonial-avatar"
                            />
                            <div>
                              <h4 className="client-name">{testimonial.clientName}</h4>
                              <p className="event-type">{testimonial.eventType}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {totalSlides > 1 && (
                <>
                  <Button className="carousel-btn left" onClick={prevSlide}>
                    <ChevronLeft />
                  </Button>
                  <Button className="carousel-btn right" onClick={nextSlide}>
                    <ChevronRight />
                  </Button>

                  <div className="carousel-indicators">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        className={`indicator-dot ${index === currentSlide ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="no-testimonials">No testimonials available yet</p>
          )}
        </div>
      </div>
    </section>
  );
}
