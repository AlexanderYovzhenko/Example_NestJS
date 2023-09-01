export interface ConfirmCode {
  id: number;
  request_id: string;
  code: string;
  is_confirmed: boolean;
  created_at: string;
}
