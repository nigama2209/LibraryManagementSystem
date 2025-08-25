import { lazy, Suspense } from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProtectedRoute = lazy(() => import("./ProtectRoute"));
const LoginPage = lazy(() => import("./components/LoginPage"));
const HomePage = lazy(() => import("./components/HomePage"));

function App() {
  return (
    <Suspense
      fallback={
        <Container
          fluid
          className="vh-100 d-flex justify-content-center align-items-center bg-light">
          <Row>
            <Col className="text-center">
              <Spinner animation="border" variant="dark" role="status" />
              <p className="mt-3 fs-5">Loading, please wait...</p>
            </Col>
          </Row>
        </Container>
      }>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/lms"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
