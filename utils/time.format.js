export const relativeTimeFormat = (date, lang = "tr") => {
    const timeMs = typeof date === "number" ? date : date.getTime();
    const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
    const cuttofs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
    const units = ["second", "minute", "hour", "day", "week", "month", "year"];

    const unitIndex = cuttofs.findIndex((cuttof) => cuttof > Math.abs(deltaSeconds));
    const divisor = unitIndex ? cuttofs[unitIndex - 1] : 1;

    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto", style: "long", localeMatcher: "best fit" });
    const relativeTime = rtf.format(
        Math.floor(deltaSeconds / divisor), units[unitIndex]
    );

    return relativeTime
};
