"use strict";
(function () {
    if (window.location.pathname === "/promo") {
        log("is promo page, stop manager");
        return;
    }
    const timeOffsetAfterPromoStreamEndInMinutes = 3;
    const hasRedirected = !!sessionStorage.getItem("redirected");
    const isStreamPage = window.location.pathname.startsWith("/tw/");
    if (!hasRedirected) {
        log("Init App");
        redirectToIndex();
    }
    else if (isStreamPage) {
        log("is stream page");
        checkThisStreamCurrentlyPromo();
    }
    else {
        log("is index page, looking for promo link");
        const promoLink = document.querySelector("#promo_info a");
        if (promoLink && (promoLink === null || promoLink === void 0 ? void 0 : promoLink.href)) {
            const href = promoLink.href;
            log("promoLink found: ", href);
            if (!window.location.href.startsWith(href)) {
                log("redirecting to promo stream: ", href);
                sessionStorage.setItem("redirected", "true");
                window.location.href = promoLink.href;
            }
        }
        else {
            log("promo link is not found");
            startWaitingNextTimePoint();
        }
    }
    function startWaitingNextTimePoint() {
        const now = new Date();
        const nextTimePoint = new Date();
        nextTimePoint.setHours(now.getHours() + 1);
        nextTimePoint.setMinutes(timeOffsetAfterPromoStreamEndInMinutes);
        nextTimePoint.setSeconds(0);
        nextTimePoint.setMilliseconds(0);
        const delay = nextTimePoint.getTime() - now.getTime();
        log("start waiting next time point timeout, next time point is", nextTimePoint.toLocaleTimeString(), "time left:", (delay / 1000 / 60).toFixed(1), "minutes");
        setTimeout(() => {
            log("SUP: is next time point");
            if (isStreamPage) {
                checkThisStreamCurrentlyPromo();
            }
            else {
                window.location.reload();
            }
        }, delay);
    }
    function checkThisStreamCurrentlyPromo() {
        log("SUP: check this stream is currently promo");
        const promoPercentElement = document.querySelector("#promo-percent");
        if (promoPercentElement && getComputedStyle(promoPercentElement).display !== "none") {
            log("SUP: this stream is currently promo");
            startWaitingNextTimePoint();
        }
        else {
            log("SUP: this stream is not promo now");
            redirectToIndex();
        }
    }
    function redirectToIndex() {
        log("redirect to index and parse current promo link");
        sessionStorage.setItem("redirected", "true");
        window.location.href = "/";
    }
    function log(...data) {
        console.log(`SUM: [${new Date().toLocaleTimeString("ru-RU")}]`, ...data);
    }
})();
//document.querySelector("#daily-info > a")
