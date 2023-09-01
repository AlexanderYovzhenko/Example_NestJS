export interface TelegramChat {
  id: number;
  username: string;
  first_name: string | null;
  chat_id: string;
  is_blocked: boolean;
}
