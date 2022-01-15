export const getDateFormat = (isoDate: number): string => {
    const date = new Date(isoDate);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
}
