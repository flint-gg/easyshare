const options = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const s3BaseUrl = 'https://flint-gg.s3.eu-central-1.amazonaws.com/images/';

export function printDate(date: Date) {
  return date.toLocaleDateString('en-GB', options);
}

export async function asyncForEach<T, F, O>(
  array: Array<T>,
  callback: (input: T, index: number, optionalParams?: O) => Promise<F>,
  optionalParamsUsed?: O,
) {
  const arr = array.map((e, i) => callback(e, i, optionalParamsUsed));
  return Promise.all<F>(arr);
}

export async function asyncWait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
