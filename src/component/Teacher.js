import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Header from "./Header";

import TeacherForm from "./TeacherForm";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

const buttonStyles = {
  base: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
    marginRight: '5px',
    marginBottom: '10px',
  },
  edit: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  delete: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  other:{
    backgroundColor:'purple'
  },
  add: {
    backgroundColor: '#008CBA',
    color: 'white',
    marginTop: '20px',
  },
  navigate: {
    backgroundColor: '#ffa500',
    color: 'white',
    marginTop: '20px',
  },
};

const tableStyles = {
  table: {
    margin: '0 auto',
    borderCollapse: 'collapse',
    width: '80%',
    textAlign: 'left',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
  container: {
    textAlign: 'center',
    margin: '20px 0',
  },
};

const Teacher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", age: "", email: "", subject: "" });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", age: "", email: "", subject: "" });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/teachers", {
          params: { search: searchTerm }
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data!");
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]); // Add searchTerm as dependency

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prevTeacher) => ({ ...prevTeacher, [name]: value }));
  };

  const handleAddSubmit = async () => {
    try {
      if (newTeacher.age <= 18) {
        toast.error("Age must be greater than 18");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/add-teachers", newTeacher);

      if (response.data.status) {
        toast.success(response.data.message);
        setData([...data, response.data.data[0]]);
        setNewTeacher({ name: "", age: "", email: "", subject: "" });
        setModalIsOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error("Error adding teacher!");
    }
  };

  const handleEditClick = (teacher) => {
    setEditId(teacher.id);
    setEditFormData({ name: teacher.name, age: teacher.age, email: teacher.email, subject: teacher.subject });
    setModalIsOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      if (editFormData.age <= 18) {
        toast.error("Age must be greater than 18");
        return;
      }

      await axios.put(`http://localhost:5000/api/edit-teachers/${editId}`, editFormData);
      const updatedData = data.map((teacher) => (teacher.id === editId ? { ...teacher, ...editFormData } : teacher));
      setData(updatedData);
      setModalIsOpen(false);
      setEditId(null);
      setEditFormData({ name: "", age: "", email: "", subject: "" });
      toast.success("Teacher updated successfully");
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error("Error updating teacher!");
    }
  };
  const handleDeleteClick = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this teacher?',

      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDelete(id)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`);
      const updatedData = data.filter((teacher) => teacher.id !== id);
      setData(updatedData);
      toast.success("Teacher deleted successfully");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("Error deleting teacher!");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditId(null);
    setNewTeacher({ name: "", age: "", email: "", subject: "" });
  };

  const navigateToStudents = () => {
    navigate('/student');
  };
  const navigateToInsurance = () => {
    navigate('/insurance');
  };


  return (
    <div>
      <ToastContainer />
      <Header/>
      <div style={tableStyles.container}>
        <input
          style={{
            width: '300px',
            padding: '10px 50px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: '16px',
            marginBottom: '20px',
          }}
          type="text"
          placeholder="Search by name, email, age, or subject"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <h1>Teacher List</h1>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={tableStyles.th}>Name</th>
              <th style={tableStyles.th}>Age</th>
              <th style={tableStyles.th}>Email</th>
              <th style={tableStyles.th}>Subject</th>
              <th style={tableStyles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length===0?(
              <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8d7da', color: '#721c24' }}>
                Record not found
              </td>
            </tr>
            ) : (
            data.map((teacher) => (
              <tr key={teacher.id}>
                <td style={tableStyles.td}>{teacher.name}</td>
                <td style={tableStyles.td}>{teacher.age}</td>
                <td style={tableStyles.td}>{teacher.email}</td>
                <td style={tableStyles.td}>{teacher.subject}</td>
                <td style={tableStyles.td}>
                  <button
                    style={{ ...buttonStyles.base, ...buttonStyles.edit }}
                    onClick={() => handleEditClick(teacher)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...buttonStyles.base, ...buttonStyles.delete }}
                    onClick={() => handleDeleteClick(teacher.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      )}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          style={{ ...buttonStyles.base, ...buttonStyles.add }}
          onClick={() => setModalIsOpen(true)}
        >
          Add Teacher
        </button>
        <button
          style={{ ...buttonStyles.base, ...buttonStyles.navigate }}
          onClick={navigateToStudents}
        >
          Go to Students
        </button>
        <button
          style={{ ...buttonStyles.base, ...buttonStyles.other }}
          onClick={navigateToInsurance}
        >
          Go to Insurance
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add/Edit Teacher"
        style={customStyles}
      >
        {editId ? (
          <TeacherForm
            formData={editFormData}
            handleInputChange={handleEditInputChange}
            handleSubmit={handleEditSubmit}
            handleCancel={closeModal}
            isEditMode={true}
          />
        ) : (
          <TeacherForm
            formData={newTeacher}
            handleInputChange={handleInputChange}
            handleSubmit={handleAddSubmit}
            handleCancel={closeModal}
            isEditMode={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default Teacher;
