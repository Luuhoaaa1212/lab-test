export const getUrlBaseApi = (name:string):string => {
    return `http://localhost:3001/v1/${name}`;
}
export const URL_UPLOAD_IMG:string = 'http://localhost:3001/uploads/'