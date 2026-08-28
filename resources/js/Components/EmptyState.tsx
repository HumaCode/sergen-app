interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    actionIcon?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon = 'bi-inbox',
    title,
    description,
    actionLabel,
    actionIcon,
    onAction,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`tpl-empty-box ${className}`}>
            <div className="tpl-empty-icon">
                <i className={`bi ${icon}`}></i>
            </div>
            <div className="tpl-empty-title">{title}</div>
            {description && <div className="tpl-empty-desc">{description}</div>}
            {actionLabel && onAction && (
                <button
                    className="btn-primary-teal"
                    type="button"
                    style={{ marginTop: '12px' }}
                    onClick={onAction}
                >
                    {actionIcon && <i className={`bi ${actionIcon}`}></i>} {actionLabel}
                </button>
            )}
        </div>
    );
}
