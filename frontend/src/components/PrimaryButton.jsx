// The green button with white text used for Start, Continue and Start Over.
export default function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button type="button" className="primary-button" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
