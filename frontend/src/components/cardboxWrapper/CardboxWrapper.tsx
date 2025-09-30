interface CardboxCommonProps {
  title: string;
  children: React.ReactNode;
}

interface CardboxItemProps extends CardboxCommonProps {
  onClickX?: () => void | unknown;
}

export default function CardboxWrapper({
  title,
  children,
}: CardboxCommonProps) {
  return (
    <div className="cardbox-wrapper">
      <div className="cardbox-header">{title}</div>
      <div className="cardbox-list">{children}</div>
    </div>
  );
}

export function CardboxItem({ title, children, onClickX }: CardboxItemProps) {
  return (
    <>
      <div className="cardbox-item common-card">
        <div className="cardbox-title">{title}</div>
        <div className="cardbox-content">
          {children}
          {onClickX ? (
            <button
              onClick={onClickX}
              className="common-button danger-button remove-cardbox-btn"
            >
              X
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
