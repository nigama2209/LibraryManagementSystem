import { use, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { colors, BaseUrl } from "../constants/constants";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [logged, setLogged] = useState(null);

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "email") {
      if (!value) errorMsg = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = "Invalid email format";
      }
    }

    if (name === "password") {
      if (!value) errorMsg = "Password is required";
      else if (value.length < 6) {
        errorMsg = "Password must be at least 6 characters";
      }
    }

    return errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validateField(field, formData[field]);
    });

    setErrors(newErrors);

    try {
      const res = await axios.post(`${BaseUrl}/admin/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log("response", res.data);
      setLogged("Login Successful");
      localStorage.setItem("token", res.data.token);
      toast.success("Login Successful", {
        autoClose: 500,
        position: "top-center",
        onClose: () => {
          navigate("/lms");
        },
      });
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response.data);

        if (err.response.status === 400) {
          setLogged(err.response.data.message);
        } else {
          setLogged("Server error, please try again later");
        }
      } else {
        console.error("Error request:", err.request);
        setLogged("No response from server");
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: colors.themeColor }}>
      <ToastContainer />
      <Row className="w-100 justify-content-center">
        <Col xs={10} sm={8} md={6} lg={4}>
          <Form className="p-4 bg-light rounded shadow" onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Login</h3>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Text
              type="valid"
              className="d-flex justify-content-center mb-3">
              {logged}
            </Form.Text>
            <Button
              type="submit"
              className="w-100"
              style={{ backgroundColor: colors.buttonColor1, border: "none" }}>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
