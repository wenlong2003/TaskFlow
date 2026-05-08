import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="box">
          {[...Array(10)].map((_, i) => (
            <div key={i}></div>
          ))}
        </div>
      </div>

      <main className="main-container">
        <div className="content">
          <section className="hero">
            <h1 className="title">Organize Your Life</h1>
            <p className="subtitle">Stay on top of your tasks, events, and deadlines—without the chaos.</p>
            <button className="cta-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </section>
        </div>

        <div className="section-divider"></div>

        <section className="features">
          <div className="feature-card">
            <h3>Smart Task Planning</h3>
            <p>Create and organize tasks effortlessly with intelligent scheduling that keeps you focused on what matters most.</p>
          </div>

          <div className="feature-card">
            <h3>Event Tracking</h3>
            <p>Keep all your events in one place with clear timelines so you never miss an important date or deadline.</p>
          </div>

          <div className="feature-card">
            <h3>Productivity Insights</h3>
            <p>Get a quick overview of your progress and habits to help you stay consistent and improve over time.</p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;