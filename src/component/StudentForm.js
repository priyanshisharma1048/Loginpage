import React from "react";

const StudentForm = ({ formData, handleInputChange, handleSubmit, handleCancel, isEditMode }) => {
  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        {isEditMode ? "Edit Student" : "Add New Student"}
      </h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "10px", width: "100%" }}
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "10px", width: "100%" }}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "10px", width: "100%" }}
          />
        </label>
        <br />
        <label>
          Class:
          <input
            type="text"
            name="class"
            value={formData.class}
            onChange={handleInputChange}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", marginBottom: "10px", width: "100%" }}
          />
        </label>
        <br />
        <button
          type="button"
          onClick={handleSubmit}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            padding: "10px 20px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "4px",
            width: "100%"
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            padding: "10px 20px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
            borderRadius: "4px",
            width: "100%"
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default StudentForm;
