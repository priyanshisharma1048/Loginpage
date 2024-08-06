import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; // Import confirmAlert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import StudentForm from "./StudentForm";
import Header from "./Header";

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

const buttonStyles = {
  base: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
    marginRight: '5px',
  },
  edit: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  delete: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  add: {
    backgroundColor: '#008CBA',
    color: 'white',
    marginTop: '20px',
    textAlign:'center'
  },
  navigate: {
    backgroundColor: '#ffa500',
    color: 'white',
    marginTop: '20px',
    textAlign:'center'
  },
  navigateTeacher: {
    backgroundColor: 'purple',
    color: 'white',
    marginTop: '20px',
    textAlign:'center'
  },
};

const Student = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", age: "", email: "", class: "" });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", age: "", email: "", class: "" });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/items", {
          params: { search: searchTerm }
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching data!");
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]); // Add searchTerm as dependency

  const handleEditClick = (student) => {
    setEditId(student.id);
    setEditFormData({ name: student.name, age: student.age, email: student.email, class: student.class });
    setModalIsOpen(true);
  };

  const handleSaveClick = async () => {
    console.log("Saving student with id:", editId, "with data:", editFormData);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/edit-items/${editId}`,
        editFormData
      );
      console.log("Save response:", response.data);

      if (response.data.message === "Item updated successfully") {
        setData(
          data.map((student) =>
            student.id === editId ? { ...student, ...editFormData } : student
          )
        );
        setEditId(null);
        setModalIsOpen(false);
        toast.success(response.data.message);
      } else if (response.data.message === "Email already in use, please try with a different email") {
        toast.error(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data!");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this student?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteStudent(id)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };

  const deleteStudent = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/items/${id}`
      );
      setData(data.filter((student) => student.id !== id));
      console.log("Deleted student with id:", id);
      toast.success(response.data.message || "Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Error deleting student!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNewStudentInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleAddStudent = async () => {
    console.log("Adding new student:", newStudent);
    const validateStudent = (student) => {
      if (!student.name || !student.age || student.age <= 4 || !student.email || !student.class) {
        !student.name && toast.error("Name field is required");
        !student.age && toast.error("Age field is required");
        student.age <= 4 && toast.error("Age must be greater than 4");
        !student.email && toast.error("Email field is required");
        !student.class && toast.error("Class field is required");
        return false;
      }
      return true;
    };

    if (!validateStudent(newStudent)) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-items",
        newStudent
      );

      if (response.data.status === false) {
        toast.error(response.data.message);
      } else {
        console.log("Add response:", response.data);
        setData([...data, response.data.data[0]]);
        setModalIsOpen(false);
        setNewStudent({ name: "", age: "", email: "", class: "" });
        toast.success(response.data.message || "Student added successfully!");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Error adding student!");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleTableClick = () => {
    navigate("/Insurance");
  };

  const handleTeacherClick = () => {
    navigate("/teacher");
  };

  return (
<div>
      <ToastContainer />
      <Header/>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>

      <input style={{
        
        width: '300px',
        padding: '10px 10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontSize: '16px',
        marginBottom: '20px',
        margin:'20px'
      }}
        type="text"
        placeholder="Search by name, email, age, or class"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
      <div style={tableStyles.container}>
        <h1>Student List</h1>
      </div>
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={tableStyles.th}>Name</th>
            <th style={tableStyles.th}>Age</th>
            <th style={tableStyles.th}>Email</th>
            <th style={tableStyles.th}>Class</th>
            <th style={tableStyles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
  {data.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8d7da', color: '#721c24' }}>
        Record not found
      </td>
    </tr>
  ) : (
    data.map((student, index) => (
      <tr key={student.id}>
        <td style={tableStyles.td}>{student.name}</td>
        <td style={tableStyles.td}>{student.age}</td>
        <td style={tableStyles.td}>{student.email}</td>
        <td style={tableStyles.td}>{student.class}</td>
        <td style={tableStyles.td}>
          <button 
            onClick={() => handleEditClick(student)}
            style={{ ...buttonStyles.base, ...buttonStyles.edit }}
          >
            Edit
          </button>
          <button 
            onClick={() => handleDeleteClick(student.id)}
            style={{ ...buttonStyles.base, ...buttonStyles.delete }}
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => setModalIsOpen(true)} 
          style={{ ...buttonStyles.base, ...buttonStyles.add }}
        >
          Add New Student
        </button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={customStyles}
          contentLabel="Student Form"
        >
          <StudentForm
            formData={editId ? editFormData : newStudent}
            handleInputChange={editId ? handleInputChange : handleNewStudentInputChange}
            handleSubmit={editId ? handleSaveClick : handleAddStudent}
            handleCancel={() => setModalIsOpen(false)}
            isEditMode={!!editId}
          />
        </Modal>
        <button 
          onClick={handleTableClick}
          style={{ ...buttonStyles.base, ...buttonStyles.navigate }}
        >
          Go to Insurance
        </button>
        <button 
          onClick={handleTeacherClick}
          style={{ ...buttonStyles.base, ...buttonStyles.navigateTeacher }}
        >
          Go to Teacher
        </button>
      </div>
    </div>
  );
};

export default Student;
