interface GetAllHistoryFilter {
  userId?: string;
  label?: string;
  createdAt?: {
    from?: string;
    to?: string;
    exact?: string;
  };
}
