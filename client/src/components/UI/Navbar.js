import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from './Button';

const NavbarContainer = styled.nav`
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavItems = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &:hover {
    background-color: #34495e;
  }
`;

const Navbar = ({ username, onLogout }) => {
  return (
    <NavbarContainer>
      <Brand>Crypto Crash</Brand>
      <NavItems>
        <span>Welcome, {username}</span>
        <NavLink to="/">Game</NavLink>
        <NavLink to="/wallet">Wallet</NavLink>
        <Button onClick={onLogout}>Logout</Button>
      </NavItems>
    </NavbarContainer>
  );
};

export default Navbar;