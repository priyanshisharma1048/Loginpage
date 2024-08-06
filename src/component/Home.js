import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';


const Home = () => {
  const navigate = useNavigate();

  const handleInsuranceClick = () => {
    navigate('/insurance');
  };

  const handleStudentClick = () => {
    navigate('/student');
  };

  const handleTeacherClick = () => {
    navigate('/teacher');
  };

  return (
    <div>
      <Header/>
<h1 style={{ color: 'red', fontFamily: 'Arial, sans-serif' }}>
            Home Page
        </h1>
      <button onClick={handleInsuranceClick} style={{ padding: '10px 20px',color:'black',backgroundColor:'green', margin: '10px',fontSize: '16px' }}>
        Go to Insurance Page
      </button>
      <button onClick={handleStudentClick} style={{ padding: '10px 20px',color:'black',backgroundColor:'red', margin: '13px',fontSize: '16px' }}>
        Go to Student Page
      </button>
      <button onClick={handleTeacherClick} style={{ padding: '10px 20px',color:'black',backgroundColor:'yellow', fontSize: '16px',margin: '10px' }}>
        Go to Teacher Page
      </button>
    </div>
  );
};

export default Home;
