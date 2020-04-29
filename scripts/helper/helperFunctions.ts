const options = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export function printDate(date: Date) {
  return date.toLocaleDateString('en-GB', options);
}

export async function asyncForEach<T, F, O>(
  array: Array<T>,
  callback: (input: T, index: number, optionalParams?: O) => Promise<F>,
  optionalParams?: O,
) {
  const arr = array.map((e, i) => callback(e, i, optionalParams));
  return Promise.all<F>(arr);
}

export function calculateAge(birthday: Date) {
  const ageDate = new Date(Date.now() - new Date(birthday).valueOf());
  return Math.abs(ageDate.getFullYear() - 1970);
}

export async function convertFileToBase64(path) {
  const blob = await (await fetch(path)).blob();
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

export function convertTagToString(tag: number) {
  let divider = 1000;
  let string = '';
  while (divider > 1 && tag / divider < 1) {
    divider /= 10;
    string += '0';
  }
  string += tag;
  return string;
}

export function filterArrayUniques<T>(
  arr: Array<T>,
  unique_id: string,
  unique_id_inner?: string,
) {
  const result: Array<T> = [];
  const map = new Map();
  arr.forEach((item) => {
    if (
      !item[unique_id]
      || (unique_id_inner && !item[unique_id][unique_id_inner])
    ) {
      return;
    }
    const id = unique_id_inner
      ? item[unique_id][unique_id_inner]
      : item[unique_id];
    if (!map.has(id)) {
      map.set(id, true);
      result.push(item);
    }
  });
  return result;
}

export async function asyncWait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// https://stackoverflow.com/a/8649003/7235589
export function queryToObject(query: string) {
  return JSON.parse(
    `{"${query.replace(/&/g, '","').replace(/=/g, '":"')}"}`,
    (key, value) => (key === '' ? value : decodeURIComponent(value)),
  );
}
