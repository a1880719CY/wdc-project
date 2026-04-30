 const convertToCamelCase=(data) =>{
    if (Array.isArray(data)) {
      return data.map(item => convertToCamelCase(item));
    } else if (typeof data === 'object' && data !== null) {
      return Object.entries(data).reduce((acc, [key, value]) => {
        const camelCaseKey = key.replace(/_(.)/g, (_, char) => char.toUpperCase());
        acc[camelCaseKey] = convertToCamelCase(value);
        return acc;
      }, {});
    } else {
      return data;
    }
  };
const getFormattedDate=(date = new Date())=> {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

module.exports = { convertToCamelCase,getFormattedDate };