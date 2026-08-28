interface TemplateToolbarProps {
    currentStatus: string;
    currentOrientation: string;
    onStatusChange: (status: string) => void;
    onOrientationChange: (orientation: string) => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
    stats: {
        total: number;
        active: number;
        inactive: number;
        landscape: number;
        portrait: number;
    };
}

export function TemplateToolbar({
    currentStatus,
    currentOrientation,
    onStatusChange,
    onOrientationChange,
    viewMode,
    onViewModeChange,
    stats,
}: TemplateToolbarProps) {
    return (
        <div className="toolbar-wrap">
            <div className="chip-row">
                <button
                    type="button"
                    className={`chip-item ${currentStatus === 'all' && currentOrientation === 'all' ? 'active' : ''}`}
                    onClick={() => {
                        onStatusChange('all');
                        onOrientationChange('all');
                    }}
                >
                    Semua ({stats.total})
                </button>
                <button
                    type="button"
                    className={`chip-item ${currentStatus === 'active' ? 'active' : ''}`}
                    onClick={() => onStatusChange(currentStatus === 'active' ? 'all' : 'active')}
                >
                    Aktif ({stats.active})
                </button>
                <button
                    type="button"
                    className={`chip-item ${currentStatus === 'inactive' ? 'active' : ''}`}
                    onClick={() => onStatusChange(currentStatus === 'inactive' ? 'all' : 'inactive')}
                >
                    Nonaktif ({stats.inactive})
                </button>
                <button
                    type="button"
                    className={`chip-item ${currentOrientation === 'landscape' ? 'active' : ''}`}
                    onClick={() => onOrientationChange(currentOrientation === 'landscape' ? 'all' : 'landscape')}
                >
                    Landscape ({stats.landscape})
                </button>
                <button
                    type="button"
                    className={`chip-item ${currentOrientation === 'portrait' ? 'active' : ''}`}
                    onClick={() => onOrientationChange(currentOrientation === 'portrait' ? 'all' : 'portrait')}
                >
                    Portrait ({stats.portrait})
                </button>
            </div>

            <div className="view-toggle">
                <button
                    type="button"
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => onViewModeChange('grid')}
                    title="Tampilan Grid"
                >
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                </button>
                <button
                    type="button"
                    className={viewMode === 'list' ? 'active' : ''}
                    onClick={() => onViewModeChange('list')}
                    title="Tampilan List"
                >
                    <i className="bi bi-list-ul"></i>
                </button>
            </div>
        </div>
    );
}
