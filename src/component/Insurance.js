import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Insurance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://gist.githubusercontent.com/cbmgit/852c2702d4342e7811c95f8ffc2f017f/raw/InsuranceCompanies.json');
        console.log('Fetched data:', response.data); 
        setData(response.data['InsuranceCompanies']['Top Insurance Companies']);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleStudentClick = () => {
    navigate('/student');
  };

  const handleTeacherClick = () => {
    navigate('/teacher');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Header/>
      <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', fontSize: '18px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>No</th>
            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #dddddd', padding: '8px', textAlign: 'left' }}>Market Capitalization</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.map((company, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #dddddd' }}>
              <td style={{ padding: '8px' }}>{company.No}</td>
              <td style={{ padding: '8px' }}>{company.Name}</td>
              <td style={{ padding: '8px' }}>{company['Market Capitalization']}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleStudentClick}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            marginRight: '10px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          Go to Student Table
        </button>
        <button
          onClick={handleTeacherClick}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#007bb5'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#008CBA'}
        >
          Go to Teacher Table
        </button>
      </div>
    </div>
  );
};

export default Insurance;
