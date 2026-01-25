import { useEffect } from "react";
import "./CourseGreensModal.css";

interface GreenImage {
  hole: number;
  imagePath: string;
  description: string;
}

interface CourseGreensModalProps {
  courseId: string;
  onClose: () => void;
}

// Sample course data - you can replace these with actual image paths
const courseGreensData: Record<string, { name: string; greens: GreenImage[] }> = {
  "pebble-beach": {
    name: "Pebble Beach",
    greens: [
      { hole: 1, imagePath: "/images/pebble-beach/hole-1.jpg", description: "Hole 1 Green Slope" },
      { hole: 2, imagePath: "/images/pebble-beach/hole-2.jpg", description: "Hole 2 Green Slope" },
      { hole: 3, imagePath: "/images/pebble-beach/hole-3.jpg", description: "Hole 3 Green Slope" },
      // Add more holes as needed
    ],
  },
  "augusta-national": {
    name: "Augusta National",
    greens: [
      { hole: 1, imagePath: "/images/augusta/hole-1.jpg", description: "Hole 1 Green Slope" },
      { hole: 2, imagePath: "/images/augusta/hole-2.jpg", description: "Hole 2 Green Slope" },
      { hole: 3, imagePath: "/images/augusta/hole-3.jpg", description: "Hole 3 Green Slope" },
      // Add more holes as needed
    ],
  },
  "st-andrews": {
    name: "St Andrews Old Course",
    greens: [
      { hole: 1, imagePath: "/images/st-andrews/hole-1.jpg", description: "Hole 1 Green Slope" },
      { hole: 2, imagePath: "/images/st-andrews/hole-2.jpg", description: "Hole 2 Green Slope" },
      { hole: 3, imagePath: "/images/st-andrews/hole-3.jpg", description: "Hole 3 Green Slope" },
      // Add more holes as needed
    ],
  },
  "pine-valley": {
    name: "Pine Valley",
    greens: [
      { hole: 1, imagePath: "/images/pine-valley/hole-1.jpg", description: "Hole 1 Green Slope" },
      { hole: 2, imagePath: "/images/pine-valley/hole-2.jpg", description: "Hole 2 Green Slope" },
      { hole: 3, imagePath: "/images/pine-valley/hole-3.jpg", description: "Hole 3 Green Slope" },
      // Add more holes as needed
    ],
  },
};

export default function CourseGreensModal({ courseId, onClose }: CourseGreensModalProps) {
  const courseData = courseGreensData[courseId];

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!courseData) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <div className="modal-header">
          <h2>{courseData.name} - Green Slopes</h2>
          <p className="modal-description">
            View slope maps for each green to help plan your approach shots and putting strategy.
          </p>
        </div>

        <div className="modal-greens-grid">
          {courseData.greens.map((green) => (
            <div key={green.hole} className="modal-green-card">
              <h3 className="modal-hole-number">Hole {green.hole}</h3>
              <div className="modal-image-container">
                <img
                  src={green.imagePath}
                  alt={green.description}
                  className="modal-green-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x300?text=Image+Coming+Soon";
                  }}
                />
              </div>
              <p className="modal-green-description">{green.description}</p>
            </div>
          ))}
        </div>

        <button className="modal-close-bottom-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
