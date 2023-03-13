import '../styles/TextInput.scss';

interface TextInputProps {
  placeholder: string;
  onChange: (val: string) => void;
  type: string;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  onChange,
  type,
}) => (
  <input
    placeholder={placeholder}
    className="text-input"
    type={type ? type : 'text'}
    onChange={(e) => onChange(e.target.value)}
  />
);

export default TextInput;
