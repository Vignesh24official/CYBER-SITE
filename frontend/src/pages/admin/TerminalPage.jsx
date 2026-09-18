import React from 'react';
import { TerminalPanel } from '../../components/common/TerminalPanel';

export const TerminalPage = () => {
  return (
    <div style={{ height: 'calc(100vh - 120px)' }}>
      <TerminalPanel isExpanded={true} />
    </div>
  );
};
