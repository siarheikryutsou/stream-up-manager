"use strict";
(function () {
    if (window.location.pathname === "/promo") {
        log("is promo page, stop manager");
        return;
    }
    const timeOffsetAfterPromoStreamEndInMinutes = 3;
    const hasRedirected = !!sessionStorage.getItem("redirected");
    const isStreamPage = window.location.pathname.startsWith("/tw/");
    const embedContainer = document.querySelector("#twitch_pl");
    let embed;
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
    function waitTwitchPlayerAppend() {
        initPlayer();
        /*setTimeout(() => {
            const twitchIFrame = document.querySelector("#twitch_pl iframe") as HTMLIFrameElement;
            if (twitchIFrame) {
                log("twitch iFrame found, waiting for player will be loaded");
                twitchIFrame.addEventListener("load",() => {
                    initPlayer();
                });
            } else {
                log("twitch iFrame not found, restart waiting timer");
                waitTwitchPlayerAppend();
            }
        }, 1000);*/
    }
    function checkThisStreamCurrentlyPromo() {
        log("SUP: check this stream is currently promo");
        const promoPercentElement = document.querySelector("#promo-percent");
        if (promoPercentElement && getComputedStyle(promoPercentElement).display !== "none") {
            log("SUP: this stream is currently promo");
            startWaitingNextTimePoint();
            waitTwitchPlayerAppend();
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
    function initPlayer() {
        var _a;
        log("Current window: ", window);
        //@ts-ignore
        debugger;
        if (!((_a = document.defaultView) === null || _a === void 0 ? void 0 : _a.hasOwnProperty("Twitch"))) {
            log("twitch script not loaded, start waiting timer");
            log("setting timeout: ", window);
            setTimeout(() => {
                log("Timeout handler: ", window);
                initPlayer();
            }, 1000);
        }
        else {
            log("twitch script has been loaded, getting player instance");
            /*//https://dev.twitch.tv/docs/embed/everything/
            const channelName: string = window.location.pathname.substring(4);
            embedContainer.innerHTML = "";
            //@ts-ignore
            embed = new Twitch.Embed("twitch_pl", {
                allowfullscreen: true,
                width: "100%",
                height: "100%",
                layout: "video",
                theme: "dark",
                channel: channelName,
                parent: ["stream-up.ru"]
            });
            //@ts-ignore
            embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
                log("Player loaded and ready, set mute, lower quality, and start streaming the channel: " + channelName);
                //player = embed.getPlayer();
                const qualities = embed.getQualities();
                const lowerQuality = qualities[qualities.length - 1];
                embed.setQuality(lowerQuality.name);
                embed.setMuted();
                log("------------------")
            });*/
        }
    }
    function log(...data) {
        console.log(`SUM: [${new Date().toLocaleTimeString("ru-RU")}]`, ...data);
    }
})();
//document.querySelector("#daily-info > a")
