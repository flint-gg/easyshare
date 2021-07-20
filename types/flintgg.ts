type Bigint = string; // later, when fully supported: type = bigint

export type flintId = Bigint; // bigint

export type flintError = {
  title: string;
  detail: string;
  status: number;
};

export type switchShareUserToken = {
  id: string;
  name: string;
};
