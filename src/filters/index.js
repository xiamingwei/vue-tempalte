export const emptyTo = (value) => {
    if (value === '' || value === null || value === undefined) {
      return '-';
    }
    else {
      return value;
    }
} 