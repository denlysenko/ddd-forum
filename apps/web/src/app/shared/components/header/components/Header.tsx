import { Link } from 'react-router-dom';
import { Logo } from '..';
import { Points } from '../../../../modules/forum/components/posts/points';
import '../styles/Header.scss';

interface HeaderProps {
  title: string;
  subtitle?: string;
  isUpvotable?: boolean;
  onUpvoteClicked?: () => void;
  onDownvoteClicked?: () => void;
  points?: number;
  isLoggedIn?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => (
  <div className="header">
    <Logo />
    {props.isUpvotable && (
      <Points
        onUpvoteClicked={() =>
          props.onUpvoteClicked ? props.onUpvoteClicked() : ''
        }
        onDownvoteClicked={() =>
          props.onDownvoteClicked ? props.onDownvoteClicked() : ''
        }
        points={props.points as number}
        isLoggedIn={props.isLoggedIn || false}
      />
    )}
    <div className="content-container">
      <h1>{props.title}</h1>
      <p>
        <b>{props.subtitle}</b>
      </p>
      <div className="header-links">
        <Link to="/submit">submit</Link>
      </div>
    </div>
  </div>
);

export default Header;
