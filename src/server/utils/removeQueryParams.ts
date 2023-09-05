export default function removeQueryParams(url:string){
    const parsedUrl = new URL(url);
    parsedUrl.search = ''; // This will remove all query parameters
    return parsedUrl.toString();
}