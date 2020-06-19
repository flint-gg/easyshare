declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

/*  declare module '*.svg?raw' {
  const content: string;
  export default content;
} */

declare module '*.svg?inline' {
  import { Component } from 'vue';

  const content: Component;
  export default content;
}
