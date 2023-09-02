export default  function formatDate(date: Date): string {
    const now = new Date();
    const differenceInSeconds = Math.floor(
        (now.getTime() - date.getTime()) / 1000
    );

    const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

    if (differenceInSeconds < 60) {
        return "hace menos de un minuto"
    } else if (differenceInSeconds < 3600) {
        return rtf.format(-Math.floor(differenceInSeconds / 60), "minute");
    } else if (differenceInSeconds < 86400) {
        return rtf.format(-Math.floor(differenceInSeconds / 3600), "hour");
    } else if (differenceInSeconds < 2592000) {
        return rtf.format(-Math.floor(differenceInSeconds / 86400), "day");
    } else if (differenceInSeconds < 31536000) {
        return rtf.format(-Math.floor(differenceInSeconds / 2592000), "month");
    } else {
        return rtf.format(-Math.floor(differenceInSeconds / 31536000), "year");
    }
}
