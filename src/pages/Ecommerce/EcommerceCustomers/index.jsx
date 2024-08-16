import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Card, CardBody, Col, Container, Row, Modal, ModalHeader, ModalBody, UncontrolledTooltip, Input, FormFeedback, Label, Form, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import axios from "axios";
import { jwt_decode } from "jwt-decode";



//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

import DeleteModal from "../../../components/Common/DeleteModal";
import {
  getCustomers as onGetCustomers,
  addNewCustomer as onAddNewCustomer,   
  updateCustomer as onUpdateCustomer,
  deleteCustomer as onDeleteCustomer,
} from "../../../store/e-commerce/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import TableContainer from "../../../components/Common/TableContainer";
import Spinners from "../../../components/Common/Spinner";
import moment from "moment";
import { ToastContainer } from "react-toastify";

// flatpickr
import "flatpickr/dist/themes/material_blue.css";
import FlatPickr from "react-flatpickr";

// PatternFormat
import { PatternFormat } from "react-number-format";

const EcommerceCustomers = () => {
  //meta title
  document.title = "Customers | Beposoft";

  const dispatch = useDispatch();

  const EcommerceCustomerProperties = createSelector(
    (state) => state.ecommerce,
    (Ecommerce) => ({
      customers: Ecommerce.customers,
      loading: Ecommerce.loading
    })
  );

  const {
    customers, loading
  } = useSelector(EcommerceCustomerProperties);

  const [isLoading, setLoading] = useState(loading)

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState(null);
  

  // const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
  const indianPinCodeRegex = /^[1-9][0-9]{5}$/;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);

  console.log("decoded token...:",decoded);


  console.log("token data", token);


  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      gst:(customer && customer.gst)  || "",
      manager:(customer && customer.manager) || "",
      name: (customer && customer.name) || "",
      phone: (customer && customer.phone) || "",
      alt_phone:(customer && customer.alt_phone) || "",
      email: (customer && customer.email) || "",
      address: (customer && customer.address) || "",
      zip_code: (customer && customer.zip_code) || "",
      city: (customer && customer.city) || "",
      state: (customer && customer.state) || "",
      comment: (customer && customer.comment) || "",
    },
    validationSchema: Yup.object({
      gst: Yup.string().matches(gstRegex,"enter valid gst number"),
      manager:Yup.string(),
      name: Yup.string().required("Please Enter Your Name"),
      phone: Yup.string().required("Please Enter Your Phone").matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
      alt_phone:Yup.string().matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
      email: Yup.string()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please Enter Valid Email"),
      address: Yup.string().required("Please Enter Your Address"),
      zip_code: Yup.string().matches(indianPinCodeRegex,"enter valid pincode")
        
        .required("Please Enter Your zip_code"),
        city: Yup.string().required("Please enter city"),
      state: Yup.string().required("select state"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCustomer = {
          id: customer ? customer.id : 0,
          username: values.username,
          phone: values.phone,
          email: values.email,
          address: values.address,
          rating: values.rating,
          walletBalance: values.walletBalance,
          joiningDate: values.joiningDate,
        };
        // update customer
        dispatch(onUpdateCustomer(updateCustomer));
        validation.resetForm();
      } else {
        const newCustomer = {  
          manager: values["manager"],
          name: values["name"],
          gst: values["gst"],
          phone: values["phone"],
          alt_phone: values["alt_phone"],
          email: values["email"],
          address: values["address"],
          zip_code: values["zip_code"],
          city: values["city"],
          state: values["state"],
          comment: values["comment"],
        };
        axios.post(`${import.meta.env.VITE_APP_APIKEY}api/add/customer/`,newCustomer,
          {headers: {"Authorization": `${token}`}}
        )
        .then((res) =>{
          console.log("customer reg completed successfully",res)
        })
        .catch((err) =>{
          console.log("customer reg failed",err)
        })
        dispatch(onAddNewCustomer(newCustomer));
        validation.resetForm();
      }
      toggle();
    },
  });

  const handleCustomerClick = (arg) => {
    const customer = arg;

    setCustomer({
      name: customer.name,
      gst: customer.gst,
      phone: customer.phone,
      alt_phone: customer.alt_phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      zip_code: customer.zip_code,
      state: customer.state,
      comment: customer.comment,
    });

    setIsEdit(true);
    toggle();
  };

  // Customer Column
  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "id",
        cell: () => {
          return <input type="checkbox" className="form-check-input" />;
        },
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => {
          return (
            <>
              <p className="mb-0">{cell.row.original.email}</p>
            </>
          );
        },
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "alt_phone",
        accessorKey: "alt_phone",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "City",
        accessorKey: "city",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return <span className="badge bg-success font-size-12"><i className="mdi mdi-star me-1"></i> {cellProps.getValue()}</span>
        }
      },
      {
        header: "address",
        accessorKey: "address",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "state",
        accessorKey: "state",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "zip_code",
        accessorKey: "zip_code",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle tag="a" className="card-drop">
                <i className="mdi mdi-dots-horizontal font-size-18"></i>
              </DropdownToggle>

              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  onClick={() => {
                    const customerData = cellProps.row.original;
                    handleCustomerClick(customerData);
                  }
                  }
                >
                  <i className="mdi mdi-pencil font-size-16 text-success me-1" id="edittooltip"></i>
                  Edit
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit
                  </UncontrolledTooltip>
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    const customerData = cellProps.row.original;
                    onClickDelete(customerData);
                  }}>
                  <i className="mdi mdi-trash-can font-size-16 text-danger me-1" id="deletetooltip"></i>
                  Delete
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Delete
                  </UncontrolledTooltip>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        }
      },
    ],
    []
  );


  const toggle = () => {
    if (modal) {
      setModal(false);
      setCustomer(null);
    } else {
      setModal(true);
    }
  };

  //delete customer
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (customer) => {
    setCustomer(customer);
    setDeleteModal(true);
  };

  const handleDeleteCustomer = () => {
    if (customer && customer.id) {
      dispatch(onDeleteCustomer(customer.id));
      setDeleteModal(false);
      setCustomer("");
    }
  };

  useEffect(() => {
    if (customers && !customers.length) {
      dispatch(onGetCustomers());
    }
  }, [dispatch, customers]);

  const handleCustomerClicks = () => {
    setIsEdit(false);
    toggle();
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCustomer}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Customers" />
          <Row>
            {
              isLoading ? <Spinners setLoading={setLoading} />
                :
                <Col xs="12">
                  <Card>
                    <CardBody>
                      <TableContainer
                        columns={columns}
                        data={customers}
                        isGlobalFilter={true}
                        isAddButton={true}
                        isPagination={true}
                        isCustomPageSize={true}
                        handleUserClick={handleCustomerClicks}
                        buttonClass="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2 addCustomers-modal"
                        buttonName=" New Customers"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        pagination="pagination"
                        SearchPlaceholder="search..."
                      />
                    </CardBody>
                  </Card>
                </Col>
            }

          </Row>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className="flex- text-center" toggle={toggle} tag="h4">
              {!!isEdit ? "Edit Customer" : "Add Customer"}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col className="col-12">
                  <div className="mb-3">
                      <Label className="form-label">Manager</Label>
                      <Input
                        name="manager"
                        type="text"
                        placeholder="enter name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.manager || ""}
                        invalid={
                          validation.touched.manager &&
                            validation.errors.manager
                            ? true
                            : false
                        }
                      />
                      {validation.touched.manager &&
                        validation.errors.manager ? (
                        <FormFeedback type="invalid">
                          {validation.errors.manager}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="enter name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ""}
                        invalid={
                          validation.touched.name &&
                            validation.errors.name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.name &&
                        validation.errors.name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.name}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Phone No</Label>
                      <input
                        className="form-control"
                        name="phone"
                        placeholder="Insert Phone No"
                        value={validation.values.phone || ""}
                        onChange={validation.handleChange}
                      />

                      {validation.touched.phone && validation.errors.phone ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.phone}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">alternative phone No</Label>
                      <input
                        className="form-control"
                        name="alt_phone"
                        placeholder="Insert Phone No"
                        value={validation.values.alt_phone || ""}
                        onChange={validation.handleChange}
                      />

                      {validation.touched.alt_phone && validation.errors.alt_phone ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.alt_phone}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Email Id</Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Insert Email Id"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email &&
                            validation.errors.email
                            ? true
                            : false
                        }
                      />
                      {validation.touched.email &&
                        validation.errors.email ? (
                        <FormFeedback type="invalid">
                          {validation.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">GST No</Label>
                      <input
                        className="form-control"
                        name="gst"
                        placeholder="Insert gst number"
                        value={validation.values.gst || ""}
                        onChange={validation.handleChange}

                      />

                      {validation.touched.gst && validation.errors.gst ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.gst}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Address</Label>
                      <Input
                        name="address"
                        type="textarea"
                        placeholder="Insert Address"
                        rows="3"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.address || ""}
                        invalid={
                          validation.touched.address &&
                            validation.errors.address
                            ? true
                            : false
                        }
                      />
                      {validation.touched.address &&
                        validation.errors.address ? (
                        <FormFeedback type="invalid">
                          {validation.errors.address}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">city</Label>
                      <Input
                        name="city"
                        type="text"
                        placeholder="Insert city"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.city || ""}
                        invalid={
                          validation.touched.city &&
                            validation.errors.city
                            ? true
                            : false
                        }
                      />
                      {validation.touched.city &&
                        validation.errors.city ? (
                        <FormFeedback type="invalid">
                          {validation.errors.city}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">pin code </Label>
                      <input
                        className="form-control"
                        name="zip_code"
                        placeholder="enter pincode "
                        value={validation.values.zip_code || ""}
                        onChange={validation.handleChange}
                      />

                      {validation.touched.phone && validation.errors.zip_code ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.zip_code}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">state</Label>
                      <input
                        className="form-control"
                        name="state"
                        placeholder="Select state"
                        value={validation.values.state || ""}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                      {validation.touched.state && validation.errors.state ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.state}</FormFeedback>
                      ) : null}
                    </div>
                    
                    <div className="mb-3">
                      <Label className="form-label">comment</Label>
                      <Input
                        name="comment"
                        type="textarea"
                        placeholder="comment"
                        rows="3"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.comment || ""}
                        invalid={
                          validation.touched.comment &&
                            validation.errors.comment
                            ? true
                            : false
                        }
                      />
                      {validation.touched.comment &&
                        validation.errors.comment ? (
                        <FormFeedback type="invalid">
                          {validation.errors.comment}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success save-customer"
                      >
                        Save
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

EcommerceCustomers.propTypes = {
  customers: PropTypes.array,
  onGetCustomers: PropTypes.func,
  onAddNewCustomer: PropTypes.func,
  onDeleteCustomer: PropTypes.func,
  onUpdateCustomer: PropTypes.func,
};

export default EcommerceCustomers;
