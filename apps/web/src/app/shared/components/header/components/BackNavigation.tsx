import { Link } from 'react-router-dom';
import '../assets/arrow.svg';
import '../styles/BackNavigation.scss';

interface BackNavigationProps {
  to: string;
  text: string;
}

const BackNavigation: React.FC<BackNavigationProps> = (props) => (
  <Link to={props.to} className="back-nav">
    <p>{props.text}</p>
  </Link>
);

export default BackNavigation;
