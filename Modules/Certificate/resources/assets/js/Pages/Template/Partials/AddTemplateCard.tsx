interface AddTemplateCardProps {
    onClick: () => void;
}

export function AddTemplateCard({ onClick }: AddTemplateCardProps) {
    return (
        <div className="tpl-add" onClick={onClick}>
            <div className="plus-circle">
                <i className="bi bi-plus-lg"></i>
            </div>
            <div className="add-title">Tambah Template Baru</div>
            <div className="add-sub">Unggah desain dari Canva (PNG/JPG/PDF)</div>
        </div>
    );
}
