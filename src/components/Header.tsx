import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { golfService } from "../services/golfService";
import CourseGreensModal from "./CourseGreensModal";
import "./Header.css";

interface Course {
  id: string;
  name: string;
}

const courses: Course[] = [
  { id: "pebble-beach", name: "Pebble Beach" },
  { id: "augusta-national", name: "Augusta National" },
  { id: "st-andrews", name: "St Andrews Old Course" },
  { id: "pine-valley", name: "Pine Valley" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(courseId);
    setIsModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleLogout = () => {
    golfService.logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <button className="hamburger-btn" onClick={toggleMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      
      <h1 className="header-title">Golf Metrics</h1>
      
      <button className="header-logout-btn" onClick={handleLogout}>
        Logout
      </button>

      {isMenuOpen && (
        <div className="dropdown-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
            <h3 className="dropdown-title">Course Greens</h3>
            <ul className="course-list">
              {courses.map((course) => (
                <li key={course.id} className="course-item">
                  <button
                    className="course-btn"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    {course.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isModalOpen && selectedCourse && (
        <CourseGreensModal courseId={selectedCourse} onClose={closeModal} />
      )}
    </header>
  );
}
