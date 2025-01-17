import { Button } from '../../../../../shared/components/button';

interface ProfileButtonProps {
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = (props) => {
  return props.isLoggedIn ? (
    <Button
      text={
        <span>
          {`${props.username} / `}
          {<u onClick={props.onLogout}>logout</u>}
        </span>
      }
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick={() => {}}
    />
  ) : (
    <Button
      text="Join"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/join';
        }
      }}
    />
  );
};

export default ProfileButton;
