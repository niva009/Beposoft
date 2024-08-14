  import React from "react";
  import * as Yup from "yup";
  import { useFormik } from "formik";
  import { Link } from "react-router-dom";
  import axios from 'axios';
  import { useNavigate } from "react-router-dom"
 import { Row, Col, CardBody, Card, Container, Form, Label, Input, FormFeedback } from "reactstrap";


  import profileImg from "../../assets/images/profile-img.png";
  import logoImg from "../../assets/images/logo.svg";
  import lightlogo from "../../assets/images/logo-light.svg";

  const Register = () => {

    const navigate = useNavigate();

    //meta title
    document.title = "Register | Skote - Vite React Admin & Dashboard Template";

    //form validation
    const validation = useFormik({
      // enableReinitialize : use this flag when initial values needs to be changed
      // enableReinitialize: true,

      initialValues: {
        email: '',
        name: '',
        username: '',
        password: '',
        retype_password: '',
      },
      validationSchema: Yup.object({
        email: Yup.string().required("Please Enter Your Email"),
        name: Yup.string().required("Enter your name"),
        username: Yup.string().required("Please Enter Your Username"),
        password: Yup.string().required("Please Enter Your Password").min(8 ,'must to 8 charcter'),
        retype_password: Yup.string().oneOf([Yup.ref('password'),null],'password must match')
      }),
      onSubmit: (values) => {
        axios.post('https://racing-soul-suffer-alexander.trycloudflare.com/api/register/', values)
          .then((res) => {
            console.log("Registration completed successfully", res.data);
            navigate('/')
          })
          .catch((error) => {
            if (error.response) {
              // Server responded with a status other than 2xx
              console.error("Error response:", error.response.data);
            } else if (error.request) {
              // No response was received
              console.error("Error request:", error.request);
            } else {
              // Other errors
              console.error("Error", error.message);
            }
          });
      }
      
    });
    return (
      <React.Fragment>      
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={8} xl={5}>
                <Card className="overflow-hidden">
                  <div className="bg-primary-subtle">
                    <Row>
                      <Col className="col-7">
                        <div className="text-primary p-4">
                          <h2 className="text-4xl">Register Beposoft</h2>
                          <p>Welcome to Beposoft</p>
                        </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img src={profileImg} alt="" className="img-fluid" />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div className="auth-logo">
                      <Link to="/" className="auth-logo-light">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={lightlogo}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                        </div>
                      </Link>
                      <Link to="/" className="auth-logo-dark">
                        <div className="avatar-md profile-user-wid mb-4">
                          <span className="avatar-title rounded-circle bg-light">
                            <img
                              src={logoImg}
                              alt=""
                              className="rounded-circle"
                              height="34"
                            />
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      <Form className="form-horizontal"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                          <div className="mb-3">
                          <Label className="form-label">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter Name"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.name || ""}
                            invalid={
                              validation.touched.name && validation.errors.name ? true : false
                            }
                          />
                          {validation.touched.name && validation.errors.name ? (
                            <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="form-label">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email && validation.errors.email ? true : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label className="form-label">Username</Label>
                          <Input
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={
                              validation.touched.username && validation.errors.username ? true : false
                            }
                          />
                          {validation.touched.username && validation.errors.username ? (
                            <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="form-label">Password</Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password && validation.errors.password ? true : false
                            }
                          />
                          {validation.touched.password && validation.errors.password ? (
                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="form-label">retype password</Label>
                          <Input
                            name="retype_password"
                            type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.retype_password || ""}
                            invalid={
                              validation.touched.retype_password && validation.errors.retype_password ? true : false
                            }
                          />
                          {validation.touched.retype_password && validation.errors.retype_password ? (
                            <FormFeedback type="invalid">{validation.errors.retype_password}</FormFeedback>
                          ) : null}
                        </div>

                        <div className="mt-4 d-grid">
                          <button
                            className="btn btn-primary btn-block "
                            type="submit"
                          >
                            Register
                          </button>
                        </div>

                        <div className="mt-4 text-center">
                          <h5 className="font-size-14 mb-3">Sign up using</h5>

                          <ul className="list-inline">
                            <li className="list-inline-item">
                              <Link
                                to="#"
                                className="social-list-item bg-primary text-white border-primary"
                              >
                                <i className="mdi mdi-facebook" />
                              </Link>
                            </li>{" "}
                            <li className="list-inline-item">
                              <Link
                                to="#"
                                className="social-list-item bg-info text-white border-info"
                              >
                                <i className="mdi mdi-twitter" />
                              </Link>
                            </li>{" "}
                            <li className="list-inline-item">
                              <Link
                                to="#"
                                className="social-list-item bg-danger text-white border-danger"
                              >
                                <i className="mdi mdi-google" />
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="mt-4 text-center">
                          <p className="mb-0">
                            By registering you agree to the Skote{" "}
                            <Link to="#" className="text-primary">
                              Terms of Use
                            </Link>
                          </p>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    Already have an account ?{" "}
                    <Link
                      to="/pages-login"
                      className="fw-medium text-primary"
                    >
                      {" "}
                      Login
                    </Link>{" "}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  };

  export default Register;
