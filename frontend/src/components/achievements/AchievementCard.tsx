import { DateTooltip } from "@components/dateTooltip";
import { Button } from "@components/ui/button";
import { Achievement } from "@services";

interface AchievementCardProps {
  achievement: Achievement;
  onEdit?: (achievement: Achievement) => void;
  onDelete?: (id: string, name: string) => void;
}

function StatusIndicator({
  enabled,
  label,
}: {
  enabled: boolean;
  label: string;
}) {
  return (
    <div className="achievement-card__status-row-item">
      <div
        className={`achievement-card__status-dot ${
          enabled ? "status-dot--enabled" : "status-dot--disabled"
        }`}
      />
      <span>{label}</span>
    </div>
  );
}

export function AchievementCard({
  achievement,
  onEdit,
  onDelete,
}: AchievementCardProps) {
  const isCustom = !!achievement.custom;

  return (
    <div className="achievement-card">
      <div className="achievement-card__header">
        <span
          className={`achievement-card__badge ${
            isCustom ? "badge--custom" : "badge--default"
          }`}
        >
          {isCustom ? "Custom" : "Default"}
        </span>

        <div className="achievement-card__actions">
          <Button
            className="achievement-card__action-btn"
            onClick={() => onEdit?.(achievement)}
            aria-label="Edit achievement"
          >
            🖋
          </Button>

          {isCustom && (
            <button
              className="achievement-card__action-btn achievement-card__action-btn--danger"
              onClick={() => onDelete?.(achievement._id, achievement.name)}
              aria-label="Delete achievement"
            >
              ❌
            </button>
          )}
        </div>
      </div>

      <h3 className="achievement-card__title">{achievement.name}</h3>

      <div className="achievement-card__status-row">
        <StatusIndicator enabled={achievement.enabled} label="Enabled" />

        {achievement.isTime && (
          <div className="achievement-card__status-row-item">
            ⏰<span>Time-based</span>
          </div>
        )}

        {achievement.hidden && (
          <div className="achievement-card__status-row-item">
            🔒
            <span>Hidden</span>
          </div>
        )}
      </div>

      <div className="achievement-card__info">
        <div>
          <span className="achievement-card__info__label">Stage</span>
          <p className="achievement-card__info__value">
            {achievement.stages.name}
          </p>
        </div>

        <div>
          <span className="achievement-card__info__label">Tag</span>
          <span
            className={`tag-badge ${
              achievement.tag.enabled
                ? "tag-badge--enabled"
                : "tag-badge--disabled"
            }`}
          >
            {achievement.tag.name}
          </span>
        </div>
      </div>

      {isCustom && achievement.custom && (
        <div className="achievement-card__custom">
          <span className="achievement-card__custom-label">Custom Action</span>

          <p className="achievement-card__custom-text">
            {achievement.custom.action}
          </p>

          {achievement.custom.caseSensitive && (
            <span className="achievement-card__custom-case">
              Case sensitive
            </span>
          )}
        </div>
      )}

      <div className="achievement-card__footer">
        Created: <DateTooltip date={achievement.createdAt} />
        Updated:
        <DateTooltip date={achievement.updatedAt} />{" "}
      </div>
    </div>
  );
}

export function AchievementCardSkeleton() {
  return (
    <div className="achievement-card">
      <div className="achievement-card__header">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="achievement-card__actions">
          <div className="skeleton h-8 w-8" />
          <div className="skeleton h-8 w-8" />
        </div>
      </div>

      <div className="skeleton h-6 w-3-4 mb-3" />

      <div className="achievement-card__status-row">
        <div className="skeleton h-4 w-16" />
        <div className="skeleton h-4 w-20" />
      </div>

      <div className="achievement-card__info">
        <div>
          <div className="skeleton h-3 w-10 mb-1" />
          <div className="skeleton h-5 w-24" />
        </div>
        <div>
          <div className="skeleton h-3 w-8 mb-1" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
      </div>

      <div className="achievement-card__footer">
        <div className="skeleton h-3 w-28" />
        <div className="skeleton h-3 w-28" />
      </div>
    </div>
  );
}
