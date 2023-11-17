(function () {
    if (window.location.pathname === "/promo") {
        console.log("SUP:", "is promo page, stop manager");
        return;
    }
    const timeOffsetAfterPromoStreamEndInMinutes: number = 3;
    const hasRedirected: boolean = !!sessionStorage.getItem("redirected");
    const isStreamPage: boolean = window.location.pathname.startsWith("/tw/");


    if (!hasRedirected) {
        console.log("SUP:", "Init App");
        redirectToIndex();
    } else if (isStreamPage) {
        console.log("SUP:", "is stream page");
        checkThisStreamCurrentlyPromo();
    } else {
        console.log("SUP:", "is index page, looking for promo link");
        const promoLink: HTMLLinkElement | null = document.querySelector("#promo_info a");
        if (promoLink && promoLink?.href) {
            const href: string = promoLink.href;
            console.log("SUP:", "promoLink found: ", href);
            if (!window.location.href.startsWith(href)) {
                console.log("SUP:", "redirecting to promo stream: ", href);
                sessionStorage.setItem("redirected", "true");
                window.location.href = promoLink.href;
            }
        } else {
            console.log("SUP:", "promo link is not found");
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

        console.log("SUP:", "start waiting next time point timeout, next time point is", nextTimePoint.toLocaleTimeString(), "time left:", (delay / 1000 / 60).toFixed(1), "minutes");

        setTimeout(() => {
            console.log("SUP: is next time point");
            if (isStreamPage) {
                checkThisStreamCurrentlyPromo();
            } else {
                window.location.reload();
            }
        }, delay);
    }

    function checkThisStreamCurrentlyPromo(): void {
        console.log("SUP: check this stream is currently promo");
        const promoPercentElement: HTMLElement = document.querySelector("#promo-percent") as HTMLElement;
        if (promoPercentElement && getComputedStyle(promoPercentElement).display !== "none") {
            console.log("SUP: this stream is currently promo");
            startWaitingNextTimePoint();
        } else {
            console.log("SUP: this stream is not promo now");
            redirectToIndex();
        }
    }

    function redirectToIndex(): void {
        console.log("SUP:", "redirect to index and parse current promo link");
        sessionStorage.setItem("redirected", "true");
        window.location.href = "/";
    }
})();