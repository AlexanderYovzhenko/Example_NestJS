export interface Publication {
  id: number;
  title: string;
  content: string;
  preview: string;
  is_hidden: boolean;
  user_id: number;
  category_id: number;
}
