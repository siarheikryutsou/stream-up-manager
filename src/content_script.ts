(function () {
    if (window.location.pathname === "/promo") {
        log("is promo page, stop manager");
        return;
    }
    const timeOffsetAfterPromoStreamEndInMinutes: number = 3;
    const hasRedirected: boolean = !!sessionStorage.getItem("redirected");
    const isStreamPage: boolean = window.location.pathname.startsWith("/tw/");


    if (!hasRedirected) {
        log("Init App");
        redirectToIndex();
    } else if (isStreamPage) {
        log("is stream page");
        checkThisStreamCurrentlyPromo();
    } else {
        log("is index page, looking for promo link");
        const promoLink: HTMLLinkElement | null = document.querySelector("#promo_info a");
        if (promoLink && promoLink?.href) {
            const href: string = promoLink.href;
            log("promoLink found: ", href);
            if (!window.location.href.startsWith(href)) {
                log("redirecting to promo stream: ", href);
                sessionStorage.setItem("redirected", "true");
                window.location.href = promoLink.href;
            }
        } else {
            log("promo link is not found");
            startWaitingNextTimePoint();
        }
    }

    function startWaitingNextTimePoint(): void {
        const now: Date = new Date();
        const nextTimePoint: Date = new Date();
        nextTimePoint.setHours(now.getHours() + 1);
        nextTimePoint.setMinutes(timeOffsetAfterPromoStreamEndInMinutes);
        nextTimePoint.setSeconds(0);
        nextTimePoint.setMilliseconds(0);
        const delay: number = nextTimePoint.getTime() - now.getTime();

        log("start waiting next time point timeout, next time point is", nextTimePoint.toLocaleTimeString(), "time left:", (delay / 1000 / 60).toFixed(1), "minutes");

        setTimeout(() => {
            log("SUP: is next time point");
            if (isStreamPage) {
                checkThisStreamCurrentlyPromo();
            } else {
                window.location.reload();
            }
        }, delay);
    }

    function checkThisStreamCurrentlyPromo(): void {
        log("SUP: check this stream is currently promo");
        const promoPercentElement: HTMLElement = document.querySelector("#promo-percent") as HTMLElement;
        if (promoPercentElement && getComputedStyle(promoPercentElement).display !== "none") {
            log("SUP: this stream is currently promo");
            startWaitingNextTimePoint();
        } else {
            log("SUP: this stream is not promo now");
            redirectToIndex();
        }
    }

    function redirectToIndex(): void {
        log("redirect to index and parse current promo link");
        sessionStorage.setItem("redirected", "true");
        window.location.href = "/";
    }

    function log(...data: any[]):void {
        console.log(`SUM: [${new Date().toLocaleTimeString("ru-RU")}]`, ...data);
    }
})();


//document.querySelector("#daily-info > a")