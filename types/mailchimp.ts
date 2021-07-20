export type mailchimpResponse = {
  id: string;
  email_address: string;
  unique_email_id: string;
  web_id: number;
  email_type: string;
  status:
    | 'subscribed'
    | 'unsubscribed'
    | 'cleaned'
    | 'pending'
    | 'transactional';
  merge_fields: { FLINTNAME?: string; USERNAME?: string; TAG?: string };
  stats: { avg_open_rate: number; avg_click_rate: number };
  ip_signup: string;
  timestamp_signup: string;
  ip_opt: string;
  timestamp_opt: string;
  member_rating: number;
  last_changed: string;
  language: string;
  vip: boolean;
  email_client: string;
  location: {
    latitude: number;
    longitude: number;
    gmtoff: number;
    dstoff: number;
    country_code: string;
    timezone: string;
  };
  marketing_permissions: Array<Object>;
  source: string;
  tags_count: number;
  tags: Array<Object>;
  list_id: string;
  _links: Array<Object>;
};
