import removeQueryParams from "./removeQueryParams";

const acceptedFormats = [
    'jpeg',
    "png",
    "gif",
    "webp",
    "jpg",
    "svg"
]

export default function validateImageURL(url:string){

    url = removeQueryParams(url).toLowerCase()

    for(const format of acceptedFormats){
        if(url.endsWith(`.${format}`)) return true;
    }

    return false


}