import { memo } from 'react';
import { log } from '../../log.js';

const IconButton = memo(function IconButton({ children, icon, ...props }) {
  log('<IconButton /> rendered', 2);
  // Memo prevents unnecessary re-renders when parent state changes are unrelated
  // and this button receives the same props (label, icon, and click handler).

  const Icon = icon;
  return (
    <button {...props} className="button">
      <Icon className="button-icon" />
      <span className="button-text">{children}</span>
    </button>
  );
});

export default IconButton;
