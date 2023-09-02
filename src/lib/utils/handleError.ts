import { toast } from "react-toastify";

function alert(content:string){
    return toast.error(content)
}


export default function handleError(error: unknown) {

    console.error(error)

    

}
