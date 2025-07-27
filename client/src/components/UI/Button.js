import styled from 'styled-components';

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.primary ? '#3498db' : '#ecf0f1'};
  color: ${props => props.primary ? 'white' : '#2c3e50'};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#bdc3c7'};
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

export default Button;