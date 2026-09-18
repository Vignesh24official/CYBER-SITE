import React from 'react';
import { NetworkTopology } from '../../components/common/NetworkTopology';

export const NetworkTopologyPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <NetworkTopology />
    </div>
  );
};
