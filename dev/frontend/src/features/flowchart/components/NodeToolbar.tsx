import { FlowchartNodeType } from '../types';

interface NodeToolbarProps {
  onAddNode: (type: FlowchartNodeType) => void;
  onSave: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

export const NodeToolbar = ({
  onAddNode,
  onSave,
  onClear,
  isLoading = false,
}: NodeToolbarProps) => {
  const nodeTypes: { type: FlowchartNodeType; label: string; icon: string }[] = [
    { type: 'start', label: '開始', icon: '⭕' },
    { type: 'process', label: '処理', icon: '⬜' },
    { type: 'decision', label: '分岐', icon: '♦️' },
    { type: 'end', label: '終了', icon: '⏹️' },
  ];

  const baseButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
  };

  const nodeButtonStyle = {
    ...baseButtonStyle,
    background:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const saveButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
    color: 'white',
    opacity: isLoading ? 0.6 : 1,
    cursor: isLoading ? 'not-allowed' : 'pointer',
  };

  const clearButtonStyle = {
    ...baseButtonStyle,
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    borderColor: 'rgba(239, 68, 68, 0.5)',
    color: 'white',
    opacity: isLoading ? 0.6 : 1,
    cursor: isLoading ? 'not-allowed' : 'pointer',
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '16px 20px',
        background:
          'linear-gradient(135deg, rgba(45, 55, 72, 0.95) 0%, rgba(74, 85, 104, 0.9) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexWrap: 'wrap',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}
      >
        {nodeTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onAddNode(type)}
            style={nodeButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div
        style={{ display: 'flex', gap: '8px', marginLeft: 'auto', position: 'relative', zIndex: 1 }}
      >
        <button
          onClick={onSave}
          disabled={isLoading}
          style={saveButtonStyle}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 6px 20px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }
          }}
        >
          {isLoading ? '保存中...' : '💾 保存'}
        </button>

        <button
          onClick={onClear}
          disabled={isLoading}
          style={clearButtonStyle}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 6px 20px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background =
                'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }
          }}
        >
          🗑️ クリア
        </button>
      </div>
    </div>
  );
};
