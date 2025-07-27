import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
`;

export default Table;