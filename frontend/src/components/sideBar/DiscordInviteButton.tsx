import { Error, Loading } from "@components/axiosHelper";
import { useGetDiscordInviteUrl } from "@services";
interface DiscordInviteButtonProps {
  onlyIcon: boolean;
}
export default function DiscordInviteButton({
  onlyIcon,
}: DiscordInviteButtonProps) {
  const { data: discordInviteUrl, error, isLoading } = useGetDiscordInviteUrl();

  if (!discordInviteUrl) return null;
  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  return (
    <a
      className="common-button tertiary-button"
      href={discordInviteUrl.data}
      target="_blank"
      rel="noreferrer"
    >
      {onlyIcon ? <div> DC </div> : <div> Invite to discord </div>}
    </a>
  );
}
