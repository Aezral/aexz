import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

export default function VerifyRequest() {
    return (
        <div className="h-full flex items-center justify-center">
            <Card className="max-w-md text-center">
                <CardHeader>
                    {/* <div className="w-32 mx-auto mt-5 mb-5">
                        <Image
                            src="/logo2.svg"
                            className="w-full"
                            width={400}
                            height={400}
                            alt="Logo"
                        />
                    </div> */}
                    <CardTitle>Revisa tu correo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Un enlace para iniciar sesión se ha enviado.</p>
                </CardContent>
            </Card>
        </div>
    );
}
