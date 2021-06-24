import { Bookmark, Model } from '.';

export interface Category extends Model {
  name: string;
  type: string;
  isPinned: boolean;
  orderId: number;
  bookmarks: Bookmark[];
}

export interface NewCategory {
  name: string;
  type: string;
}