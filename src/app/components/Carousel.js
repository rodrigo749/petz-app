// ...existing code...
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";


export default function Carousel({
  items = [],
  interval = 4000,
  showIndicators = true,
  showArrows = true,
}) {
  const [index, setIndex] = useState(0);
  const length = items.length;
  const autoplayRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!interval || length <= 1) return;
    autoplayRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % length);
    }, interval);
    return () => clearInterval(autoplayRef.current);
  }, [interval, length]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    const el = containerRef.current;
    el?.addEventListener("keydown", onKey);
    return () => el?.removeEventListener("keydown", onKey);
  }, [index, length]);

  function goTo(i) {
    if (i < 0) i = length - 1;
    if (i >= length) i = 0;
    setIndex(i);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      // reinicia autoplay para que o usuário visualize o slide por todo o intervalo
      if (interval) {
        autoplayRef.current = setInterval(() => setIndex((s) => (s + 1) % length), interval);
      }
    }
  }

  function prev() {
    goTo(index - 1);
  }
  function next() {
    goTo(index + 1);
  }

  if (!items || length === 0) return null;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-roledescription="carrossel"
      aria-label="Carrossel"
      style={styles.wrapper}
    >
      <div style={styles.track}>
        {items.map((item, i) => {
          const isObj = item && typeof item === "object" && ("src" in item || React.isValidElement(item));
          const content = React.isValidElement(item)
            ? item
            : isObj && item.src
            ? <img src={item.src} alt={item.alt || `Slide ${i + 1}`} style={styles.img} />
            : <div style={{ ...styles.slideContent }}>{String(item)}</div>;

          return (
            <div
              key={i}
              aria-hidden={i !== index}
              style={{
                ...styles.slide,
                transform: `translateX(${100 * (i - index)}%)`,
              }}
            >
              {content}
              {item && item.caption ? <div style={styles.caption}>{item.caption}</div> : null}
            </div>
          );
        })}
      </div>

      {showArrows && length > 1 && (
        <>
          <button aria-label="Slide anterior" onClick={prev} style={{ ...styles.arrow, left: 8 }}>
            ‹
          </button>
          <button aria-label="Próximo slide" onClick={next} style={{ ...styles.arrow, right: 8 }}>
            ›
          </button>
        </>
      )}

      {showIndicators && length > 1 && (
        <div style={styles.indicators}>
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para o slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              style={{
                ...styles.dot,
                ...(i === index ? styles.dotActive : {}),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  interval: PropTypes.number,
  showIndicators: PropTypes.bool,
  showArrows: PropTypes.bool,
};

const styles = {
  wrapper: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
    borderRadius: 8,
    outline: "none",
  },
  track: {
    display: "flex",
    transition: "transform 400ms ease",
    willChange: "transform",
    height: 320,
    position: "relative",
  },
  slide: {
    minWidth: "100%",
    height: "100%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  caption: {
    position: "absolute",
    left: 12,
    bottom: 12,
    background: "rgba(0,0,0,0.5)",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: 6,
    fontSize: 14,
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    background: "rgba(0,0,0,0.5)",
    color: "#fff",
    border: "none",
    width: 36,
    height: 36,
    borderRadius: 18,
    cursor: "pointer",
    fontSize: 20,
    lineHeight: "36px",
  },
  indicators: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 8,
    zIndex: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    background: "rgba(255,255,255,0.5)",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },
  dotActive: {
    background: "#fff",
    boxShadow: "0 0 0 2px rgba(0,0,0,0.15) inset",
  },
  slideContent: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
