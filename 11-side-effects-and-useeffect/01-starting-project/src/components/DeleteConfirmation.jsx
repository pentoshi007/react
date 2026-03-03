import ProgressBar from './ProgressBar.jsx';

const TIMER = 3000;
export default function DeleteConfirmation({ open, onConfirm, onCancel }) {
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} open={open} onTimeout={onConfirm} />
    </div>
  );
}
