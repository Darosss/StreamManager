import { useQuery } from "@tanstack/react-query";
import { BackendData, BaseEndpointNames, customAxios } from "../api";
const baseEndpointName = BaseEndpointNames.AUTH;

export const queryKeysAuth = {
  authorizeUrl: ["authorize-url"],
  discordInviteUrl: ["discord-invite-url"],
};

export const fetchAuthorizeUrl = async (): Promise<BackendData<string>> => {
  const response = await customAxios.get(`/${baseEndpointName}/authorize-url`);
  return response.data;
};
export const fetchDiscordInviteUrl = async (): Promise<BackendData<string>> => {
  const response = await customAxios.get(`/${baseEndpointName}/discord/invite`);
  return response.data;
};

export const useGetAuthorizeUrl = () => {
  return useQuery({
    queryKey: queryKeysAuth.authorizeUrl,
    queryFn: fetchAuthorizeUrl,
  });
};

export const useGetDiscordInviteUrl = () => {
  return useQuery({
    queryKey: queryKeysAuth.discordInviteUrl,
    queryFn: fetchDiscordInviteUrl,
  });
};
