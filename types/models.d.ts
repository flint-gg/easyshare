declare global {
  type Bigint = string; // later, when fully supported: type = bigint

  type flintId = Bigint; // bigint

  type flintError = {
    title: string;
    detail: string;
    status: number;
  };

  type switchShareUserToken = {
    id: string;
    name: string;
  };
}
export {};
