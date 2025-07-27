import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #ecf0f1;
  border-radius: 5px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #2ecc71;
  width: ${props => props.percentage}%;
  transition: width 0.1s linear;
`;

const ProgressBar = ({ percentage }) => {
  return (
    <ProgressContainer>
      <ProgressFill percentage={percentage} />
    </ProgressContainer>
  );
};

export default ProgressBar;