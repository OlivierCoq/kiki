
import { produce } from 'immer'
const updateNestedValue = (path: string, value: any, set: any) => {
  set((prev: any) =>
    produce(prev, (draft: any) => {
      const keys = path.split('.');
      let temp: any = draft;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!temp[key]) temp[key] = {};
        temp = temp[key];
      }

      temp[keys[keys.length - 1]] = value;
    })
  );
}

export default updateNestedValue